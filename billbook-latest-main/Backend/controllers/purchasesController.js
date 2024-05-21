const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const AddPurchases = require("../models/addPurchases");
const AddProducts = require("../models/addProduct");
const AddVendor = require("../models/addVendor");
const BankDetails = require("../models/BankDetails");
const { PassThrough } = require("stream");
const fs = require("fs");
const os = require("os");
const path = require("path");
const addPurchases = require("../models/addPurchases");
const DeletedPurchase = require("../models/deletedPurchases");
const PaymentOutDetails = require("../models/paymentOut");
const VenTransaction = require("../models/venTransaction");
const VenLedger = require("../models/venLedger");
const ProductReport = require("../models/productReport");
const PartywiseVendorReport = require("../models/partywiseVendorReport");
const businessModel = require("../models/businessModel");
const businessTransactions = require("../models/businessTransactions");

const BusinessSchema = require("../models/businessModel");
const recentActivities = require("../models/recentActivities");

require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post("/purchases/:bid", async (req, res) => {
  try {
    const { formData, selectedGodown } = req.body;

    const businessId = req.params.bid;
    const business = await BusinessSchema.findById(businessId);

    let uploadReceipt = formData?.bankDetails?.uploadReceipt;
    if (uploadReceipt) {
      const result = await cloudinary.uploader.upload(uploadReceipt, {
        folder: "billing",
        allowedFormats: ["jpg", "png", "pdf"],
      });
      formData.bankDetails.uploadReceipt = {
        url: result?.url,
        public_id: result?.public_id,
      };
      //formData.bankDetails.signatureImage = signatureImage
    }

    const randomNum = generateRandomNumber();
    const purchaseID = `EasyBBPUID${randomNum}`;
    formData.purchasesId = purchaseID;

    const purchaseBalance =
      parseFloat(business.currentRevenu || 0) - parseFloat(formData.grandTotal);

    formData.currentRevenu = purchaseBalance;

    // business.currentRevenu = purchaseBalance;

    await BusinessSchema.findOneAndUpdate(business._id, {
      TotalRevenue:
        parseInt(
          parseFloat(business.TotalRevenue) - parseFloat(formData.grandTotal)
        ) || business.TotalRevenue,
    });
    const purchase = new AddPurchases(formData);

    const savedPurchases = await purchase.save();

    const Activities = {
      date: purchase.purchasesDate,
      type: purchase.purchaseName,
      partyName: purchase.vendorName,
      Amount: purchase.grandTotal,
      businessId: purchase.businessId
    };

    const newActivity = new recentActivities(Activities);
    await newActivity.save();

    res.status(201).json({ invoice: savedPurchases });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

function generateRandomNumber() {
  return Math.floor(1000000000 + Math.random() * 9000000000);
}

router.put("/updateVenPanNumber/:id", async (req, res) => {
  const vendorId = req.params.id;
  const { pannumber1, pannumber2 } = req.body;

  try {
    const customer = await AddVendor.findById(vendorId);
    console.log("customer", customer);

    if (!customer) {
      return res.status(404).json({ error: "Vendor not found" });
    }

    console.log("pannumber2", pannumber2);

    const updatedCustomer = await AddVendor.findByIdAndUpdate(
      vendorId,
      { PANNumber: pannumber2 },
      {
        new: true,
      }
    );

    return res.status(200).json(updatedCustomer);
  } catch (error) {
    console.error("Error updating PAN number:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

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

router.get("/purchases/:bid", async (req, res) => {
  const bussinessid = req.params.bid;
  try {
    const purchase = await AddPurchases.find({ businessId: bussinessid });

    res.status(200).json(purchase);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/purchasesdetails/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const purchase = await AddPurchases.findById(id);

    if (!purchase) {
      return res.status(404).json({ error: "Purchases not found" });
    }

    res.status(200).json(purchase);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/purchasesforview/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const purchase = await AddPurchases.findById(id);

    if (!purchase) {
      return res.status(404).json({ error: "Purchases not found" });
    }

    res.status(200).json(purchase);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/purchasesbyVendorId/:vendorid", async (req, res) => {
  const vendorID = req.params.vendorid;

  console.log("vendorID", vendorID);

  try {
    const purchase = await AddPurchases.find({ vendorId: vendorID });

    console.log("purchase", purchase);

    const unpaidpurchaseinvoices = purchase.filter((inv) => inv.balance != 0);

    if (!unpaidpurchaseinvoices) {
      return res.status(404).json({ error: "Purchases not found" });
    }

    res.status(200).json(unpaidpurchaseinvoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/ventransactions/:vendorid", async (req, res) => {
  const vendorID = req.params.vendorid;

  console.log("vendorID", vendorID);

  try {
    const ventransactions = await VenTransaction.find({ vendorid: vendorID });

    console.log("ventransactions", ventransactions);

    if (!ventransactions) {
      return res.status(404).json({ error: "transactions not found" });
    }

    res.status(200).json(ventransactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/venledgers/:vendorid", async (req, res) => {
  const vendorID = req.params.vendorid;

  console.log("vendorID", vendorID);

  try {
    const venledgers = await VenLedger.find({ vendorid: vendorID });

    console.log("venledgers", venledgers);

    if (!venledgers) {
      return res.status(404).json({ error: "ledgers not found" });
    }

    res.status(200).json(venledgers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/partyReportbyvendor/:vendorid", async (req, res) => {
  const vendorID = req.params.vendorid;

  console.log("vendorID", vendorID);

  try {
    const partyvendorReport = await PartywiseVendorReport.find({
      vendorId: vendorID,
    });

    console.log("partyvendorReport", partyvendorReport);

    if (!partyvendorReport) {
      return res.status(404).json({ error: "partyvendorReport not found" });
    }

    res.status(200).json(partyvendorReport);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/purchases/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const purchase = await AddPurchases.findById(id);

    if (!purchase) {
      return res.status(404).send("Purchase not found");
    }

    const deletedPurchasesData = {
      purchaseNumber: purchase.purchaseNumber,
      name: purchase.name,
      purchasesDate: purchase.purchasesDate,
      dueDate: purchase.dueDate,
      balance: purchase.balance,
      referenceNo: purchase.referenceNo,
      paymentTerms: purchase.paymentTerms,
      currency: purchase.currency,
      website: purchase.website,
      grandTotal: purchase.grandTotal,
      totalDiscount: purchase.totalDiscount,
      totalTax: purchase.totalTax,
      taxableAmount: purchase.taxableAmount,
      cgstTaxAmount: purchase.cgstTaxAmount,
      sgstTaxAmount: purchase.sgstTaxAmount,
      totalTaxPercentage: purchase.totalTaxPercentage,
      totalDiscountPercentage: purchase.totalDiscountPercentage,
      cgstTaxPercentage: purchase.cgstTaxPercentage,
      sgstTaxPercentage: purchase.sgstTaxPercentage,
      payments: purchase.payments,
      table: purchase.table,
      bankDetails: purchase.bankDetails,
      purchasesId: purchase._id,
      purchaseName: purchase.purchaseName,
      vendorId: purchase.vendorId,
    };

    const newDeletedPurchase = new DeletedPurchase(deletedPurchasesData);

    await newDeletedPurchase.save();

    await AddPurchases.findByIdAndDelete(id);

    res.status(200).send("Purchase deleted successfully");
  } catch (error) {
    console.error("Error deleting purchase:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.delete("/Restore/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const Restorepurchase = await DeletedPurchase.findById(id);

    if (!Restorepurchase) {
      return res.status(404).send("Restorepurchase not found");
    }

    const restorePurchasesData = {
      purchaseNumber: Restorepurchase.purchaseNumber,
      name: Restorepurchase.name,

      purchasesDate: Restorepurchase.purchasesDate,
      dueDate: Restorepurchase.dueDate,
      referenceNo: Restorepurchase.referenceNo,
      paymentTerms: Restorepurchase.paymentTerms,
      balance: Restorepurchase.balance,
      currency: Restorepurchase.currency,
      website: Restorepurchase.website,
      grandTotal: Restorepurchase.grandTotal,
      totalDiscount: Restorepurchase.totalDiscount,
      totalTax: Restorepurchase.totalTax,
      taxableAmount: Restorepurchase.taxableAmount,
      cgstTaxAmount: Restorepurchase.cgstTaxAmount,
      sgstTaxAmount: Restorepurchase.sgstTaxAmount,
      totalTaxPercentage: Restorepurchase.totalTaxPercentage,
      totalDiscountPercentage: Restorepurchase.totalDiscountPercentage,
      cgstTaxPercentage: Restorepurchase.cgstTaxPercentage,
      sgstTaxPercentage: Restorepurchase.sgstTaxPercentage,
      payments: Restorepurchase.payments,
      table: Restorepurchase.table,
      bankDetails: Restorepurchase.bankDetails,
      purchasesId: Restorepurchase._id,
      purchaseName: Restorepurchase.purchaseName,
      vendorId: Restorepurchase.vendorId,
    };

    const newRestorePurchase = new AddPurchases(restorePurchasesData);

    await newRestorePurchase.save();

    await DeletedPurchase.findByIdAndDelete(id);

    res.status(200).send("Purchase deleted successfully");
  } catch (error) {
    console.error("Error deleting purchase:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/newDeletedPurchase/purchase", async (req, res) => {
  try {
    const deletedPurchases = await DeletedPurchase.find().populate("name");
    res.status(200).json(deletedPurchases);
  } catch (error) {
    console.error("Error retrieving deleted invoices:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.put("/update-purchase/:purchaseid", async (req, res) => {
  const purchaseID = req.params.purchaseid;
  const updatedData = req.body;
  console.log("updated data", updatedData);
  console.log("invoice id", purchaseID);

  try {
    const existingPurchase = await AddPurchases.findById(purchaseID);
    const business = await BusinessSchema.findById(
      updatedData?.formData?.businessId
    );

    console.log("existingPurchase", existingPurchase, business);

    if (!existingPurchase) {
      return res.status(404).json({ error: "Purchase not found" });
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

    await BusinessSchema.findOneAndUpdate(business._id, {
      TotalRevenue:
        parseInt(
          parseFloat(business.TotalRevenue) +
            parseFloat(existingPurchase.grandTotal) -
            parseFloat(updatedData.formData.grandTotal)
        ) || business.TotalRevenue,
    });

    const updatedPurchase = await AddPurchases.findByIdAndUpdate(
      purchaseID,
      updatedData.formData,
      {
        new: true,
      }
    );

    console.log("purchase by id", updatedPurchase);

    res.status(200).json(updatedPurchase);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE route to delete a specific purchase by ID
router.delete("/purchases/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPurchase = await AddPurchases.findByIdAndDelete(id);

    if (!deletedPurchase) {
      return res.status(404).json({ error: "Purchase not found" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
