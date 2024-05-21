//usercounnt increment,adminid!==userid,businesscount=0,role=user,
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


 async function updateUser(req, res) {
    try {
      const { userId, hasAdmin,phone, } = req.body;
      
      
      const user = await BusinessSchema.find({ phone });
      console.log(user)
      //const uid=user[0].userId
      //console.log(uid);
      // let idx;
      // for(let i=0;i<user.length;i++){
        
      //   if(user[i].userId === userId){
      //     idx= i;
      //   }
      // }

      // console.log(user[idx])
      const userObject = user.find(u => u.userId === userId);

      console.log(userObject);
      
      if (!userObject) {
        return res.status(404).json({ message: "User not found" });
      }
  
      if  (hasAdmin&& (userObject.userId!==userObject.adminId)) {
        let   formData = {
          
                    name: req.body.name || userObject.name,
                    email: req.body.email || userObject.email,
                    phone: req.body.phone || userObject.phone,
                    address: req.body.address || userObject.address,
                    state: req.body.state || userObject.state,
                    pincode: req.body.pincode || userObject.pincode,
                    city: req.body.city || userObject.city,
                    panNumber: req.body.panNumber || userObject.panNumber,
                    isUpdated: new Date(),
                    userCount: userObject.userCount, 
                    businessCount: 0, 
                    adminId: req.body.adminId || userObject.adminId,
                    imgSrc: req.body.imgSrc || userObject.imgSrc,
                    publicId: req.body.publicId || userObject.publicId,
                    termsConditions: req.body.termsConditions || userObject.termsConditions,
                  };

                  console.log("FORMDATA: \n",formData);
            

        await BusinessSchema.findOneAndUpdate({userId},formData, {
          new: true,
          upsert: true
        })
  
        return await res.status(200).json({ message: "User updated", user });
      } else {
        return res.status(403).json({ message: "Unauthorized access" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
module.exports=updateUser
  

   //async function updateUser(req, res) {
//   try {
//     const { userId, hasAdmin, phone } = req.body;
    
//     const users = await BusinessSchema.find({ phone });
//     console.log(users);

//     const userObject = users.find(u => u.userId === userId);
//     console.log(userObject);
    
//     if (!userObject) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     if (hasAdmin) {
//       let formData = {
//         name: req.body.name || userObject.name,
//         email: req.body.email || userObject.email,
//         phone: req.body.phone || userObject.phone,
//         address: req.body.address || userObject.address,
//         state: req.body.state || userObject.state,
//         pincode: req.body.pincode || userObject.pincode,
//         city: req.body.city || userObject.city,
//         panNumber: req.body.panNumber || userObject.panNumber,
//         isUpdated: new Date(),
//         userCount: userObject.userCount + 1, 
//         businessCount: 0, 
//         adminId: req.body.adminId || userObject.adminId,
//         imgSrc: req.body.imgSrc || userObject.imgSrc,
//         publicId: req.body.publicId || userObject.publicId,
//         termsConditions: req.body.termsConditions || userObject.termsConditions,
//       };

//       const updatedUser = await BusinessSchema.findOneAndUpdate({ userId }, formData, { new: true });
//       return res.status(200).json({ message: "User updated", user: updatedUser });
//     } else {
//       return res.status(403).json({ message: "Unauthorized access" });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// }

// module.exports = updateUser;