const express = require("express");
const router = express.Router();
const AddParty = require("../models/partyModel");

router.post("/party", async (req, res) => {
  try {
    const { formData } = req.body;
    console.log("formData", formData);

    const randomNum = generateRandomNumber();
    const partyID = `EasyBBPIID${randomNum}`;
    formData.partyId = partyID;

    const party = new AddParty(formData);

    const savedParty = await party.save();
    res.status(201).json(savedParty);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to create Vendor" });
  }
});

function generateRandomNumber() {
  return Math.floor(1000000000 + Math.random() * 9000000000);
}

router.get("/party", async (req, res) => {
  try {
    const party = await AddParty.find();
    res.status(200).json(party);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/party/:id", async (req, res) => {
  const partyid = req.params.id;

  try {
    const party = await AddParty.findById(partyid).populate({
      path: "Purchases",
      populate: [
        {
          path: "payments",
          model: "PaymentOutDetails",
        },
      ],
    });

    if (!party) {
      return res.status(404).json({ error: "party not found" });
    }
    res.status(200).json(party);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/party/:id", async (req, res) => {
  try {
    const partyid = req.params.id;
    console.log("partyid", partyid);
    const updatedData = req.body;

    const updateParty = await AddParty.findByIdAndUpdate(partyid, updatedData, {
      new: true,
    });
    if (!updateParty) {
      return res.status(404).json({ error: "Vendor not found" });
    }
    res.status(200).json(updateParty);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/deleteparty/:id", async (req, res) => {
  try {
    const partyId = req.params.id;
    const deletedParty = await AddParty.findByIdAndDelete(partyId);

    if (!deletedParty) {
      return res.status(404).json({ error: "Party not found" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
