const express = require("express");
const router = express.Router();
const AddVendor = require("../models/addVendor");

router.post("/vendors", async (req, res) => {
  try {
    const formData = req.body;
    console.log("formData", formData);

    const randomNum = generateRandomNumber();
    const vendorID = `EasyBBVIID${randomNum}`;
    formData.vendorId = vendorID;

    const vendor = new AddVendor(formData);

    const savedVendor = await vendor.save();
    res.status(201).json(savedVendor);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to create Vendor" });
  }
});

function generateRandomNumber() {
  return Math.floor(1000000000 + Math.random() * 9000000000);
}

router.get("/vendors/:bid", async (req, res) => {
  const businessid = req.params.bid;
  console.log("businessid", businessid);
  try {
    const vendors = await AddVendor.find({ businessId:businessid });
    console.log("vendors", vendors);
    res.status(200).json(vendors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/vendordetails/:id", async (req, res) => {
  const vendorid = req.params.id;

  try {
    const vendor = await AddVendor.findById(vendorid).populate({
      path: "Purchases",
      populate: [
        {
          path: "payments",
          model: "PaymentOutDetails",
        },
      ],
    });

    if (!vendor) {
      return res.status(404).json({ error: "vendor not found" });
    }
    res.status(200).json(vendor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/vendors/:id", async (req, res) => {
  try {
    const vendorid = req.params.id;
    console.log("vendorid 0001", vendorid);
    if (!vendorid) {
      return;
    }
    console.log("vendorid", vendorid);
    const updatedData = req.body;

    const updateVendor = await AddVendor.findByIdAndUpdate(
      vendorid,
      updatedData,
      { new: true }
    );
    if (!updateVendor) {
      return res.status(404).json({ error: "Vendor not found" });
    }
    res.status(200).json(updateVendor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/deletevendors/:id", async (req, res) => {
  try {
    const vendorId = req.params.id;
    const deletedVendor = await AddVendor.findByIdAndDelete(vendorId);

    if (!deletedVendor) {
      return res.status(404).json({ error: "Vendor not found" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

//vendorcontroller
