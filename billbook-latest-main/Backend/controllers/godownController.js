const express = require("express");
const router = express.Router();
const AddGodown = require("../models/GodownModel");
const Products = require("../models/addProduct");
const GodownModel = require("../models/GodownModel");
const addProduct = require("../models/addProduct");
require("dotenv").config();

router.post("/addgodown", async (req, res) => {
  try {
    const data = req.body;

    // console.log("Godowndata", Godowndata)

    // const data = data;
    console.log("data", data)
  
    const randomNum = generateRandomNumber();
    const godownID = `EasyBBgodownID${data.godownName}${randomNum}`;
    data.godownId = godownID;
    const Godown = new AddGodown(data);
    
    await Godown.save();
    
    res.status(201).json(Godown);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

function generateRandomNumber() {
  return Math.floor(1000000000 + Math.random() * 9000000000);
}

router.get("/godownlist/:bid", async (req, res) => {
  const bussinessid = req.params.bid;
  if(!bussinessid){
    return;
  }
  try {
    const Godown = await AddGodown.find({businessId: bussinessid});
    res.status(200).json(Godown);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve Godown" });
  }
});

router.get("/godownbyid/:godownid", async (req, res) => {
  const GodownID = req.params.godownid;
  try {
    const Godown = await AddGodown.find({ godownId: GodownID });
    res.status(200).json(Godown);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve Godown" });
  }
});

router.get("/productsbygodown/:godownid", async (req, res) => {
  const GodownID = req.params.godownid;

  console.log("GodownID", GodownID);

  try {
    const products = await Products.find({ "Godown.godownId": GodownID });

    console.log("products", products);

    if (!products) {
      return res.status(404).json({ error: "products not found" });
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/updategodown/:id", async (req, res) => {
  try {
    const godownid = req.params.id;
    const updatedData = req.body;
    const data = updatedData.selectedformData;
    console.log("updatedData", updatedData);

    const updatedGodown = await AddGodown.findOneAndUpdate(
      { godownId: godownid },
      data,
      { new: true }
    );

    if (!updatedGodown) {
      return res.status(404).json({ error: "Godown record not found" });
    }

    res.status(200).json(updatedGodown);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update Godown" });
  }
});

// router.put("/transforstock/:id", async (req, res) => {
//   try {
//     const productId = req.params.id;
//     const updatedData = req.body;
//     console.log("updatedData", updatedData);

//     const existingProduct = await addProduct.findOne({ productId: productId });
//     if (existingProduct) {
//       return res.status(400).json({ error: "both godowns are same" });
//     }
//     if (!existingProduct) {
//       return res.status(404).json({ error: "Product not found" });
//     }

//     // const GodownIndex =  existingProduct.Godown.findIndex((godown) => godown.godown === updatedData.godownId)

//     // console.log("GodownIndex", GodownIndex)

//     if (existingProduct.godown === updatedData.godownId) {
//       return res.status(400).json({ error: "both godowns are same" });
//     }

//     const GodownIndex = existingProduct.addProduct.findIndex(
//       (godown) => godown.godownId === existingProduct.godownId
//     );

//     const destGodownIndex = existingGodown.addProduct.findIndex(
//       (godown) => godown.godownId === updatedData.godownId
//     );

//     if (GodownIndex === -1 || destGodownIndex === -1) {
//       existingProduct.addProduct[GodownIndex].stock -= updatedData.quantity;

//       existingProduct.addProduct[destGodownIndex].stock += updatedData.quantity;
//     } else {
//       const product = await addProduct.findOne({
//         "Godown.godownId": updatedData.godownId,
//       });
//       product.godown = existingProduct.godownId;
//       await product.save();
//       const data = {
//         date: product.addingDate,
//         godownName: product.godownName,
//         stock: updatedData.quantity,
//       };

//       existingProduct.product.push(data);
//     }

//     const updatedGodown = await existingGodown.save();

//     return res.status(200).json(updatedGodown);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to update godown record" });
//   }
// });

router.put("/transforstock", async (req, res) => {
  try {
    const {formData} = req.body;
    updatedData = formData;

    console.log("updatedData", updatedData);

    const currentGodown = await GodownModel.findOne({ godownId: updatedData.godownId });
    console.log("currentGodown", currentGodown)


    const existingProduct = await GodownModel.findOne({ godownId: updatedData.godownName });

    console.log("existingProduct", existingProduct);

    if (!existingProduct) {
      return res.status(404).json({ error: "Godown not found" });
    }

    let existingGodownProduct = false;


    for (let i = 0; i < existingProduct?.Products?.length || 0; i++) {
      if (existingProduct.Products[i].productId === updatedData.selectedProductId) {
        existingProduct.Products[i].openingStock += parseInt(updatedData.quantity);
        existingGodownProduct = true;
        await GodownModel.updateOne(
          { _id: existingProduct._id },
          { $set: { Products: existingProduct.Products } }
        );


      }
    }
    

    if(!existingGodownProduct){
      const productDetails = await addProduct.findOne({productId : updatedData.selectedProductId})
      console.log("productDetails",productDetails)

      if (!productDetails) {
        return res.status(404).json({ error: "Product not found" });
      }
  
      const godownIndex = productDetails.Godown.findIndex(
        (godown) => godown.godownName === updatedData.godown
      );
      console.log("godownIndex", godownIndex);
  
          const destGodownIndex = productDetails.Godown.findIndex(
        (godown) => godown.godownId === updatedData.godownName
      );
  
      if (godownIndex !== -1) {
        // If both godownIndex and destGodownIndex are the same, update opening stock in the same godown
        // if (godownIndex !== destGodownIndex) {
          productDetails.Godown[godownIndex].stock -= updatedData.quantity;
        // } else {
          // If they are different, add the product to the destination godown
          const destGodownIndex = productDetails.Godown.findIndex(
            (godown) => godown.godownId === updatedData.godownName
          );
  
          console.log("destGodownIndex", destGodownIndex)
  
          if (destGodownIndex !== -1) {
            productDetails.Godown[destGodownIndex].stock += updatedData.quantity;
          } else {
            const godown = await GodownModel.findOne({"godownId": updatedData.godownName})
            console.log("godown", godown)
            godown.productId = productDetails.productId;
            await godown.save();
            const data = {
              godownId: godown.godownId,
              godownName: godown.godownName,
              godownStreetAddress: godown.godownStreetAddress,
              godownCity: godown.godownCity,
              stock: updatedData.quantity, // Initialize opening stock with the transferred quantity
            }
            console.log("data", data)
            productDetails.Godown.push(data)
            await productDetails.save();
          }
        // }
      }
   

      existingProduct.Products.push({
        category: productDetails.category,
        productId:productDetails.productId,
        taxType: productDetails.taxType,
        itemName: productDetails.itemName,
        itemCode: productDetails.itemCode,
        openingStock: Number(updatedData.quantity),
        salesPrice: productDetails.salesPrice,
        purchasePrice: productDetails.purchasePrice,
        stockValue: productDetails.stockValue,
        gstTaxRate: productDetails.gstTaxRate,
      })

      // await GodownModel.updateOne(
      //   { _id: existingProduct._id },
      //   { $set: { Products: existingProduct.Products } }
      // );
      await existingProduct.save();

    }
     for (let i = 0; i < currentGodown?.Products?.length || 0; i++) {
      if (currentGodown.Products[i].productId === updatedData.selectedProductId) {
        currentGodown.Products[i].openingStock -= parseInt(updatedData.quantity);
        await GodownModel.updateOne(
          { _id: currentGodown._id },
          { $set: { Products: currentGodown.Products } }
        );

        
      }
    }


    const updatedProduct = await existingProduct.save();
    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update product record" });
  }
});


// router.put("/transforstock", async (req, res) => {
//   try {
//     const updatedData = req.body;
//     console.log("updatedData", updatedData);

//     const existingProduct = await addProduct.findOne({ "productId": updatedData.selectedProductId });
//     console.log("existingProduct", existingProduct)

//     if (!existingProduct) {
//       return res.status(404).json({ error: "Product not found" });
//     }

//     const godownIndex = existingProduct.Godown.findIndex(
//       (godown) => godown.godownName === updatedData.godown
//     );
//     console.log("godownIndex", godownIndex);

//         const destGodownIndex = existingProduct.Godown.findIndex(
//       (godown) => godown.godownId === updatedData.godownName
//     );

//     if (godownIndex !== -1) {
//       // If both godownIndex and destGodownIndex are the same, update opening stock in the same godown
//       if (godownIndex === destGodownIndex) {
//         existingProduct.Godown[godownIndex].openingStock -= updatedData.quantity;
//       } else {
//         // If they are different, add the product to the destination godown
//         const destGodownIndex = existingProduct.Godown.findIndex(
//           (godown) => godown.godownId === updatedData.godownName
//         );

//         console.log("destGodownIndex", destGodownIndex)

//         if (destGodownIndex !== -1) {
//           existingProduct.Godown[destGodownIndex].openingStock += updatedData.quantity;
//         } else {
//           const godown = await GodownModel.findOne({"godownId": updatedData.godownName})
//           console.log("godown", godown)
//           godown.productId = existingProduct.productId;
//           await godown.save();
//           const data = {
//             godownId: godown.godownId,
//             godownName: godown.godownName,
//             godownStreetAddress: godown.godownStreetAddress,
//             godownCity: godown.godownCity,
//             openingStock: updatedData.quantity, // Initialize opening stock with the transferred quantity
//           }
//           existingProduct.Godown.push(data)
//         }
//       }
//     }

//     // Save the updated product
//     const updatedProduct = await existingProduct.save();

//     return res.status(200).json(updatedProduct);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to update product record" });
//   }
// });

router.delete("/deletegodown/:id", async (req, res) => {
  try {
    const godownId = req.params.id;

    const deletedGodown = await AddGodown.findOneAndDelete({
      godownId: godownId,
    });

    res.status(200).json({ message: "Godown deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete Godown" });
  }
});

module.exports = router;
