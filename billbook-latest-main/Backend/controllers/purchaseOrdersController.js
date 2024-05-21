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
const PurchaseOrder = require("../models/purchaseOrders");
const purchaseOrders = require("../models/purchaseOrders");
const recentActivities = require("../models/recentActivities");
// const DeletedPurchase = require("../models/deletedPurchases");
// const PaymentOutDetails = require("../models/paymentOut");
// const VenTransaction = require("../models/venTransaction");
// const VenLedger = require("../models/venLedger");
// const purchaseOrders = require("../models/purchaseOrders");
// const ProductReport = require("../models/productReport");
// const PartywiseVendorReport = require("../models/partywiseVendorReport");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post("/purchaseOrder", async (req, res) => {
  try {
    const  formData  = req.body;
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
    const purchaseORID = `EasyBBPOID${randomNum}`;
    formData.purchaseORId = purchaseORID;

    const vendor = await AddVendor.findById(formData.name);

    formData.vendorId = vendor.vendorId;
    if (formData.balance === 0) {
      vendor.openingBalance += formData.balance;
    } else {
      vendor.openingBalance += formData.grandTotal;
    }
    formData.vendorName = vendor.name;
    // vendor.openingBalance += formData.grandTotal;
    await vendor.save();

    if (formData.bankDetails.selectBank.trim().length === 0) {
      delete formData.bankDetails.selectBank;
    }

    const updatevendorbalance = vendor.openingBalance;
    const purchases = new PurchaseOrder(formData);
    const savedPurchases = await purchases.save();

    if (formData.balance === 0) {
      savedPurchases.purchaseStatus = "PAID";
      await savedPurchases.save();
    }

    const Activities = {
      date: purchases.purchasesORDate,
      type: purchases.purchaseORName,
      partyName: purchases.name,
      Amount: purchases.grandTotal,
      businessId: purchases.businessId
    };

    const newActivity = new recentActivities(Activities);
    await newActivity.save();

    res.status(201).json(savedPurchases);
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

router.get("/purchaseOrder/:bid", async (req, res) => {
  const bussinessid = req.params.bid;
  try {
    const purchaseorder = await PurchaseOrder.find({businessId: bussinessid}).populate("name");

    res.status(200).json(purchaseorder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get("/purorVen/:vendorid", async (req, res) => {

  const vendorID = req.params.vendorid;

  console.log("vendorID", vendorID)

  try {
    const purchaseOR =  await purchaseOrders.find({vendorId: vendorID}).populate("name");

    console.log("purchaseOR". purchaseOR)

    if(!purchaseOR) {
      return res.status(404).json({ error: "PurchaseOrders not found" });
    }
    res.status(200).json(purchaseOR);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

})


router.get("/Purchase-order/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const purchaseorder = await PurchaseOrder.findById(id).populate("name");

    if (!purchaseorder) {
      return res.status(404).json({ error: "Purchases order not found" });
    }

    res.status(200).json(purchaseorder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/Purchase-orderforview/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const purchaseorder = await PurchaseOrder.findById(id)
      .populate("name")

      .populate({
        path: "bankDetails",
        populate: {
          path: "selectBank",
          model: "BankDetails",
        },
      });

    if (!purchaseorder) {
      return res.status(404).json({ error: "Purchases order not found" });
    }

    res.status(200).json(purchaseorder);
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

    if (!purchase) {
      return res.status(404).json({ error: "Purchases not found" });
    }

    res.status(200).json(purchase);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/update-purchaseorder/:purchaseORid", async (req, res) => {
  const purchaseORID = req.params.purchaseORid;
  const updatedData = req.body;
  console.log("updated data", updatedData);
  console.log("invoice id", purchaseORID);

  try {
    const existingPurchaseOrder = await PurchaseOrder.findById(purchaseORID);

    if (!existingPurchaseOrder) {
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

    const updatedPurchaseOrder = await PurchaseOrder.findByIdAndUpdate(
      purchaseORID,
      updatedData.formData,
      {
        new: true,
      }
    );

    console.log("purchase by id", updatedPurchaseOrder);

    res.status(200).json(updatedPurchaseOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/deletepurchaseOrders/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPurchaseOrders = await PurchaseOrder.findByIdAndDelete(id);

    if (!deletedPurchaseOrders) {
      return res.status(404).json({ error: "Purchase order not found" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
