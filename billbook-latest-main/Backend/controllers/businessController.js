const express = require("express");
const router = express.Router();
const BusinessModel = require("../models/manageBusiness");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post("/manageBusiness", async (req, res) => {
  try {
    const { formData } = req.body;
    console.log("formData", formData);

    let signatureImage = formData?.signatureImage;
    if (signatureImage) {
      const result = await cloudinary.uploader.upload(signatureImage, {
        folder: "billing",
      });
      signatureImage = {
        url: result?.url,
        public_id: result?.public_id,
      };
      formData.signatureImage = signatureImage;
    }

    let profileImage = formData?.profileImage;
    if (profileImage) {
      const result = await cloudinary.uploader.upload(profileImage, {
        folder: "billing",
      });
      profileImage = {
        url: result?.url,
        public_id: result?.public_id,
      };
      formData.profileImage = profileImage;
    }
    const randomNum = generateRandomNumber();
    const businessID = `EasyBBBID${randomNum}`;
    formData.businessId = businessID;
    formData.termsAndConditions =
      "1. Goods once sold will not be taken back or exchanged 2. All disputes are subject to [ENTER_YOUR_CITY_NAME] jurisdiction only";

    const business = new BusinessModel(formData);

    const savedBusiness = await business.save();
    res.status(201).json(savedBusiness);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to create Vendor" });
  }
});

function generateRandomNumber() {
  return Math.floor(1000000000 + Math.random() * 9000000000);
}

router.get("/ManageBusiness", async (req, res) => {
  try {
    const businesses = await BusinessModel.find();
    res.status(200).json(businesses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve businesses" });
  }
});

router.get("/ManageBusiness/:id", async (req, res) => {
  const id = req.params.id;
  console.log("id", id);
  try {
    const business = await BusinessModel.findById(id);
    if (!business) {
      return res.status(404).json({ error: "Business not found" });
    }
    res.status(200).json(business);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve business" });
  }
});



router.put("/updatebussinessPan/:id", async (req, res) => {
  const businessId = req.params.id;
  const { pannumber1, pannumber2} = req.body;

  try {
    const business = await BusinessModel.findById(businessId);
    console.log("business",business)

    if (!business) {
      return res.status(404).json({ error: "business not found" });
    }

    console.log("pannumber1", pannumber1)

    const updatedBusiness = await BusinessModel.findByIdAndUpdate(
      businessId,
      {PANNumber:pannumber1},
      {
        new: true,
      }
    );

    return res.status(200).json(updatedBusiness); 
  } catch (error) {
    console.error("Error updating PAN number:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;
