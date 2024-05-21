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

async function register(req, res) {
  console.log("reeeeq", req.body);
  try {
    // const highestUser = await BusinessSchema.find();
    // const totalLength = highestUser.length;
    const highestUser = await BusinessSchema.find().sort({ userId: -1 }).collation({ locale: 'en_US', numericOrdering: true });
    let nextUserId =  highestUser ? parseInt(highestUser[0]?.userId) + 1 : 1;
    
    const { adminId } = req.body
    let business;
    if (!adminId) {
      business = await new BusinessSchema({
        userId: nextUserId.toString(),
        businessCount:1,
        hasAdmin: false,
        status: "Active",
        role: "",
        adminId: nextUserId.toString(),
        name: req?.body.name,
        email: req?.body?.formData?.email,
        phone: req?.body?.formData?.phone,
        businessName: req?.body?.formData?.businessName,
        businessType: req?.body?.formData?.businessType,
        industryType: req?.body?.formData?.industryType,
        registrationType: req?.body?.formData?.registrationType,
        gstNumber: req?.body?.formData?.gstNumber,
        userCount: 0,
        isUpdated: req?.body.isUpdated,
        publicId: [req?.body.upImg, req?.body.signatureImg],
        address: req?.body.address,
        termsConditions: req?.body.termsConditions,
        country:req?.body.country,
        state: req?.body.state,
        pincode: req?.body.pincode,
        city: req?.body.city,
        PANNumber: "",
        roleAccess: roleAccess,
        template: 1,
      });
      console.log("Before saving user to database");
    } else {
      const adminId = req.body.adminId;

      if (adminId === userId) {
        return res.status(400).json({ error });
      }

      //const userCount = adminId !== userId ? 1 : 0;

      business = await new BusinessSchema({
        userId,
        businessCount: 1,
        hasAdmin: true,
        status: "Active",
        role: "user",
        adminId,
        name: req?.body.name,
        email: req?.body.email,
        phone: req?.body.phone,
        businessName: req?.body.businessName,
        businessType: req?.body.businessType,
        industryType: req?.body.industryType,
        registrationType: req?.body.registrationType,
        gstNumber: req?.body.gstNumber,
        userCount: 1,
        isUpdated: req?.body.isUpdated,
        imgSrc: [req.body.upImg, req.body.signatureImg],
        publicId: [req.body.upImg, req.body.signatureImg],
        address: req.body.address,
        termsConditions: req.body.termsConditions,
        state: req.body.state,
        pincode: req.body.pincode,
        city: req.body.city,
        panNumber: req.body.panNumber,
        roleAccess: roleAccess,
      });
      console.log(" saving user to database");
    }
    await business.save();
    res.status(200).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = register;
