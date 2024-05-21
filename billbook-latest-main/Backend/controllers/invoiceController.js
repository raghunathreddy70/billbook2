const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const AddInvoices = require("../models/addInvoice");
const AddProducts = require("../models/addProduct");
const DeletedInvoice = require("../models/deletedInvoice");
const Transactions = require("../models/Transactionmodel");
const Ledgers = require("../models/Ledgermodel");
const { PassThrough } = require("stream");
const fs = require("fs");
const os = require("os");
const path = require("path");
const addCustomer = require("../models/addCustomer");
const TransactionModel = require("../models/Transactionmodel");
const LedgerModel = require("../models/Ledgermodel");
const ProductReport = require("../models/productReport");
const PartywiseReport = require("../models/partywiseReport");
require("dotenv").config();
const PDFDocument = require("pdfkit");
const nodemailer = require("nodemailer");
const invoiceEmail = require("../emailconfig/invoiceEmail");
const BusinessSchema = require("../models/businessModel");
const paymentDetails = require("../models/paymentDetails");
const mongoose = require("mongoose");
const Transactionmodel = require("../models/Transactionmodel");
const Ledgermodel = require("../models/Ledgermodel");
const BankDetails = require("../models/BankDetails");
const GodownModel = require("../models/GodownModel");
const recentActivities = require("../models/recentActivities");
const addVendor = require("../models/addVendor");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post("/invoices", async (req, res) => {
  try {
    const formData = req.body;
    console.log("formData", formData);

    let signatureImage = formData?.bankDetails?.signatureImage;

    if (signatureImage) {
      const result = await cloudinary.uploader.upload(signatureImage, {
        folder: "billing",
      });
      signatureImage = {
        url: result?.url,
        public_id: result?.public_id,
      };
      console.log("url", signatureImage.url);
      formData.bankDetails.signatureImage = signatureImage;
    }

    const randomNum = generateRandomNumber();
    const invoiceID = `EasyBBINID${randomNum}`;
    formData.invoiceId = invoiceID;

    const customer = await addCustomer.findById(formData.customerName);
    const business = await BusinessSchema.findById(formData.businessId);


    if (formData.grandTotal > 200000) {
      if (
        !(customer.PANNumber.trim().length > 0) ||
        !(business.PANNumber.trim().length > 0)
      ) {
        const iscustomer = customer.PANNumber.trim().length > 0;
        const isBussinessPAN = business.PANNumber.trim().length > 0;
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
    const invoice = new AddInvoices(formData);

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
        const godown = item.godownDetails || {};

        const product = await AddProducts.findById(productId);

        if (Object.keys(godown).length > 0) {
          const allGodownsForProduct = godown.productId.Godown;
          const godownValues = godown.values;

          for (let i = 0; i < allGodownsForProduct.length; i++) {
            const godown = await GodownModel.findOne({
              godownId: allGodownsForProduct[i].godownId,
            });

            console.log("godown Products Per Index", godown.Products);

            for (let j = 0; j < godown?.Products.length; j++) {
              if (godown.Products[j].productId === product.productId) {
                console.log("godown.Products[j]", godown.Products[j]);
                godown.Products[j].openingStock -= godownValues[i] || 0;
              }
            }
            godown.Products = godown.Products;
            await godown.save();

            allGodownsForProduct[i].stock -= godownValues[i] || 0;
          }
          product.Godown = allGodownsForProduct;
          await product.save();
        }

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
      invoiceId: invoice.invoiceId,
      invoiceDate: invoice.invoiceDate,
      invoiceName: invoice.invoiceName,
      invoiceNumber: invoice.invoiceNumber,
      grandTotal: invoice.grandTotal,
      balance: invoice.balance,
      status: invoice.invoiceStatus,
      bankID: invoice.bankId,
      paymentAmount: invoice.grandTotal,
    };
    const newTransaction = new TransactionModel(transactionData);
    await newTransaction.save();

    const ledgerData = {
      invoiceId: invoice.invoiceId,
      customerid: customer.customerId,
      invoiceDate: invoice.invoiceDate,
      invoiceName: invoice.invoiceName,
      invoiceNumber: invoice.invoiceNumber,
      debit: invoice.grandTotal,
      customerBalance: updatecustomerbalance,
    };

    if (invoice.balance === 0) {
      ledgerData.credit = invoice.grandTotal;
    }

    const newLedgerEntry = new LedgerModel(ledgerData);
    await newLedgerEntry.save();

    const Activities = {
      date: invoice.invoiceDate,
      type: invoice.invoiceName,
      partyName: invoice.customerName,
      Amount: invoice.grandTotal,
      businessId: invoice.businessId,
    };

    const newActivity = new recentActivities(Activities);
    await newActivity.save();

    if (invoice.balance === 0) {
      const payments = await paymentDetails.find();
      const paymentNumber = payments.length + 1;
      const invoiceOID = new mongoose.Types.ObjectId(invoice._id);
      const paymentIn = {
        invoiceId: [invoiceOID],
        voucherName: invoice.invoiceName,
        paymentNumber: paymentNumber,
        customername: invoice.customerName,
        paymentDate: invoice.invoiceDate,
        amount: invoice.grandTotal,
        paymentStatus: invoice.invoiceStatus,
        paymentType: invoice.paymentType,
      };
      const newPaymentIn = new paymentDetails(paymentIn);
      await newPaymentIn.save();
    }

    if (formData.bankId.trim().length !== 0) {
      console.log("triggered");
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

router.get("/invoicebyCustomer/:customerid", async (req, res) => {
  const customerID = req.params.customerid;

  try {
    const invoice = await AddInvoices.find({ customerId: customerID }).populate(
      "customerName"
    );

    console.log("invoice", invoice);

    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    res.status(200).json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const panRegex = /^[A-Za-z]{5}\d{4}[A-Za-z]{1}$/;

router.put("/updatePanNumber/:cid/:bid", async (req, res) => {
  const customerId = req.params.cid;
  const businessId = req.params.bid;

  const { pannumber1, pannumber2 } = req.body;

  if (
    (pannumber1?.trim().length > 0 && !panRegex.test(pannumber1)) ||
    (pannumber2?.trim().length > 0 && !panRegex.test(pannumber2))
  ) {
    return res.status(400).json({ error: "Invalid PAN number format" });
  }

  try {
    const customer = await addCustomer.findById(customerId);
    const business = await BusinessSchema.findById(businessId);


    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    if (!business) {
      return res.status(404).json({ error: "Business not found" });
    }

    let updatedCustomer;
    let updatedBusiness;

if(pannumber2?.trim().length > 0){

  updatedCustomer = await addCustomer.findByIdAndUpdate(
    customerId,
    { PANNumber: pannumber2 },
    { new: true }
  );
} 
  
    if(pannumber1?.trim().length > 0 ){

      updatedBusiness = await BusinessSchema.findByIdAndUpdate(
        businessId,
        { PANNumber: pannumber1 },
        { new: true }
      );
    }

    return res.status(200).json({ updatedCustomer, updatedBusiness });
  } catch (error) {
    console.error("Error updating PAN number:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Function to send invoice via email
async function sendInvoiceByEmail(customerEmail, invoiceData) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_AUTH_USER,
      pass: process.env.GMAIL_AUTH_PASSWORD,
    },
  });

  // Generate PDF invoice
  const pdfStream = await generateInvoicePDF(invoiceData);

  // Setup email data
  const mailOptions = {
    from: process.env.GMAIL_AUTH_USER,
    to: customerEmail,
    subject: "Invoice",
    text: "Please find attached invoice",
    attachments: [
      {
        filename: "invoice.pdf",
        content: pdfStream,
        contentType: "application/pdf",
      },
    ],
  };

  // Send email
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        reject("Error sending invoice");
      } else {
        console.log("Email sent: " + info.response);
        resolve("Invoice sent successfully");
      }
    });
  });
}

async function generateInvoicePDF(invoiceData) {
  return new Promise((resolve, reject) => {
    const pdfDoc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks = [];

    pdfDoc.on("data", (chunk) => {
      chunks.push(chunk);
    });

    pdfDoc.on("end", () => {
      const pdfData = Buffer.concat(chunks);
      resolve(pdfData);
    });

    // Write invoice content
    pdfDoc.fontSize(18).text("Invoice", { align: "center" });
    pdfDoc.moveDown();

    // Invoice Information
    pdfDoc.fontSize(12).text(`Invoice Number: ${invoiceData.invoiceNumber}`);
    pdfDoc.text(
      `Invoice Date: ${new Date(invoiceData.invoiceDate).toLocaleDateString()}`
    );
    pdfDoc.text(
      `Due Date: ${new Date(invoiceData.dueDate).toLocaleDateString()}`
    );
    pdfDoc.text(`Reference No: ${invoiceData.referenceNo}`);
    pdfDoc.moveDown();

    // Customer Information
    pdfDoc.fontSize(14).text("Customer Information:");
    pdfDoc.text(`Name: ${invoiceData.customerName.name}`);
    pdfDoc.text(`Email: ${invoiceData.customerName.email}`);
    pdfDoc.text(`Phone: ${invoiceData.customerName.phone}`);
    pdfDoc.moveDown();

    // Invoice Details Table
    pdfDoc.fontSize(14).text("Invoice Details:");
    pdfDoc.moveDown();

    const tableHeaders = ["Product", "Quantity", "Price", "Total"];
    const tableRows = invoiceData.table.map((item) => [
      item.productName,
      item.quantity,
      item.price,
      item.totalAmount,
    ]);

    const tableHeight = pdfDoc.currentLineHeight();
    const tableWidth = 500;
    const cellPadding = 10;

    pdfDoc
      .font("Helvetica-Bold")
      .fontSize(12)
      .text("Invoice Details:", { underline: true })
      .moveDown();

    pdfDoc.font("Helvetica").fontSize(10);

    // Draw table headers
    let currentY = pdfDoc.y;
    tableHeaders.forEach((header, i) => {
      pdfDoc.text(
        header,
        cellPadding + i * (tableWidth / tableHeaders.length),
        currentY,
        {
          width: tableWidth / tableHeaders.length,
          align: "left",
        }
      );
    });

    currentY += tableHeight;

    // Draw table rows
    tableRows.forEach((row) => {
      row.forEach((cell, i) => {
        pdfDoc.text(
          cell.toString(),
          cellPadding + i * (tableWidth / tableHeaders.length),
          currentY,
          {
            width: tableWidth / tableHeaders.length,
            align: "left",
          }
        );
      });
      currentY += tableHeight;
    });

    // End document
    pdfDoc.end();
  });
}

router.post("/invoices/upload-pdf", async (req, res) => {
  try {
    console.log(req?.files);
    if (!req.files || !req.files.pdfFile) {
      return res.status(400).json({ error: "PDF file is required." });
    }

    const pdfFile = req.files.pdfFile;

    // Upload the PDF file to Cloudinary
    const pdfResult = await cloudinary.uploader.upload(pdfFile.tempFilePath, {
      folder: "invoicePDF",
      resource_type: "auto",
      allowed_formats: ["pdf"],
    });

    // Respond with the Cloudinary URL
    res.status(200).json({ pdfUrl: pdfResult.secure_url });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

router.get("/invoices/:bid", async (req, res) => {
  const bussinessid = req.params.bid;
  try {
    const invoices = await AddInvoices.find({
      businessId: bussinessid,
    }).populate("customerName");
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/invoicesdetails/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const invoice = await AddInvoices.findById(id).populate("customerName");

    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    res.status(200).json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/recentActivities/:bid", async (req, res) => {
  const businessid = req.params.bid;
  console.log("businessidsdf", businessid);

  try {
    const activities = await recentActivities.find({ businessId: businessid }).sort({_id: -1}).limit(5);
    const customers = await addCustomer.find({ businessId: businessid });
    const vendor = await addVendor.find({ businessId: businessid });

    console.log(
      "Activities",
      activities,
      "\n",
      "Customers with Buisness",
      customers.length
    );
    // const businessActivities = activities.map(item => item.partyName === customers.some(customer => customer._id) )

    const customerMap = customers.reduce((acc, customer) => {
      acc[customer._id.toString()] = customer.name;
      return acc;
    }, {});

    const purchaseOrdersMap = vendor.reduce((acc, vendors) => {
      acc[vendors._id.toString()] = vendors.name;
      return acc;
    }, {});

    // .filter(activity => customerMap[activity.partyName] ? customerMap[activity.partyName] : activity.partyName)
    const businessActivities = activities.map((activity) => {
      console.log("activity", activity);
      return {
        ...activity._doc,
        partyName:
          activity.type === "Sales Invoice"
            ? customerMap[activity.partyName]
            : activity.type === "Purchases Orders"
            ? purchaseOrdersMap[activity.partyName]
            : activity.partyName,
      };
    });

    console.log("businessActivities", businessActivities);

    if (!activities) {
      return res.status(404).json({ error: "Activities not found" });
    }

    res.status(200).json(businessActivities);
  } catch (error) {
    console.log("xdgdfh");
    res.status(500).json({ error: error.message });
  }
});

router.get("/invoicesforview/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const invoice = await AddInvoices.findById(id)
      .populate("customerName")
      .populate({
        path: "bankDetails",
        populate: {
          path: "selectBank",
          model: "BankDetails",
        },
      });

    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    res.status(200).json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/invoicesbyCustomerId/:customerid", async (req, res) => {
  const customerID = req.params.customerid;
  console.log("customerID", customerID);

  try {
    const invoice = await AddInvoices.find({ customerName: customerID });

    console.log("invoice", invoice);

    const unpaidinvoices = invoice.filter((inv) => inv.balance != 0);

    if (!unpaidinvoices) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    res.status(200).json(unpaidinvoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/allinvoicesbyCustomerId/:customerid", async (req, res) => {
  const customerID = req.params.customerid;

  try {
    const invoice = await AddInvoices.find({ customerId: customerID });

    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }
    res.status(200).json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/transactions/:customerid", async (req, res) => {
  const customerID = req.params.customerid;

  console.log("customerID", customerID);

  try {
    const transactions = await Transactions.find({ customerid: customerID });

    console.log("invoice", transactions);

    if (!transactions) {
      return res.status(404).json({ error: "transactions not found" });
    }

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/ledgers/:customerid", async (req, res) => {
  const customerID = req.params.customerid;

  console.log("customerID", customerID);

  try {
    const ledgers = await Ledgers.find({ customerid: customerID });

    console.log("invoice", ledgers);

    if (!ledgers) {
      return res.status(404).json({ error: "ledgers not found" });
    }

    res.status(200).json(ledgers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/invoicesbycustomer/:customerid", async (req, res) => {
  const customerID = req.params.customerid;

  console.log("customerID", customerID);

  try {
    const invoice = await AddInvoices.find({ customerName: customerID });

    console.log("invoice", invoice);

    // const unpaidpurchaseinvoices = purchase.filter((inv) => inv.balance != 0);

    if (!invoice) {
      return res.status(404).json({ error: "Purchases not found" });
    }

    res.status(200).json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/partyReportbycustomer/:customerid", async (req, res) => {
  const customerID = req.params.customerid;

  console.log("customerID", customerID);

  try {
    const partyReport = await PartywiseReport.find({ customerId: customerID });

    console.log("partyReport", partyReport);

    if (!partyReport) {
      return res.status(404).json({ error: "partyReport not found" });
    }

    res.status(200).json(partyReport);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/invoices/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const invoice = await AddInvoices.findById(id);
    console.log("id", id);
    if (!invoice) {
      return res.status(404).send("Invoice not found");
    }

    console.log("__ID", invoice);

    const AllTransaction = await Transactionmodel.find({
      invoiceId: invoice.invoiceId,
    });
    const AllLedgerStatements = await Ledgermodel.find({
      invoiceId: invoice.invoiceId,
    });

    const AllPaymentIn = await paymentDetails.find({
      invoiceId: { $in: [id] },
    });

    for (let i = 0; i < AllTransaction.length; i++) {
      const transactionId = AllTransaction[i]._id;
      await Transactionmodel.findByIdAndUpdate(transactionId, {
        isDeleted: true,
      });
    }

    for (let i = 0; i < AllLedgerStatements.length; i++) {
      const transactionId = AllLedgerStatements[i]._id;
      await Ledgermodel.findByIdAndUpdate(transactionId, { isDeleted: true });
    }

    for (let i = 0; i < AllPaymentIn.length; i++) {
      const transactionId = AllPaymentIn[i]._id;
      const totalAmount = parseInt(
        parseFloat(AllPaymentIn[0]?.amount) - parseFloat(invoice.grandTotal)
      );
      await paymentDetails.findByIdAndUpdate(transactionId, {
        amount: totalAmount,
      });
      if (totalAmount === 0) {
        await paymentDetails.findByIdAndUpdate(transactionId, {
          isDeleted: true,
        });
      }
    }

    const deletedInvoiceData = {
      businessId: invoice.businessId,
      invoiceNumber: invoice.invoiceNumber,
      customerName: invoice.customerName,
      invoiceDate: invoice.invoiceDate,
      dueDate: invoice.dueDate,
      balance: invoice.balance,
      referenceNo: invoice.referenceNo,
      paymentTerms: invoice.paymentTerms,
      currency: invoice.currency,
      website: invoice.website,
      grandTotal: invoice.grandTotal,
      totalDiscount: invoice.totalDiscount,
      totalTax: invoice.totalTax,
      taxableAmount: invoice.taxableAmount,
      cgstTaxAmount: invoice.cgstTaxAmount,
      sgstTaxAmount: invoice.sgstTaxAmount,
      totalTaxPercentage: invoice.totalTaxPercentage,
      totalDiscountPercentage: invoice.totalDiscountPercentage,
      cgstTaxPercentage: invoice.cgstTaxPercentage,
      sgstTaxPercentage: invoice.sgstTaxPercentage,
      payments: invoice.payments,
      table: invoice.table,
      bankDetails: invoice.bankDetails,
      invoiceId: invoice.invoiceId,
      customerId: invoice.customerId,
      invoiceName: invoice.invoiceName,
      invoiceStatus: invoice.invoiceStatus,
      invoiceOID: invoice._id,
    };

    const newDeletedInvoice = new DeletedInvoice(deletedInvoiceData);
    await newDeletedInvoice.save();
    await AddInvoices.findByIdAndDelete(id);

    res.status(200).send("Invoice deleted successfully");
  } catch (error) {
    console.error("Error deleting invoice:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.delete("/salesRestore/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const Restoresales = await DeletedInvoice.findById(id);
    console.log("Restoresales", Restoresales);

    if (!Restoresales) {
      return res.status(404).send("Restoresales not found");
    }

    const AllTransaction = await Transactionmodel.find({
      invoiceId: Restoresales.invoiceId,
    });
    const AllLedgerStatements = await Ledgermodel.find({
      invoiceId: Restoresales.invoiceId,
    });

    const AllPaymentIn = await paymentDetails.find({
      invoiceId: { $in: [Restoresales.invoiceOID] },
    });

    for (let i = 0; i < AllTransaction.length; i++) {
      const transactionId = AllTransaction[i]._id;
      await Transactionmodel.findByIdAndUpdate(transactionId, {
        isDeleted: false,
      });
    }

    for (let i = 0; i < AllLedgerStatements.length; i++) {
      const transactionId = AllLedgerStatements[i]._id;
      await Ledgermodel.findByIdAndUpdate(transactionId, { isDeleted: false });
    }

    for (let i = 0; i < AllPaymentIn.length; i++) {
      const transactionId = AllPaymentIn[i]._id;
      await paymentDetails.findByIdAndUpdate(transactionId, {
        isDeleted: false,
      });

      const totalAmount = parseInt(
        parseFloat(AllPaymentIn[i]?.amount) +
          parseFloat(Restoresales.grandTotal)
      );
      await paymentDetails.findByIdAndUpdate(transactionId, {
        amount: totalAmount,
      });
    }

    const restoreSalesData = {
      businessId: Restoresales.businessId,
      invoiceNumber: Restoresales.invoiceNumber,
      customerName: Restoresales.customerName,
      invoiceDate: Restoresales.invoiceDate,
      dueDate: Restoresales.dueDate,
      balance: Restoresales.balance,
      referenceNo: Restoresales.referenceNo,
      paymentTerms: Restoresales.paymentTerms,
      currency: Restoresales.currency,
      website: Restoresales.website,
      grandTotal: Restoresales.grandTotal,
      totalDiscount: Restoresales.totalDiscount,
      totalTax: Restoresales.totalTax,
      taxableAmount: Restoresales.taxableAmount,
      cgstTaxAmount: Restoresales.cgstTaxAmount,
      sgstTaxAmount: Restoresales.sgstTaxAmount,
      totalTaxPercentage: Restoresales.totalTaxPercentage,
      totalDiscountPercentage: Restoresales.totalDiscountPercentage,
      cgstTaxPercentage: Restoresales.cgstTaxPercentage,
      sgstTaxPercentage: Restoresales.sgstTaxPercentage,
      payments: Restoresales.payments,
      table: Restoresales.table,
      bankDetails: Restoresales.bankDetails
        ? Restoresales.bankDetails.selectBank
        : null,
      invoiceId: Restoresales.invoiceId,
      customerId: Restoresales.customerId,
      invoiceStatus: Restoresales.invoiceStatus,
      invoiceName: Restoresales.invoiceName,
    };

    const newRestoreSales = new AddInvoices(restoreSalesData);

    await newRestoreSales.save();

    await DeletedInvoice.findByIdAndDelete(id);

    res.status(200).send("Sales restored successfully");
  } catch (error) {
    console.error("Error restoring Sales:", error);
    res.status(500).send("Internal Server Error");
    console.log("triggered");
  }
});

router.get("/newDeletedInvoice/invoices/:bid", async (req, res) => {
  const bussinessid = req.params.bid;
  try {
    const deletedInvoices = await DeletedInvoice.find({
      businessId: bussinessid,
    }).populate("customerName");
    res.status(200).json(deletedInvoices);
  } catch (error) {
    console.error("Error retrieving deleted invoices:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.put("/update-invoice/:invoiceid", async (req, res) => {
  const invoiceID = req.params.invoiceid;
  const updatedData = req.body;

  console.log("updatedData", updatedData);

  try {
    const existingInvoice = await AddInvoices.findById(invoiceID);

    if (!existingInvoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    const customer = await addCustomer.findById(
      updatedData.formData.customerName
    );

    console.log("customer", customer);

    // if (updatedData.formData.grandTotal > 200000) {
    //   if (
    //     !(customer?.PANNumber?.trim().length > 0) ||
    //     !(updatedData?.formData?.bussPANNumber?.trim().length > 0)
    //   ) {
    //     const isCustomerPANPresent = customer?.PANNumber?.trim().length > 0;
    //     const isBusinessPANPresent = updatedData.formData.bussPANNumber.trim().length > 0;
    //     console.log("isCustomerPANPresent", isCustomerPANPresent);
    //     console.log("isBusinessPANPresent", isBusinessPANPresent);
    //     return res.send({ isCustomerPANPresent, isBusinessPANPresent });
    //   }
    // }

    if (updatedData?.formData?.grandTotal > 200000) {
      if (
        !(customer?.PANNumber?.trim().length > 0) ||
        !(updatedData?.formData?.bussPANNumber.trim().length > 0)
      ) {
        const isCustomerPan = customer.PANNumber.trim().length > 0;
        const isBusinessPan =
          updatedData?.formData?.bussPANNumber.trim().length > 0;
        res.send({ isCustomerPan, isBusinessPan });
        return;
      }
    }

    if (updatedData.table && updatedData.table.length > 0) {
      for (const item of updatedData.table) {
        const productId = item.productId;
        const quantity = item.quantity;

        const product = await AddProducts.findById(productId);
        if (product && product.openingStock) {
          product.openingStock -= quantity;
          await product.save();
        }
      }
    }

    let paidStatus = updatedData.formData.balance === 0 ? "PAID" : "UNPAID";

    const updatedInvoice = await AddInvoices.findByIdAndUpdate(
      invoiceID,
      { ...updatedData.formData, invoiceStatus: paidStatus },
      { new: true }
    );


    res.status(200).json({ invoice: updatedInvoice });
  } catch (error) {
    console.error("Error updating invoice:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/sendInvoiceTesting", async (req, res) => {
  try {
    let { mail, endpoint } = req.body;
    await invoiceEmail({ endpoint, mail });
    res.status(200).json("Added mail to queue successfully!");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/sendInvoice", async (req, res) => {
  const { customerEmail, invoiceData } = req.body;

  const invoicedata = invoiceData;
  const outputPath = `${__dirname}/generated_invoice.pdf`;
  generateInvoicePDF(invoicedata, outputPath);

  function generateInvoicePDF(invoiceData, outputPath) {
    const pdfDoc = new PDFDocument({ size: "A4", margin: 50 });

    // Pipe the PDF to a writable stream (in this case, a file)
    const pdfStream = fs.createWriteStream(outputPath);
    pdfDoc.pipe(pdfStream);

    // Invoice Header
    pdfDoc.fontSize(18).text("Invoice", { align: "center" });
    pdfDoc.moveDown();

    // Invoice Information
    pdfDoc.fontSize(12).text(`Invoice Number: ${invoiceData.invoiceNumber}`);
    pdfDoc.text(
      `Invoice Date: ${new Date(invoiceData.invoiceDate).toLocaleDateString()}`
    );
    pdfDoc.text(
      `Due Date: ${new Date(invoiceData.dueDate).toLocaleDateString()}`
    );
    pdfDoc.text(`Reference No: ${invoiceData.referenceNo}`);
    pdfDoc.moveDown();

    // Customer Information
    pdfDoc.fontSize(14).text("Customer Information:");
    pdfDoc.text(`Name: ${invoiceData.customerName.name}`);
    pdfDoc.text(`Email: ${invoiceData.customerName.email}`);
    pdfDoc.text(`Phone: ${invoiceData.customerName.phone}`);
    pdfDoc.moveDown();

    // Invoice Details Table
    pdfDoc.fontSize(14).text("Invoice Details:");
    pdfDoc.moveDown();

    // pdfDoc.table({
    //   headers: ['Product', 'Quantity', 'Price', 'Total'],
    //   rows: invoiceData.table.map((item) => [
    //     item.productName,
    //     item.quantity,
    //     item.price,
    //     item.totalAmount,
    //   ]),
    // });

    // // Grand Total
    // pdfDoc.fontSize(14).text(`Grand Total: ${invoiceData.grandTotal}`);
    // pdfDoc.moveDown();

    // // Additional Information
    // pdfDoc.fontSize(12).text(`Notes: ${invoiceData.bankDetails.notes}`);
    // pdfDoc.text(`Terms and Conditions: ${invoiceData.bankDetails.termsAndConditions}`);
    // pdfDoc.moveDown();

    // // Signature Image
    // pdfDoc.image(invoiceData.bankDetails.signatureImage.url, 400, 700, { width: 100, height: 50 });
    const tableHeaders = ["Product", "Quantity", "Price", "Total"];
    const tableRows = invoiceData.table.map((item) => [
      item.productName,
      item.quantity,
      item.price,
      item.totalAmount,
    ]);

    const tableHeight = pdfDoc.currentLineHeight();
    const tableWidth = 500;
    const cellPadding = 10;

    pdfDoc
      .font("Helvetica-Bold")
      .fontSize(12)
      .text("Invoice Details:", { underline: true })
      .moveDown();

    pdfDoc.font("Helvetica").fontSize(10);

    // Draw table headers
    let currentY = pdfDoc.y;
    tableHeaders.forEach((header, i) => {
      pdfDoc.text(
        header,
        cellPadding + i * (tableWidth / tableHeaders.length),
        currentY,
        {
          width: tableWidth / tableHeaders.length,
          align: "left",
        }
      );
    });

    currentY += tableHeight;

    // Draw table rows
    tableRows.forEach((row) => {
      row.forEach((cell, i) => {
        pdfDoc.text(
          cell.toString(),
          cellPadding + i * (tableWidth / tableHeaders.length),
          currentY,
          {
            width: tableWidth / tableHeaders.length,
            align: "left",
          }
        );
      });
      currentY += tableHeight;
    });

    // End the document
    pdfDoc.end();
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_AUTH_USER,
      pass: process.env.GMAIL_AUTH_PASSWORD,
    },
  });

  // Setup email data
  const mailOptions = {
    from: process.env.GMAIL_AUTH_USER,
    to: "sanjaysanju9448@gmail.com",
    subject: "Invoice",
    text: "Please find attached invoice",
    attachments: [
      {
        filename: "generated_invoice.pdf",
        path: outputPath,
        encoding: "base64",
      },
    ],
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send("Error sending invoice");
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).send("Invoice sent successfully");
    }
  });
});

module.exports = router;
