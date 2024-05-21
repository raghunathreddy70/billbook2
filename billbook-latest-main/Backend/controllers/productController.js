const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const AddProducts = require("../models/addProduct");
const ProductReport = require("../models/productReport");
const PartywiseReport = require("../models/partywiseReport");
const PartywiseVendorReport = require("../models/partywiseVendorReport");
const GodownModel = require("../models/GodownModel");
const addProduct = require("../models/addProduct");
const GstModel = require("../models/GstModel");
require("dotenv").config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post("/products", async (req, res) => {
  try {
    const formData = req.body;
    console.log(formData);

    if (
      formData.itemName.trim().length <= 0 &&
      formData.serviceName.trim().length <= 0
    ) {
      res.status(400).json({ error: "Please Enter Item Name" });
      return;
    }
    if (formData.taxType === "Without Tax" && formData.gstTaxRate) {
      const gstRate = await GstModel.findById(formData.gstTaxRate);
      formData.salesPrice =
        parseFloat(formData.salesPrice) *
        (1 + gstRate.gstPercentageValue / 100);
    }

    let productName;
    if (formData.itemName) {
      productName = formData.itemName;
    } else {
      productName = formData.serviceName;
    }

    let godown;
    if (formData.Godown.length > 0) {
      GodownAllData = await GodownModel.find({});
      godown = GodownAllData.filter((godown) => {
        return formData.Godown.some(
          (godownData) => godownData.godownId === godown.godownId
        );
      });
    }

    const valueofstock =
      parseFloat(formData.purchasePrice) * parseInt(formData.openingStock) || 0;

    console.log(valueofstock);
    console.log(typeof valueofstock);

    const currentDate = Date.now();
    const randValue = Math.floor(Math.random() * 1000);

    const productID = `EasyBBProductID${currentDate
      .toString()
      .slice(3)}${randValue}`;

    function NewProductMain(index) {
      return {
        category: formData.category,
        productId: productID,
        taxType: formData.taxType,
        itemName: formData.itemName,
        itemCode: formData.itemCode,
        openingStock: formData?.Godown[index]?.stock || 0,
        salesPrice: formData.salesPrice,
        purchasePrice: formData.purchasePrice,
        stockValue: valueofstock,
        taxType: formData.taxType,
        gstTaxRate: formData.gstTaxRate,
      };
    }

    if (godown && godown.length > 0) {
      for (let i = 0; i < godown.length; i++) {
        try {
          godown[i].Products.push(NewProductMain(i));
          await godown[i].save();
        } catch (error) {
          console.log(error);
        }
      }
    }



    formData.productId = productID;
    formData.stockValue =
      parseFloat(formData.purchasePrice) * parseInt(formData.openingStock) || 0;

    if (!formData.Godown.length > 0) {
    } else {

      const godown = await GodownModel.find({});

      for(let i = 0; i< formData.Godown.length; i++){
        const godownNameMain = godown.filter(item => item.godownId === formData.Godown[i].godownId)
        console.log("godownNameMain", godownNameMain)
        console.log("godownNameMain", godownNameMain)
        formData.Godown[i].godownName = godownNameMain[0].godownName


      }


    }

    console.log("updatedformData", formData)
    const product = new AddProducts(formData); 
    const savedProduct = await product.save();
    console.log("savedProduct", product);

    res.status(201).json(savedProduct);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

router.get("/products/:bid", async (req, res) => {
  const businessid = req.params.bid;

  try {
    const products = await AddProducts.find({businessId:businessid});

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/productdetails/:id", async (req, res) => {
  try {
    const productid = req.params.id;
    const product = await AddProducts.findById(productid);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/productsbyid/:id", async (req, res) => {
  try {
    const productid = req.params.id;
    const products = await AddProducts.findOne({ productId: productid });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/productsDelete/:id/:pid", async (req, res) => {
  try {
    const ProductId = req.params.pid;
    const objectId = req.params.id;


    const deletedproduct = await AddProducts.findByIdAndDelete(objectId);

    await GodownModel.updateMany(
      {"Products.productId":  ProductId},
      { $pull: {Products: {productId:ProductId }}}
    )

    if (!deletedproduct) {
      return res.status(404).json({ error: "product record not found" });
    }
    res.status(200).json({ message: "product record deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "error to delete product record" });
  }
});

router.put("/productedit/:id", async (req, res) => {
  try {
    const productid = req.params.id;
    const updatedData = req.body;

    const updatedProduct = await AddProducts.findOneAndUpdate(
      { productId: productid },
      updatedData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product record not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update product record" });
  }
});

router.put("/adjuststock/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const updatedData = req.body;
    console.log("updatedData", updatedData);

    const quantity = parseInt(updatedData.quantity);

    console.log("quantity", quantity);

    const existingProduct = await AddProducts.findOne({ productId: productId });
    console.log("existingProduct", existingProduct);
    if (existingProduct) {
      const calculate = updatedData.addcount;
      if (calculate === "Add") {
        existingProduct.openingStock += updatedData.quantity;
      } else if (calculate === "Reduce") {
        existingProduct.openingStock -= updatedData.quantity;
      } else {
        return;
      }
    }

    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    const godownIndex = existingProduct.Godown.findIndex(
      (godown) => godown.godownId === updatedData.godown
    );
    console.log("godownIndex", godownIndex);

    if (godownIndex !== -1) {
      const calculate = updatedData.addcount;
      if (calculate === "Add") {
        existingProduct.Godown[godownIndex].stock += updatedData.quantity;
        console.log(
          "finded index godown",
          existingProduct.Godown[godownIndex].stock
        );
      } else if (calculate === "Reduce") {
        existingProduct.Godown[godownIndex].stock -= updatedData.quantity;
      } else {
        return;
      }
    } else {
      const godown = await GodownModel.findOne({
        godownId: updatedData.godown,
      });
      godown.productId = existingProduct.productId;
      await godown.save();
      const data = {
        productId: godown.productId,
        godownId: godown.godownId,
        godownName: godown.godownName,
        godownStreetAddress: godown.godownStreetAddress,
        godownCity: godown.godownCity,
        stock: updatedData.quantity,
      };

      existingProduct.Godown.push(data);
    }

    const Godown = await GodownModel.findOne({
      godownId: updatedData.godown,
    });
    console.log("Godown finded", Godown);

    const productIndex = Godown.Products.findIndex(
      (product) => product.productId === updatedData.productID
    );

    if (productIndex !== -1) {
      const calculate = updatedData.addcount;
      if (calculate === "Add") {
        Godown.Products[productIndex].openingStock += updatedData.quantity;
      } else if (calculate === "Reduce") {
        Godown.Products[productIndex].openingStock -= updatedData.quantity;
      } else {
        return;
      }
    } else {
      const product = await AddProducts.findOne({
        productId: updatedData.productID,
      });


      const newProduct = {
        category: product.category,
        productId: productId,
        taxType: product.taxType,
        itemName: product.itemName,
        itemCode: product.itemCode,
        openingStock: updatedData.quantity,
        salesPrice: product.salesPrice,
        purchasePrice: product.purchasePrice,
        stockValue: product.stockValue,
        taxType: product.taxType,
        gstTaxRate: product.gstTaxRate,
      };

      Godown.Products.push(newProduct);
      await Godown.save();
    }

    const productData = {
      productId: updatedData.productID,
      invoiceNumber: "-",
      invoiceName: "Add Stock",
      invoiceDate: new Date(),
      quantity: updatedData.quantity,
      closingStock: existingProduct.openingStock,
    };

    const newProduct = new ProductReport(productData);
    await newProduct.save();

    console.log("newproductforproductlist", newProduct);

    // Save the updated product
    await Godown.save();

    const updatedProduct = await existingProduct.save();

    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update product record" });
  }
});

router.get("/productReport/:productid", async (req, res) => {
  const productID = req.params.productid;

  console.log("productID", productID);

  try {
    const reports = await ProductReport.find({ productId: productID });

    if (!reports) {
      return res.status(404).json({ error: "reports not found" });
    }

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/productReportbycustomer/:productid", async (req, res) => {
  const productID = req.params.productid;

  console.log("productIDssssssssssssssss", productID);

  try {
    const cusreport = await PartywiseReport.find({
      "products.productId": productID,
    });
    console.log("cusreport", cusreport);

    if (!cusreport) {
      return res
        .status(404)
        .json({ error: "No report found for the specified product ID" });
    }

    res.status(200).json(cusreport);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/productReportbyvendor/:productid", async (req, res) => {
  const productID = req.params.productid;

  console.log("productIDddd", productID);

  try {
    const venreport = await PartywiseVendorReport.find({
      "products.productId": productID,
    });
    console.log("venreport", venreport);

    if (!venreport) {
      return res
        .status(404)
        .json({ error: "No report found for the specified product ID" });
    }

    res.status(200).json(venreport);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

//prodctcontroller
