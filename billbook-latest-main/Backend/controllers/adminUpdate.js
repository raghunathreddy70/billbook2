const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
// const superAdmin = require("../models/superAdmin");
// const Verification = require("../models/verification");
const { default: mongoose } = require("mongoose");

const MongoClient = require("mongodb").MongoClient;

const roleAccess = require("../utils/registrationRoleAccess");

require("dotenv").config();
const express = require("express");
const router = express.Router();

const BusinessSchema = require("../models/businessModel");

async function updateAdmin(req, res) {
  try {
    const { adminId, hasAdmin, phone, } = req.body;
    //console.log(adminId)

    const admin = await BusinessSchema.find({ phone });
    //console.log(admin);

    const adminObject = admin.find(a => a.adminId === adminId);

    console.log(adminObject);

    if (!adminObject) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (adminObject.userId === adminObject.adminId ||(adminObject.role === 'admin')||(!hasAdmin)) {
      let formData = {
        name: req.body.name || adminObject.name,
        email: req.body.email || adminObject.email,
        phone: req.body.phone || adminObject.phone,
        address: req.body.address || adminObject.address,
        state: req.body.state || adminObject.state,
        pincode: req.body.pincode || adminObject.pincode,
        city: req.body.city || adminObject.city,
        panNumber: req.body.panNumber || adminObject.panNumber,
        isUpdated: new Date(),
        businessName:req.body.businessName || adminObject.businessName,
        industryType:req.body.industryType || adminObject.industryType,
        registrationType:req.body.registrationType || adminObject.registrationType,
        userCount: 0,
        businessCount:1, 
        adminId: req.body.adminId || adminObject.adminId,
        imgSrc: req.body.imgSrc || adminObject.imgSrc,
        publicId: req.body.publicId || adminObject.publicId,
        termsConditions: req.body.termsConditions || adminObject.termsConditions,
        role: 'admin', 
      };

      console.log("FORMDATA: \n", formData);

      await BusinessSchema.findOneAndUpdate({ userId: adminId }, formData, {
        new: true,
        upsert: true
      })

      return res.status(200).json({ message: "Admin updated", admin: formData });
    } else {
      return res.status(403).json({ message: "Unauthorized access" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = updateAdmin;
