const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const AddCategory = require("../models/addCategory");
const addProduct = require("../models/addProduct");
require("dotenv").config();

router.post("/categories", async (req, res) => {
  try {
    const formData = req.body;

    let image = formData?.image;

    if (image) {
      const result = await cloudinary.uploader.upload(image, {
        folder: "billing",
      });
      image = {
        url: result?.url,
        public_id: result?.public_id,
      };
      formData.image = image;
    }

    const category = new AddCategory(formData);

    const savedCategory = await category.save();

    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/categories/:bid", async (req, res) => {
  const bussinessid = req.params.bid;
  try {
    let categories = await AddCategory.find({businessId: bussinessid});

    let catbyid = categories.map((cat) => cat._id);

    for (let i = 0; i < catbyid.length; i++) {
      const product = await addProduct.find({
        itemCategory: catbyid[i].toString(),
      });
      let productLen = product?.length || 0;
      let categoryObject = categories[i].toObject();
      categoryObject.length = productLen;
      categories[i] = categoryObject;
    }
    res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve categories" });
  }
});

router.get("/categories/:catId", async (req, res) => {
  const categoryId = req.params.catId;
  console.log("categoryId", categoryId);
  try {
    const categories = await AddCategory.findById(categoryId);
    res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve categories" });
  }
});

router.put("/categoryedit/:id", async (req, res) => {
  try {
    const categoryid = req.params.id;
    const updatedData = req.body;

    const updatedCategory = await AddCategory.findByIdAndUpdate(
      categoryid,
      updatedData,
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ error: "Category record not found" });
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update category record" });
  }
});

router.delete("/deletecategory/:id", async (req, res) => {
  try {
    const categoryId = req.params.id;

    const deletedcategory = await AddCategory.findByIdAndDelete(categoryId);

    if (!deletedcategory) {
      return res.status(404).json({ error: "category record not found" });
    }
    res.status(200).json({ message: "category record deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "error to delete category record" });
  }
});

module.exports = router;
