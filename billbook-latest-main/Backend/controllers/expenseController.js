const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const AddProducts = require("../models/addProduct");
const AddParty = require("../models/partyModel");
const BankDetails = require("../models/BankDetails");
const { PassThrough } = require("stream");
const fs = require("fs");
const os = require("os");
const path = require("path");
const AddExpense = require("../models/addExpenses");
require("dotenv").config();
const BusinessSchema = require("../models/businessModel");
const recentActivities = require("../models/recentActivities");

router.post("/expense/:bid", async (req, res) => {
  try {
    const formData = req.body;

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
    }

    const randomNum = generateRandomNumber();
    const expenseID = `EasyBBEXID${randomNum}`;
    formData.expenseId = expenseID;

    const expenseBalance =
      parseFloat(business.currentRevenu || 0) - parseFloat(formData.grandTotal);

    console.log("expenseBalance", expenseBalance);

    formData.currentRevenu = expenseBalance;

    await BusinessSchema.findOneAndUpdate(business._id, {
      TotalRevenue:
        parseInt(
          parseFloat(business.TotalRevenue) - parseFloat(formData.grandTotal)
        ) || business.TotalRevenue,
    });
    const expense = new AddExpense(formData);

    const savedexpense = await expense.save();

    
    const Activities = {
      date: expense.expenseDate,
      type: expense.expenseName,
      partyName: expense.partyName,
      Amount: expense.grandTotal,
      businessId: expense.businessId
    };

    const newActivity = new recentActivities(Activities);
    await newActivity.save()

    res.status(201).json(savedexpense);
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

router.get("/expense/:bid", async (req, res) => {
  const bussinessid = req.params.bid;
  try {
    const expense = await AddExpense.find({ businessId: bussinessid });
    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/Expense/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const expense = await AddExpense.findById(id).populate("partyName");

    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/Expense/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const expense = await AddExpense.findById(id)
      .populate("partyName")
      .populate({
        path: "bankDetails",
        populate: {
          path: "selectBank",
          model: "BankDetails",
        },
      });

    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/expensesbyPartyId/:partyid", async (req, res) => {
  const partyID = req.params.partyid;

  console.log("partyID", partyID);

  try {
    const expense = await AddExpense.find({ partyId: partyID });

    if (!expense) {
      return res.status(404).json({ error: "expense not found" });
    }

    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/update-expense/:expenseid", async (req, res) => {
  const expenseID = req.params.expenseid;
  const updatedData = req.body;
  console.log("updated data", updatedData);
  console.log("invoice id", expenseID);

  try {
    const existingExpense = await AddExpense.findById(expenseID);

    if (!existingExpense) {
      return res.status(404).json({ error: "Expense order not found" });
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

    const updatedExpense = await AddExpense.findByIdAndUpdate(
      expenseID,
      updatedData.formData,
      {
        new: true,
      }
    );

    console.log("updatedExpense by id", updatedExpense);

    res.status(200).json(updatedExpense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/deletedexpense/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedexpense = await AddExpense.findByIdAndDelete(id);

    if (!deletedexpense) {
      return res.status(404).json({ error: "expense not found" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
