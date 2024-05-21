
const express = require("express");
const router = express.Router();
const AddGst = require("../models/GstModel");
require("dotenv").config();

router.post("/gst", async (req, res) => {
  try {
    const GstData = req.body;

    console.log("GstData", GstData)

    const GST = new AddGst(GstData);

    const savedGst = await GST.save();

    res.status(201).json(savedGst);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/gst/:bid", async (req, res) => {
  const businessid = req.params.bid;
  try {
    const Gst = await AddGst.find({businessId:businessid});
    res.status(200).json(Gst);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve Gst" });
  }
});


router.put("/gstData/:id", async (req, res) => {
  try {
    const gstid = req.params.id;
    console.log("ID:", gstid); 
    const updatedData = req.body;
    console.log("Updated Data:", updatedData); 

    const updatedGst = await AddGst.findByIdAndUpdate(gstid, updatedData, {
      new: true,
    });

    console.log("Updated GST:", updatedGst);

    if (!updatedGst) {
      return res.status(404).json({ error: "GST record not found" });
    }

    res.status(200).json(updatedGst);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update GST record" });
  }
});

router.delete("/deletegst/:id", async (req, res) => {
  try {
    const gstId = req.params.id;

    const deletedGst = await AddGst.findByIdAndDelete(gstId);

    if (!deletedGst) {
      return res.status(404).json({ error: "GST record not found" });
    }

    res.status(200).json({ message: "GST record deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete GST record" });
  }
});

module.exports = router;

