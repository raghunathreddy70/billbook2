const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const AddProducts = require("../models/addProduct");
const addCustomer = require("../models/addCustomer");
const BankDetails = require("../models/BankDetails");
const SalesReturn = require("../models/salesReturn")
const { PassThrough } = require('stream');
const fs = require('fs');
const os = require('os');
const path = require('path');
const ProductReport = require('../models/productReport');
const salesReturn = require('../models/salesReturn');
require('dotenv').config();
const TransactionModel = require("../models/Transactionmodel");
const LedgerModel = require("../models/Ledgermodel");
const PartywiseReport = require("../models/partywiseReport");
const recentActivities = require('../models/recentActivities');


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post('/salesReturn', async (req, res) => {
  try {
    const formData = req.body;
    console.log("formdata", formData)
   

    let signatureImage = formData?.bankDetails?.signatureImage;

    if (signatureImage) {
      const result = await cloudinary.uploader.upload(signatureImage, {
        folder: 'billing',
      });
      signatureImage = {
        url: result?.url,
        public_id: result?.public_id,
      };
      formData.bankDetails.signatureImage = signatureImage;
    }
    
    const randomNum = generateRandomNumber();
    const salesReturnID = `EasyBBSRID${randomNum}`;
    formData.salesReturnId = salesReturnID;

    const customer = await addCustomer.findById(formData.customerName);

    if (formData.grandTotal > 200000) {
      if (
        !(customer.PANNumber.trim().length > 0) ||
        !(formData.bussPANNumber.trim().length > 0)
      ) {
        const iscustomer = customer.PANNumber.trim().length > 0;
        const isBussinessPAN = formData.bussPANNumber.trim().length > 0;
        res.send({ iscustomer, isBussinessPAN });
        return;
      }
    }

    formData.customerId = customer.customerId;
    if (formData.balance === 0) {
      customer.openingBalance += formData.balance;
    } else {
      customer.openingBalance += formData.grandTotal;
    }

    if (formData.bankDetails.selectBank.trim().length === 0) {
      delete formData.bankDetails.selectBank;
    }

    await customer.save();

    const updatecustomerbalance = customer.openingBalance;
    const invoice = new salesReturn(formData);

    const savedInvoice = await invoice.save();

    if (formData.balance === 0) {
      savedInvoice.invoiceStatus = "PAID";
      await savedInvoice.save();
    } else {
      savedInvoice.invoiceStatus = "UNPAID";
      await savedInvoice.save();
    }

    if (formData.table && formData.table.length > 0) {
      for (const item of formData.table) {
        const productId = item.productId;
        const quantity = item.quantity;

        const product = await AddProducts.findById(productId);
        const generatedProductId = product.productId;

        if (product) {
          const { itemName, itemCode, openingStock } = product;

          if (openingStock) {
            product.openingStock -= quantity;
            product.salesProduct += quantity;
            await product.save();
          }

          if (openingStock) {
            product.stockValue = product.openingStock * product.purchasePrice;
            await product.save();
          }

          const productData = {
            productId: generatedProductId,
            itemName: itemName,
            itemCode: itemCode,
            invoiceNumber: formData.invoiceNumber,
            invoiceName: formData.invoiceName,
            invoiceDate: formData.invoiceDate,
            quantity: quantity,
            closingStock: product.openingStock,
            purAmount: formData.grandTotal,
          };

          const newProduct = new ProductReport(productData);
          await newProduct.save();

          console.log("newProduct", newProduct);
          let existingProductReport = await PartywiseReport.findOne({
            customerId: formData.customerId,
          });

          console.log("existingProductReport", existingProductReport);

          if (!existingProductReport) {
            existingProductReport = new PartywiseReport({
              customerId: formData.customerId,
              products: [
                {
                  productId: generatedProductId,
                  quantity: quantity,
                  salesAmount: parseFloat(item.totalAmount),
                  itemCode: itemCode,
                  itemName: itemName,
                },
              ],
            });
          } else {
            const existingProductIndex =
              existingProductReport.products.findIndex(
                (product) => product.productId === generatedProductId
              );

            if (existingProductIndex !== -1) {
              existingProductReport.products[existingProductIndex].quantity +=
                quantity;
              existingProductReport.products[
                existingProductIndex
              ].salesAmount += quantity * parseFloat(item.totalAmount);
            } else {
              existingProductReport.products.push({
                productId: generatedProductId,
                quantity: quantity,
                salesAmount: parseFloat(item.totalAmount),
                itemCode: itemCode,
                itemName: itemName,
              });
            }
          }

          await existingProductReport.save();
          console.log("existingProductReport", existingProductReport);
        }
      }
    }

    let transactionStatus;
    switch (invoice.invoiceStatus) {
      case "PAID":
        transactionStatus = "PAID";
        break;
      default:
        transactionStatus = "UNPAID";
    }

    const transactionData = {
      customerid: customer.customerId,
      invoiceDate: invoice.salesReturnDate,
      invoiceName: invoice.salesReturnName,
      invoiceNumber: invoice.salesReturnNumber,
      grandTotal: invoice.grandTotal,
      balance: invoice.balance,
      status: invoice.invoiceStatus,
      bankID: invoice.bankId,
      paymentAmount: invoice.grandTotal,
    };
    const newTransaction = new TransactionModel(transactionData);
    await newTransaction.save();


    const Activities = {
      date: invoice.salesReturnDate,
      type: invoice.salesReturnName,
      partyName: invoice.customerName,
      Amount: invoice.grandTotal,
    };

    const newActivity = new recentActivities(Activities);
    await newActivity.save();


    const ledgerData = {
      customerid: customer.customerId,
      invoiceDate: invoice.salesReturnDate,
      invoiceName: invoice.salesReturnName,
      invoiceNumber: invoice.salesReturnNumber,
      debit: invoice.grandTotal,
      customerBalance: updatecustomerbalance,
    };

    if (invoice.balance === 0) {
      ledgerData.credit = invoice.grandTotal;
    }

    const newLedgerEntry = new LedgerModel(ledgerData);
    await newLedgerEntry.save();


    if (formData.bankId.trim().length !== 0) {

      const bank = await BankDetails.findOne({ bankId: formData.bankId });

      const openingBalance = bank.openingBalance + formData.grandTotal;

      console.log("openingBalance", openingBalance);

      await BankDetails.findByIdAndUpdate(bank._id, {
        openingBalance: openingBalance,
      });
    }

    res.status(201).json({ invoice: savedInvoice });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

function generateRandomNumber() {
  return Math.floor(1000000000 + Math.random() * 9000000000);
}

router.post("/salesReturn/upload-pdf", async (req, res) => {
  try {
    console.log(req?.files)
      if (!req.files || !req.files.pdfFile) {
          return res.status(400).json({ error: "PDF file is required." });
      }

      const pdfFile = req.files.pdfFile;

      // Upload the PDF file to Cloudinary
      const pdfResult = await cloudinary.uploader.upload(pdfFile.tempFilePath, {
          folder: "purchasePDF",
          resource_type: "auto",
          allowed_formats: ['pdf'],
      });

      // Respond with the Cloudinary URL
      res.status(200).json({ pdfUrl: pdfResult.secure_url });
  } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
  }
});


router.get("/salesReturn/:bid", async (req, res) => {
  const bussinessid = req.params.bid;
  try {
    const salesReturn = await SalesReturn.find({businessId: bussinessid}).populate("customerName")

    res.status(200).json(salesReturn);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



router.get("/salesReturndetails/:id", async (req, res) => {
  const  id  = req.params.id;

  try {
    const salesreturn = await SalesReturn.findById(id).populate("customerName")

    if (!salesreturn) {
      return res.status(404).json({ error: "salesreturn not found" });
    }

    res.status(200).json(salesreturn);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/salesforview/:id", async (req, res) => {
  const  id  = req.params.id;

  try {
    const sales = await SalesReturn.findById(id).populate("customerName")
    .populate({
        path: 'bankDetails',
        populate: {
          path: 'selectBank',
          model: 'BankDetails'
        }
      })

    if (!sales) {
      return res.status(404).json({ error: "sales not found" });
    }

    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/salesReturnbyCustomerId/:customerid", async (req, res) => {
  const  customerID  = req.params.customerid;

  console.log("customerID", customerID)

  try {
    const salesreturn = await SalesReturn.find({ customerId: customerID });

    console.log("salesreturn", salesreturn)

    if (!salesreturn) {
      return res.status(404).json({ error: "salesreturn not found" });
    }

    res.status(200).json(salesreturn);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



router.put("/update-salesreturn/:salesreturnid", async (req, res) => {
  const  salesReturnID  = req.params.salesreturnid;
  const updatedData = req.body;


  try {
    const existingSalesReturn = await SalesReturn.findById(salesReturnID);

    if (!existingSalesReturn) {
      return res.status(404).json({ error: "salesReturn not found" });
    }

    const customer = await addCustomer.findById(updatedData.formData.customerName);

    console.log("customer", customer);

    if (updatedData.formData.grandTotal > 200000) {
      if (
        !(customer?.PANNumber?.trim().length > 0) ||
        !(updatedData?.formData?.bussPANNumber?.trim().length > 0)
      ) {
        const isCustomerPANPresent = customer?.PANNumber?.trim().length > 0;
        const isBusinessPANPresent = updatedData.formData.bussPANNumber.trim().length > 0;
        console.log("isCustomerPANPresent", isCustomerPANPresent);
        console.log("isBusinessPANPresent", isBusinessPANPresent);
        return res.send({ isCustomerPANPresent, isBusinessPANPresent });
      }
    }

   
    if (updatedData.table && updatedData.table.length > 0) {
      for (const item of updatedData.table) {
        const productId = item.productId;
        const quality = item.quantity;

        const product = await AddProducts.findById(productId);
        if (product && product.quality) {
          product.quality -= quality;
          await product.save();
        }
      }
    }

    let updatedSignatureImage = updatedData?.bankDetails?.signatureImage;

    if (updatedSignatureImage) {
      const result = await cloudinary.uploader.upload(updatedSignatureImage, {
        folder: "billing",
      });
      updatedSignatureImage = {
        url: result?.url,
        public_id: result?.public_id,
      };
      updatedData.bankDetails.signatureImage = updatedSignatureImage;
    }

    const updatedSalesReturn = await SalesReturn.findByIdAndUpdate(
        salesReturnID,
      updatedData.formData,
      {
        new: true,
      }
    );

    console.log("updatedSalesReturn by id", updatedSalesReturn)

    res.status(200).json(updatedSalesReturn);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.delete('/salesReturndelete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedSalesReturn = await SalesReturn.findByIdAndDelete(id);

    if (!deletedSalesReturn) {
      return res.status(404).json({ error: 'salesReturn not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
