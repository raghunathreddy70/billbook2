const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { default: mongoose } = require("mongoose");
const MongoClient = require("mongodb").MongoClient;
const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const BusinessSchema = require("../models/businessModel");
require("dotenv").config();
const roleAccess = require("../utils/registrationRoleAccess");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function manageBusiness(req, res) {
  try {
    // const  formData  = req.body.formData;
    // console.log("formData", formData);
    const { phone } = req.body;

    console.log("phone", phone, req.body);

    const businesses = await BusinessSchema.find({ phone : phone });
    

    console.log("businesses", businesses);
    res.status(200).json({ businesses });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function deleteBusiness(req, res) {
    try {
       
         const  _id = req.body._id
      
        console.log("_id",_id);
        const deleteUser = await BusinessSchema.findOneAndDelete({_id });

        if (!deleteUser) {
            return res.status(404).json({ message: "Business not found" });
        }

        return res.status(200).json({ message: "Business deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
}
async function updateBusiness (req, res) {
    try {
      const id = req.params.id;
  
      console.log("id 0001",req.body);
     
      if (!id) {
        return;
      }
      
      const updatedData = req.body;

      let profileImage = updatedData.profileImage;
      let signatureImage = updatedData.signatureImage;

      if(updatedData.profileImage !== null || updatedData.signatureImage !== null){

        

        if (updatedData.profileImage !== null && !updatedData.profileImage.url) {
          const result = await cloudinary.uploader.upload(profileImage, {
            folder: "billing",
          });
    
          profileImage = {
            url: result.secure_url,
            public_id: result.public_id,
          };
        }

        if (updatedData.signatureImage !== null && !updatedData.signatureImage.url) {
          const result = await cloudinary.uploader.upload(signatureImage, {
            folder: "billing",
          });
    
          signatureImage = {
            url: result.secure_url,
            public_id: result.public_id,
          };
        }
      }
  
      const updatedBusiness = await BusinessSchema.findByIdAndUpdate(
        id,
        {...updatedData, profileImage , signatureImage},
        { new: true }
      );
      if (!updatedBusiness) {
        return res.status(404).json({ error: "business not found" });
      }
      res.status(200).json(updatedBusiness);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  async function businessCreate(req, res) {
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
          email: req?.body?.email,
          phone: req?.body?.phone,
          businessName: req?.body?.businessName,
          businessType: req?.body?.businessType,
          industryType: req?.body?.industryType,
          registrationType: req?.body?.registrationType,
          gstNumber: req?.body?.gstNumber,
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
      res.status(200).json({ newBID: business._id, message: "User registered successfully." });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  async function uploadImage(req, res) {
    try {
      const result = await cloudinary.uploader.upload(req.body.file, {
        resource_type: 'auto' 
      });
  
      console.log('File uploaded to Cloudinary:', result);
      res.json(result);
    } catch (error) {
      console.error('Error uploading file to Cloudinary:', error);
      res.status(500).send('Error uploading file');
    }
  }

module.exports={manageBusiness,deleteBusiness,updateBusiness,businessCreate,uploadImage}