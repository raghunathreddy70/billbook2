const express = require("express");
const router = express.Router();
const AddInvoice = require("../models/addInvoice");
const AddDelChallen = require("../models/deliveryChallen");
const AddQuotation = require("../models/addQuotation");
const Proforma = require("../models/proforma");
const AddPurchases = require("../models/addPurchases");
const PurchaseOrders = require("../models/purchaseOrders");
const Transactionmodel = require("../models/Transactionmodel");
const Ledgermodel = require("../models/Ledgermodel");
const addCustomer = require("../models/addCustomer");
require("dotenv").config();

router.post("/convertToInvoice", async (req, res) => {
  try {
    const { delChallenDetail } = req.body;

    console.log("delChallenDetail", delChallenDetail)

    const challanid = delChallenDetail._id;

    const randomNum = generateRandomNumber();
    const invoiceID = `EasyBBINID${randomNum}`;

    const inovices = await AddInvoice.find();
    const maxInvoiceNumber = Math.max(
      ...inovices.map((invoice) => invoice.invoiceNumber)
    );
    const inoviceslength = maxInvoiceNumber + 1;

    const newInvoice = new AddInvoice({
      customerId: delChallenDetail.customerId,
      invoiceName: "Sales Invoice",
      invoiceId: invoiceID,
      invoiceNumber: inoviceslength,
      customerName: delChallenDetail.customerName,
      invoiceDate: new Date(),
      dueDate: new Date(delChallenDetail.dueDate),
      referenceNo: delChallenDetail.referenceNo,
      paymentTerms: delChallenDetail.paymentTerms,
      currency: delChallenDetail.currency,
      website: delChallenDetail.website,
      grandTotal: delChallenDetail.grandTotal,
      totalDiscount: delChallenDetail.totalDiscount,
      totalTax: delChallenDetail.totalTax,
      taxableAmount: delChallenDetail.taxableAmount,
      cgstTaxAmount: delChallenDetail.cgstTaxAmount,
      sgstTaxAmount: delChallenDetail.sgstTaxAmount,
      totalTaxPercentage: delChallenDetail.totalTaxPercentage,
      totalDiscountPercentage: delChallenDetail.totalDiscountPercentage,
      cgstTaxPercentage: delChallenDetail.cgstTaxPercentage,
      sgstTaxPercentage: delChallenDetail.sgstTaxPercentage,
      balance: delChallenDetail.balance,
      table: delChallenDetail.table,
      bankDetails: delChallenDetail.bankDetails,
    });


    await newInvoice.save();

    const customer = await addCustomer.findById(newInvoice.customerName);

    const updatecustomerbalance = customer.openingBalance;
    const ledgerData = {
      invoiceId: newInvoice.invoiceId,
      customerid: newInvoice.customerId,
      invoiceDate: newInvoice.invoiceDate,
      invoiceName: newInvoice.invoiceName,
      invoiceNumber: newInvoice.invoiceNumber,
      debit: newInvoice.grandTotal,
      customerBalance: updatecustomerbalance,
    };

    if (newInvoice.balance === 0) {
      ledgerData.credit = newInvoice.grandTotal;
    }

    console.log("ledgerData", ledgerData)

    const newLedgerEntry = new Ledgermodel(ledgerData);
    await newLedgerEntry.save();

    const transactionData = {
      customerid: newInvoice.customerId,
      invoiceId: newInvoice.invoiceId,
      invoiceDate: newInvoice.invoiceDate,
      invoiceName: newInvoice.invoiceName,
      invoiceNumber: newInvoice.invoiceNumber,
      grandTotal: newInvoice.grandTotal,
      balance: newInvoice.balance,
      // status: newInvoice.invoiceStatus,
      // bankID: newInvoice.bankId,
      paymentAmount: newInvoice.grandTotal,
    };

    const newTransaction = new Transactionmodel(transactionData);
    await newTransaction.save();

    console.log("transactionData", transactionData)

    const delChallen = await AddDelChallen.findByIdAndDelete(challanid);

    console.log("DelChallenID:", newInvoice);

    res.status(201).json(newInvoice);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



function generateRandomNumber() {
  return Math.floor(1000000000 + Math.random() * 9000000000);
}

//quotation to invoice
router.post("/quotationToInvoice", async (req, res) => {
  try {
    const { quotationDetails } = req.body;

    console.log("quotationDetails", quotationDetails);
    const quotationid = quotationDetails._id;

    const randomNum = generateRandomNumber();
    const invoiceID = `EasyBBINID${randomNum}`;

    const inovices = await AddInvoice.find();
    const maxInvoiceNumber = Math.max(
      ...inovices.map((invoice) => invoice.invoiceNumber)
    );
    const inoviceslength = maxInvoiceNumber + 1;

    const newInvoice = new AddInvoice({
      customerId: quotationDetails.customerId,
      invoiceName: "Sales Invoice",
      invoiceId: invoiceID,
      invoiceNumber: inoviceslength,
      customerName: quotationDetails.customerName,
      invoiceDate: new Date(),
      dueDate: new Date(quotationDetails.dueDate),
      referenceNo: quotationDetails.referenceNo,
      paymentTerms: quotationDetails.paymentTerms,
      currency: quotationDetails.currency,
      website: quotationDetails.website,
      grandTotal: quotationDetails.grandTotal,
      totalDiscount: quotationDetails.totalDiscount,
      totalTax: quotationDetails.totalTax,
      taxableAmount: quotationDetails.taxableAmount,
      cgstTaxAmount: quotationDetails.cgstTaxAmount,
      sgstTaxAmount: quotationDetails.sgstTaxAmount,
      totalTaxPercentage: quotationDetails.totalTaxPercentage,
      totalDiscountPercentage: quotationDetails.totalDiscountPercentage,
      cgstTaxPercentage: quotationDetails.cgstTaxPercentage,
      sgstTaxPercentage: quotationDetails.sgstTaxPercentage,
      balance: quotationDetails.balance,
      table: quotationDetails.table,
      bankDetails: quotationDetails.bankDetails,
    });

    // Save the new invoice to the database
    await newInvoice.save();

    const customer = await addCustomer.findById(newInvoice.customerName);

    const updatecustomerbalance = customer.openingBalance;
    const ledgerData = {
      invoiceId: newInvoice.invoiceId,
      customerid: newInvoice.customerId,
      invoiceDate: newInvoice.invoiceDate,
      invoiceName: newInvoice.invoiceName,
      invoiceNumber: newInvoice.invoiceNumber,
      debit: newInvoice.grandTotal,
      customerBalance: updatecustomerbalance,
    };

    if (newInvoice.balance === 0) {
      ledgerData.credit = newInvoice.grandTotal;
    }

    console.log("ledgerData", ledgerData)

    const newLedgerEntry = new Ledgermodel(ledgerData);
    await newLedgerEntry.save();



    const transactionData = {
      customerid: newInvoice.customerId,
      invoiceId: newInvoice.invoiceId,
      invoiceDate: newInvoice.invoiceDate,
      invoiceName: newInvoice.invoiceName,
      invoiceNumber: newInvoice.invoiceNumber,
      grandTotal: newInvoice.grandTotal,
      balance: newInvoice.balance,
      // status: newInvoice.invoiceStatus,
      // bankID: newInvoice.bankId,
      paymentAmount: newInvoice.grandTotal,
    };

    const newTransaction = new Transactionmodel(transactionData);
    await newTransaction.save();

    console.log("transactionData", transactionData)

    const quotation = await AddQuotation.findByIdAndDelete(quotationid);

    // const delChallen = await AddDelChallen.findById(delChallenID);

    // delChallenDetail.delChanId = delChallen.delChanId

    console.log("QuotationID:", newInvoice);

    res.status(201).json(newInvoice);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/proformaToInvoice", async (req, res) => {
  try {
    const { proformaDetails } = req.body;

    console.log("proformaDetails", proformaDetails);
    const proformaid = proformaDetails._id;

    const randomNum = generateRandomNumber();
    const invoiceID = `EasyBBINID${randomNum}`;

    const invoices = await AddInvoice.find();
    const maxInvoiceNumber = Math.max(
      ...invoices.map((invoice) => invoice.invoiceNumber)
    );
    const invoiceNumber = maxInvoiceNumber + 1;

    const newInvoice = new AddInvoice({
      customerId: proformaDetails.customerId,
      invoiceName: "Sales Invoice",
      invoiceId: invoiceID,
      invoiceNumber: invoiceNumber,
      customerName: proformaDetails.customerName,
      invoiceDate: new Date(),
      dueDate: new Date(proformaDetails.dueDate),
      referenceNo: proformaDetails.referenceNo,
      paymentTerms: proformaDetails.paymentTerms,
      currency: proformaDetails.currency,
      website: proformaDetails.website,
      grandTotal: proformaDetails.grandTotal,
      totalDiscount: proformaDetails.totalDiscount,
      totalTax: proformaDetails.totalTax,
      taxableAmount: proformaDetails.taxableAmount,
      cgstTaxAmount: proformaDetails.cgstTaxAmount,
      sgstTaxAmount: proformaDetails.sgstTaxAmount,
      totalTaxPercentage: proformaDetails.totalTaxPercentage,
      totalDiscountPercentage: proformaDetails.totalDiscountPercentage,
      cgstTaxPercentage: proformaDetails.cgstTaxPercentage,
      sgstTaxPercentage: proformaDetails.sgstTaxPercentage,
      balance: proformaDetails.balance,
      table: proformaDetails.table,
      bankDetails: proformaDetails.bankDetails,
    });

    // Save the new invoice to the database
    await newInvoice.save();

    const customer = await addCustomer.findById(newInvoice.customerName);

    const updatecustomerbalance = customer.openingBalance;
    const ledgerData = {
      invoiceId: newInvoice.invoiceId,
      customerid: newInvoice.customerId,
      invoiceDate: newInvoice.invoiceDate,
      invoiceName: newInvoice.invoiceName,
      invoiceNumber: newInvoice.invoiceNumber,
      debit: newInvoice.grandTotal,
      customerBalance: updatecustomerbalance,
    };

    if (newInvoice.balance === 0) {
      ledgerData.credit = newInvoice.grandTotal;
    }

    console.log("ledgerData", ledgerData)

    const newLedgerEntry = new Ledgermodel(ledgerData);
    await newLedgerEntry.save();

    const transactionData = {
      customerid: newInvoice.customerId,
      invoiceId: newInvoice.invoiceId,
      invoiceDate: newInvoice.invoiceDate,
      invoiceName: newInvoice.invoiceName,
      invoiceNumber: newInvoice.invoiceNumber,
      grandTotal: newInvoice.grandTotal,
      balance: newInvoice.balance,
      // status: newInvoice.invoiceStatus,
      // bankID: newInvoice.bankId,
      paymentAmount: newInvoice.grandTotal,
    };

    const newTransaction = new Transactionmodel(transactionData);
    await newTransaction.save();

    console.log("transactionData", transactionData)


    const performa = await Proforma.findByIdAndDelete(proformaid);

    console.log("newInvoice:", newInvoice);

    res.status(201).json(newInvoice);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/purchaseordertopurchase", async (req, res) => {
  try {
    const { purchaseOrderDetails } = req.body;

    console.log("purchaseOrderDetails", purchaseOrderDetails);
    const purchaseORid = purchaseOrderDetails._id;

    const randomNum = generateRandomNumber();
    const purchaseID = `EasyBBPUID${randomNum}`;

    const purchases = await AddPurchases.find();
    const maxPurchaseNumber = Math.max(
      ...purchases.map((purchase) => purchase.purchaseNumber)
    );
    const purchaseNumber = maxPurchaseNumber + 1;

    const newPurchase = new AddPurchases({
      vendorId: purchaseOrderDetails.vendorId,
      purchaseName: "Purchase Invoice",
      purchasesId: purchaseID,
      purchaseNumber: purchaseNumber,
      name: purchaseOrderDetails.name,
      purchasesDate: new Date(),
      dueDate: new Date(purchaseOrderDetails.dueDate),
      referenceNo: purchaseOrderDetails.referenceNo,
      paymentTerms: purchaseOrderDetails.paymentTerms,
      currency: purchaseOrderDetails.currency,
      website: purchaseOrderDetails.website,
      grandTotal: purchaseOrderDetails.grandTotal,
      totalDiscount: purchaseOrderDetails.totalDiscount,
      totalTax: purchaseOrderDetails.totalTax,
      taxableAmount: purchaseOrderDetails.taxableAmount,
      cgstTaxAmount: purchaseOrderDetails.cgstTaxAmount,
      sgstTaxAmount: purchaseOrderDetails.sgstTaxAmount,
      totalTaxPercentage: purchaseOrderDetails.totalTaxPercentage,
      totalDiscountPercentage: purchaseOrderDetails.totalDiscountPercentage,
      cgstTaxPercentage: purchaseOrderDetails.cgstTaxPercentage,
      sgstTaxPercentage: purchaseOrderDetails.sgstTaxPercentage,
      balance: purchaseOrderDetails.balance,
      table: purchaseOrderDetails.table,
      bankDetails: purchaseOrderDetails.bankDetails,
    });

    // Save the new invoice to the database
    await newPurchase.save();

    const purchaseOrder = await PurchaseOrders.findByIdAndDelete(purchaseORid);

    console.log("purchaseORid:", newPurchase);

    res.status(201).json(newPurchase);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
