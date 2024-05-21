const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const AddProducts = require("../models/addProduct");
const AddVendor = require("../models/addVendor");
const BankDetails = require("../models/BankDetails");
const { PassThrough } = require("stream");
const fs = require("fs");
const os = require("os");
const path = require("path");
const DebitNotes = require("../models/debitNotes");
const ProductReport = require("../models/productReport");
const VenLedger = require("../models/venLedger");
const VenTransaction = require("../models/venTransaction");
const PartywiseVendorReport = require("../models/partywiseVendorReport");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post("/DebitNotes", async (req, res) => {
  try {
    const { formData } = req.body;
    console.log("formdata", formData);
    console.log("product", formData.table);

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

    let uploadReceipt = formData?.bankDetails?.uploadReceipt;

    if (uploadReceipt) {
      const result = await cloudinary.uploader.upload(uploadReceipt, {
        folder: "billing",
      });
      uploadReceipt = {
        url: result?.url,
        public_id: result?.public_id,
      };
      formData.bankDetails.uploadReceipt = uploadReceipt;
    }

    const randomNum = generateRandomNumber();
    const debitNotesID = `EasyBBDNID${randomNum}`;
    formData.debitNotesId = debitNotesID;

    
    const vendor = await AddVendor.findById(formData.name);

    if (formData.grandTotal > 200000) {
      if (
        !(vendor.PANNumber.trim().length > 0) ||
        !(formData.bussPANNumber.trim().length > 0)
      ) {
        const iscustomer = vendor.PANNumber.trim().length > 0;
        const isBussinessPAN = formData.bussPANNumber.trim().length > 0;
        res.send({ iscustomer, isBussinessPAN });
        return;
      }
    }

    formData.vendorId = vendor.vendorId;
    if (formData.balance === 0) {
      vendor.openingBalance += formData.balance;
    } else {
      vendor.openingBalance += formData.grandTotal;
    }
    formData.vendorName = vendor.name;
    // vendor.openingBalance += formData.grandTotal;
    await vendor.save();

    const updatevendorbalance = vendor.openingBalance;
    const purchases = new DebitNotes(formData);
    const savedPurchases = await purchases.save();

    if (formData.balance === 0) {
      savedPurchases.purchaseStatus = "PAID";
      await savedPurchases.save();
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
            // product.openingStock -= quantity;
            product.openingStock += quantity;
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
            invoiceNumber: formData.purchaseNumber,
            invoiceName: formData.purchaseName,
            invoiceDate: formData.purchasesDate,
            quantity: quantity,
            closingStock: product.openingStock,
            purAmount: formData.grandTotal,
          };

          const newProduct = new ProductReport(productData);
          await newProduct.save();

          let existingProductReport = await PartywiseVendorReport.findOne({
            vendorId: formData.vendorId,
          });

          if (!existingProductReport) {
            existingProductReport = new PartywiseVendorReport({
              vendorId: formData.vendorId,
              products: [
                {
                  productId: generatedProductId,
                  quantity: quantity,
                  purAmount: parseFloat(item.totalAmount),
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
              existingProductReport.products[existingProductIndex].purAmount +=
                quantity * parseFloat(item.totalAmount);
            } else {
              existingProductReport.products.push({
                productId: generatedProductId,
                quantity: quantity,
                purAmount: parseFloat(item.totalAmount),
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


    let transactionStatus = "";
    switch (purchases.purchaseStatus) {
      case "PAID":
        transactionStatus = "PAID";
        break;
      // case "PARTIALLY PAID":
      //   transactionStatus = "PARTIALLY PAID";
      //   break;
      default:
        transactionStatus = "UNPAID";
    }

    const transactionData = {
      vendorid: vendor.vendorId,
      purchasesDate: purchases.purchaseReturnDate,
      purchaseName: purchases.purchaseReturnName,
      purchaseNumber: purchases.purchaseReturnNumber,
      grandTotal: purchases.grandTotal,
      balance: purchases.balance,
      bankID: purchases.bankId,
      status: purchases.purchaseStatus,
    };
    const newTransaction = new VenTransaction(transactionData);
    await newTransaction.save();

    const ledgerData = {
      vendorid: vendor.vendorId,
      purchasesDate: purchases.purchaseReturnDate,
      purchaseName: purchases.purchaseReturnName,
      purchaseNumber: purchases.purchaseReturnNumber,
      debit: purchases.grandTotal,
      vendorBalance: updatevendorbalance,
    };

    if (purchases.balance === 0) {
      ledgerData.credit = purchases.grandTotal;
    }

    const newLedgerEntry = new VenLedger(ledgerData);
    await newLedgerEntry.save();


    res.status(201).json({ invoice: savedPurchases });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

function generateRandomNumber() {
  return Math.floor(1000000000 + Math.random() * 9000000000);
}

router.post("/purchases/upload-pdf", async (req, res) => {
  try {
    console.log(req?.files);
    if (!req.files || !req.files.pdfFile) {
      return res.status(400).json({ error: "PDF file is required." });
    }

    const pdfFile = req.files.pdfFile;

    // Upload the PDF file to Cloudinary
    const pdfResult = await cloudinary.uploader.upload(pdfFile.tempFilePath, {
      folder: "purchasePDF",
      resource_type: "auto",
      allowed_formats: ["pdf"],
    });

    // Respond with the Cloudinary URL
    res.status(200).json({ pdfUrl: pdfResult.secure_url });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

router.get("/DebitNotes", async (req, res) => {
  try {
    const debitNotes = await DebitNotes.find().populate("name");

    res.status(200).json(debitNotes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/Debit-Notes/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const debotNotes = await DebitNotes.findById(id).populate("name");

    if (!debotNotes) {
      return res.status(404).json({ error: "Purchases order not found" });
    }

    res.status(200).json(debotNotes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/Debit-Notesforview/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const debotNotes = await DebitNotes.findById(id)
      .populate("name")

      .populate({
        path: "bankDetails",
        populate: {
          path: "selectBank",
          model: "BankDetails",
        },
      });

    if (!debotNotes) {
      return res.status(404).json({ error: "Purchases order not found" });
    }

    res.status(200).json(debotNotes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/debitNotesbyVendorId/:vendorid", async (req, res) => {
  const vendorID = req.params.vendorid;

  console.log("vendorID", vendorID);

  try {
    const debitNotes = await DebitNotes.find({ vendorId: vendorID });

    if (!debitNotes) {
      return res.status(404).json({ error: "Purchases not found" });
    }

    res.status(200).json(debitNotes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/update-debitNotes/:debitNotesid", async (req, res) => {
  const debitNotesID = req.params.debitNotesid;
  const updatedData = req.body;
  console.log("updated data", updatedData);
  console.log("invoice id", debitNotesID);

  try {
    const existingDebitNotes = await DebitNotes.findById(debitNotesID);

    if (!existingDebitNotes) {
      return res.status(404).json({ error: "Purchase order not found" });
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

    const updatedDebitNotes = await DebitNotes.findByIdAndUpdate(
      debitNotesID,
      updatedData.formData,
      {
        new: true,
      }
    );

    console.log("updatedDebitNotes by id", updatedDebitNotes);

    res.status(200).json(updatedDebitNotes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/deletedebitNotes/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedDebitNotes = await DebitNotes.findByIdAndDelete(id);

    if (!deletedDebitNotes) {
      return res.status(404).json({ error: "debitNotes not found" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
