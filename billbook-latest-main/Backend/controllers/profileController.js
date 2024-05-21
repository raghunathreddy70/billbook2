const express = require("express");
const router = express.Router();
const Profile = require("../models/profileModel");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post("/profile", async (req, res) => {
  try {
    const { profileData } = req.body;
    console.log("profileData", profileData);

    let profileImage = profileData?.profileImage;
    if (profileImage) {
      const result = await cloudinary.uploader.upload(profileImage, {
        folder: "billing",
      });
      profileImage = {
        url: result?.url,
        public_id: result?.public_id,
      };
      profileData.profileImage = profileImage;
    }

    const profile = new Profile(profileData);

    const savedProfile = await profile.save();
    res.status(201).json(savedProfile);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to create profile" });
  }
});

module.exports = router;
