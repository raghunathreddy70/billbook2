const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const AddProducts = require("../models/addProduct");
const addCustomer = require("../models/addCustomer");
const BankDetails = require("../models/BankDetails");
const DeliveryChallen = require("../models/deliveryChallen");
const { PassThrough } = require("stream");
const fs = require("fs");
const os = require("os");
const path = require("path");
require("dotenv").config();
const ProductReport = require("../models/productReport");
const PartywiseReport = require("../models/partywiseReport");
const TransactionModel = require("../models/Transactionmodel");
const recentActivities = require("../models/recentActivities");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post("/delchallen", async (req, res) => {
  try {
    const formData = req.body;
    console.log("formdata", formData);

    let signatureImage = formData?.bankDetails?.signatureImage;

    if (signatureImage) {
      const result = await cloudinary.uploader.upload(signatureImage, {
        folder: "billing",
      });
      signatureImage = {
        url: result?.url,
        public_id: result?.public_id,
      };
      formData.bankDetails.signatureImage = signatureImage;
    }

    const randomNum = generateRandomNumber();
    const delchallenID = `EasyBBDCID${randomNum}`;
    formData.delChanId = delchallenID;

    const customer = await addCustomer.findById(formData.customerName);

    if (formData.grandTotal > 200000) {
      if (
        !(customer.PANNumber.trim().length > 0) ||
        !(formData.bussPANNumber.trim().length > 0)
      ) {
        const iscustomer = customer.PANNumber.trim().length > 0;
        const isBussinessPAN = formData.bussPANNumber.trim().length > 0;
        res.send({ iscustomer, isBussinessPAN });
        return;
      }
    }

    formData.customerId = customer.customerId;
    if (formData.balance === 0) {
      customer.openingBalance += formData.balance;
    } else {
      customer.openingBalance += formData.grandTotal;
    }
    if (formData.bankDetails.selectBank.trim().length === 0) {
      delete formData.bankDetails.selectBank;
    }

    await customer.save();

    // const updatecustomerbalance = customer.openingBalance;
    const invoice = new DeliveryChallen(formData);

    const savedInvoice = await invoice.save();

    if (formData.balance === 0) {
      savedInvoice.invoiceStatus = "PAID";
      await savedInvoice.save();
    }

    if (formData.table && formData.table.length > 0) {
      for (const item of formData.table) {
        const productId = item.productId;
        const quantity = item.quantity;

        const product = await AddProducts.findById(productId);
        const generatedProductId = product.productId;

        if (product) {
          const { itemName, itemCode, openingStock } = product;

          if (openingStock) {
            product.openingStock -= quantity;
            product.salesProduct += quantity;
            await product.save();
          }

          if (openingStock) {
            product.stockValue = product.openingStock * product.purchasePrice;
            await product.save();
          }

          const productData = {
            productId: generatedProductId,
            itemName: itemName,
            itemCode: itemCode,
            invoiceNumber: formData.delChanNumber,
            invoiceName: formData.delChanName,
            invoiceDate: formData.delChanDate,
            quantity: quantity,
            closingStock: product.openingStock,
            purAmount: formData.grandTotal,
          };

          const newProduct = new ProductReport(productData);
          await newProduct.save();

          console.log("newProduct", newProduct);
          let existingProductReport = await PartywiseReport.findOne({
            customerId: formData.customerId,
          });

          console.log("existingProductReport", existingProductReport);

          if (!existingProductReport) {
            existingProductReport = new PartywiseReport({
              customerId: formData.customerId,
              products: [
                {
                  productId: generatedProductId,
                  quantity: quantity,
                  salesAmount: parseFloat(item.totalAmount),
                  itemCode: itemCode,
                  itemName: itemName,
                },
              ],
            });
          } else {
            const existingProductIndex =
              existingProductReport.products.findIndex(
                (product) => product.productId === generatedProductId
              );

            if (existingProductIndex !== -1) {
              existingProductReport.products[existingProductIndex].quantity +=
                quantity;
              existingProductReport.products[
                existingProductIndex
              ].salesAmount += quantity * parseFloat(item.totalAmount);
            } else {
              existingProductReport.products.push({
                productId: generatedProductId,
                quantity: quantity,
                salesAmount: parseFloat(item.totalAmount),
                itemCode: itemCode,
                itemName: itemName,
              });
            }
          }

          await existingProductReport.save();
          console.log("existingProductReport", existingProductReport);
        }
      }
    }
    let transactionStatus;
    switch (invoice.invoiceStatus) {
      case "PAID":
        transactionStatus = "PAID";
        break;
      default:
        transactionStatus = "UNPAID";
    }

    // const transactionData = {
    //   customerid: customer.customerId,
    //   invoiceDate: invoice.delChanDate,
    //   invoiceName: invoice.delChanName,
    //   invoiceNumber: invoice.delChanNumber,
    //   grandTotal: invoice.grandTotal,
    //   balance: invoice.balance,
    //   bankID: invoice.bankId,
    //   paymentAmount: invoice.grandTotal,
    // };
    // const newTransaction = new TransactionModel(transactionData);
    // await newTransaction.save();

    const Activities = {
      date: invoice.delChanDate,
      type: invoice.delChanName,
      partyName: invoice.customerName,
      Amount: invoice.grandTotal,
    };

    const newActivity = new recentActivities(Activities);
    await newActivity.save();

    res.status(201).json({ invoice: savedInvoice });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

function generateRandomNumber() {
  return Math.floor(1000000000 + Math.random() * 9000000000);
}

router.get("/delChallen/:bid", async (req, res) => {
  const bussinessid = req.params.bid;
  try {
    const delChallen = await DeliveryChallen.find({
      businessId: bussinessid,
    }).populate("customerName");
    res.status(200).json(delChallen);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/delChallendetails/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const delChallen = await DeliveryChallen.findById(id).populate(
      "customerName"
    );

    if (!delChallen) {
      return res.status(404).json({ error: "creditNotes not found" });
    }

    res.status(200).json(delChallen);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/delChallenforview/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const delChallen = await DeliveryChallen.findById(id)
      .populate("customerName")

      .populate({
        path: "bankDetails",
        populate: {
          path: "selectBank",
          model: "BankDetails",
        },
      });
    if (!delChallen) {
      return res.status(404).json({ error: "creditNotes not found" });
    }

    res.status(200).json(delChallen);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/delChallenbyCustomerId/:customerid", async (req, res) => {
  const customerID = req.params.customerid;

  console.log("customerID", customerID);

  try {
    const delChallen = await DeliveryChallen.find({ customerId: customerID });

    console.log("delChallen", delChallen);

    if (!delChallen) {
      return res.status(404).json({ error: "creditNote not found" });
    }

    res.status(200).json(delChallen);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/delChallen/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const delChallen = await DeliveryChallen.findById(id);

    if (!delChallen) {
      return res.status(404).json({ error: "Credit note not found" });
    }

    await delChallen.remove();

    res.status(200).json({ message: "Credit note deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/newDeletedDelChallen/delChallen", async (req, res) => {
  try {
    const deletedDelChallen = await DeletedDelhallen.find().populate(
      "customerName"
    );
    res.status(200).json(deletedDelChallen);
  } catch (error) {
    console.error("Error retrieving deleted creditnotes:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.put("/update-delChallen/:delChanid", async (req, res) => {
  const delChallenID = req.params.delChanid;
  const updatedData = req.body;
  console.log("updated data", updatedData);
  console.log("delChallenID", delChallenID);

  try {
    const existingDelChallen = await DeliveryChallen.findById(delChallenID);

    if (!existingDelChallen) {
      return res.status(404).json({ error: "CreditNotes not found" });
    }

    if (updatedData.table && updatedData.table.length > 0) {
      for (const item of updatedData.table) {
        const productId = item.productId;
        const quality = item.quantity;

        const product = await AddProducts.findById(productId);
        if (product && product.quality) {
          product.quality -= quality;
          await product.save();
        }
      }
    }

    let updatedSignatureImage = updatedData?.bankDetails?.signatureImage;

    if (updatedSignatureImage) {
      const result = await cloudinary.uploader.upload(updatedSignatureImage, {
        folder: "billing",
      });
      updatedSignatureImage = {
        url: result?.url,
        public_id: result?.public_id,
      };
      updatedData.bankDetails.signatureImage = updatedSignatureImage;
    }

    const updatedDelChallen = await DeliveryChallen.findByIdAndUpdate(
      delChallenID,
      updatedData.formData,
      {
        new: true,
      }
    );

    console.log("updatedCreditnotes by id", updatedDelChallen);

    res.status(200).json(updatedDelChallen);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/deletedelChallen/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deleteddelChallen = await DeliveryChallen.findByIdAndDelete(id);

    if (!deleteddelChallen) {
      return res.status(404).json({ error: "Creditnotes not found" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
