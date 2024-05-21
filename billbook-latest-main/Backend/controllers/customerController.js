const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const AddCustomer = require("../models/addCustomer");
require("dotenv").config();
const BusinessSchema = require("../models/businessModel")

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post("/customers", async (req, res) => {
  try {
 
    const formData = req.body;
  

    let Image = formData?.image;
    if (Image) {
      const result = await cloudinary.uploader.upload(Image, {
        folder: "billing",
      });
      Image = {
        url: result?.url,
        public_id: result?.public_id,
      };
      formData.image = Image;
    }

    const formDatas = formData.phoneNumber;
    const customername = formData.name;

    const customerID = `EasyBBCustomID${formDatas}${customername}`;
    formData.customerId = customerID;

    const customer = new AddCustomer({
      ...formData,
      phoneNumber: formData.phoneNumber,
    });

    const savedCustomer = await customer.save();

    res.status(201).json(savedCustomer);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to create customer" });
  }
});

router.post("/customersmodal", async (req, res) => {
  try {
    const formData = req.body;

    console.log("formData", formData);

    let Image = formData?.image;
    if (Image) {
      const result = await cloudinary.uploader.upload(Image, {
        folder: "billing",
      });
      Image = {
        url: result?.url,
        public_id: result?.public_id,
      };
      formData.image = Image;
    }

    const formDatas = formData.customer.phoneNumber;
    const customername = formData.name;

    const customerID = `EasyBBCustomID${formDatas}${customername}`;
    formData.customerId = customerID;

    const customer = new AddCustomer(formData);

    const savedCustomer = await customer.save();

    res.status(201).json(savedCustomer);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to create customer" });
  }
});

function generateRandomNumber() {
  return Math.floor(1000000000 + Math.random() * 9000000000);
}

router.get("/customers/:bid", async (req, res) => {
  const bussinessid = req.params.bid;
  try {
    const customers = await AddCustomer.find( {businessId: bussinessid}).populate("Invoices");
    res.status(200).json(customers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve customers" });
  }
});

router.get("/getcustomerdetails/:id", async (req, res) => {
  const customerid = req.params.id;
  console.log("customerid", customerid)

  try {
    const customer = await AddCustomer.findById(customerid).populate({
      path: "Invoices",
      populate: [
        {
          path: "payments",
          model: "PaymentDetails",
        },
      ],
    });

    // console.log("customer", customer)

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// router.put("/update-customer/:customerid", async (req, res) => {
//   try {
//     const customIdentifier = req.params.customerid;

//     const existingCustomer = await AddCustomer.findOneAndUpdate(
//       { customerId: customIdentifier },
//       { $set: req.body },
//       { new: true }
//     );

//     if (!existingCustomer) {
//       return res.status(404).json({ error: "Customer not found" });
//     }

//     console.log("updatedCustomer by id", existingCustomer);

//     res.status(200).json(existingCustomer);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message });
//   }
// });

router.put("/update-customer/:customerid", async (req, res) => {
  try {
    const customerid = req.params.customerid;

    console.log("customerid 0001", customerid);
    if (!customerid) {
      return;
    }
    console.log("customerid", customerid);
    const updatedData = req.body;

    const updatedCustomer = await AddCustomer.findByIdAndUpdate(
      customerid,
      updatedData,
      { new: true }
    );
    if (!updatedCustomer) {
      return res.status(404).json({ error: "customer not found" });
    }
    res.status(200).json(updatedCustomer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/deletecustomers/:id", async (req, res) => {
  try {
    const customerid = req.params.id;
    const deletedCustomer = await AddCustomer.findByIdAndDelete(customerid);

    if (!deletedCustomer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete customer" });
  }
});

module.exports = router;

//customer controller
