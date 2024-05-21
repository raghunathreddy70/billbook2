const express = require("express");
const Business = require("../models/businessModel");

const FetchUsersByContact = async (req, res) => {
    try {
        const { phone } = req.body;
        // Find all users with the provided phone number
        const users = await Business.find({ phone: phone });

        // users
        
        if (users.length === 0) {
            return res.status(404).json({ error: 'No users found with the provided phone number' });
        }

        console.log(users);
        res.json(users); // Return found users
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    FetchUsersByContact,
};
