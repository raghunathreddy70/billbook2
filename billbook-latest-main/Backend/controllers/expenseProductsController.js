const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const ExpenseProducts = require("../models/expenseProducts");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post("/expenseproducts", async (req, res) => {
  try {
    const formData = req.body;
    console.log(formData);

    const expenseproductName = formData.itemName;

    const expenseproductID = `EasyBBEXPI${expenseproductName}`;
    formData.exproductId = expenseproductID;

    const exproduct = new ExpenseProducts(formData);

    const savedExProduct = await exproduct.save();

    res.status(201).json(savedExProduct);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

router.get("/exproducts", async (req, res) => {
  try {
    const exproducts = await ExpenseProducts.find();

    res.status(200).json(exproducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/exproducts/:id", async (req, res) => {
  const exproductid = req.params.id;
  try {
    const exproducts = await ExpenseProducts.findOne({
      exproductId: exproductid,
    });

    if (!exproducts) {
      return res.status(404).json({ error: "expense not found" });
    }
    res.status(200).json(exproducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/expenseproductedit/:id", async (req, res) => {
  try {
    const expenseproductid = req.params.id;
    const updatedData = req.body;

    const updatedExpenseProduct = await ExpenseProducts.findOneAndUpdate(
      { exproductId: expenseproductid },
      updatedData,
      { new: true }
    );

    if (!updatedExpenseProduct) {
      return res.status(404).json({ error: "Product record not found" });
    }

    res.status(200).json(updatedExpenseProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update product record" });
  }
});

router.delete("/deletex/:id", async (req, res) => {
  try {
    const expenseproductId = req.params.id;

    const deletedexpenseproduct = await ExpenseProducts.findByIdAndDelete(
      expenseproductId
    );

    if (!deletedexpenseproduct) {
      return res.status(404).json({ error: "product record not found" });
    }
    res.status(200).json({ message: "product record deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "error to delete product record" });
  }
});

module.exports = router;
