const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const ExpenseCategory = require("../models/expenseCategory");
require("dotenv").config();

router.post("/expensecategories", async (req, res) => {
  try {
    const formData = req.body;

    const expensecategory = new ExpenseCategory(formData);

    const savedExpenseCategory = await expensecategory.save();

    res.status(201).json(savedExpenseCategory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/expensecat", async (req, res) => {
  try {
    const expensecategories = await ExpenseCategory.find();
    res.status(200).json(expensecategories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve categories" });
  }
});

router.get("/expensecategories/:catId", async (req, res) => {
  const expensecategoryId = req.params.catId;
  console.log("expensecategoryId", expensecategoryId);
  try {
    const expensecategories = await ExpenseCategory.findById(expensecategoryId);
    res.status(200).json(expensecategories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve categories" });
  }
});

router.put("/expensecategoryedit/:id", async (req, res) => {
  try {
    const expensecategoryid = req.params.id;
    const updatedData = req.body;

    const updatedExpenseCategory = await ExpenseCategory.findByIdAndUpdate(
      expensecategoryid,
      updatedData,
      { new: true }
    );

    if (!updatedExpenseCategory) {
      return res.status(404).json({ error: "Category record not found" });
    }

    res.status(200).json(updatedExpenseCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update category record" });
  }
});

router.delete("/deleteexpensecategory/:id", async (req, res) => {
  try {
    const expensecategoryId = req.params.id;

    const deletedexpensecategory = await ExpenseCategory.findByIdAndDelete(
      expensecategoryId
    );

    if (!deletedexpensecategory) {
      return res.status(404).json({ error: "category record not found" });
    }
    res.status(200).json({ message: "category record deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "error to delete category record" });
  }
});

module.exports = router;
