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


async function deleteUser(req, res) {
    try {
        const { userId } = req.body; 

      

        const deletedUser = await BusinessSchema.findOneAndDelete({ userId });

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


module.exports=deleteUser