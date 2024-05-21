const express = require("express");
const router = express.Router();
const AddCurrency = require("../models/currencyModel");
require("dotenv").config();

router.post("/currency", async (req, res) => {
  try {
    const CurrencyData = req.body;

    const Currency = new AddCurrency(CurrencyData);

    const savedCurrency = await Currency.save();

    res.status(201).json(savedCurrency);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/currency/:bid", async (req, res) => {
  const bussinessid = req.params.bid;
  try {
    const Currency = await AddCurrency.find({businessId: bussinessid});
    res.status(200).json(Currency);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve Gst" });
  }
});

router.put("/currencyedit/:id", async (req, res) => {
  try {
    const currencyid = req.params.id;
    const updatedData = req.body;

    const updatedCurrency = await AddCurrency.findByIdAndUpdate(
      currencyid,
      updatedData,
      { new: true }
    );

    if (!updatedCurrency) {
      return res.status(404).json({ error: "Currency record not found" });
    }

    res.status(200).json(updatedCurrency);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update Currency record" });
  }
});


router.delete("/deletecurrency/:id", async (req, res) => {
  try {
    const currencyId = req.params.id;

    const deletedcurrency = await AddCurrency.findByIdAndDelete(currencyId);

    if (!deletedcurrency) {
      return res.status(404).json({ error: "Currency record not found" });
    }

    res.status(200).json({ message: "Currency record deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Currency to delete GST record" });
  }
});

module.exports = router;
