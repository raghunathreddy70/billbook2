const express = require("express");
const router = express.Router();
const addCustomer = require("../models/addCustomer");
const PaymentDetails = require("../models/paymentDetails");
const TransactionModel = require("../models/Transactionmodel");
const LedgerModel = require("../models/Ledgermodel");
const invoiveschema = require("../models/addInvoice");
const BankDetails = require("../models/BankDetails");
var mongoose = require("mongoose");
const Transactionmodel = require("../models/Transactionmodel");
const Ledgermodel = require("../models/Ledgermodel");
require("dotenv").config();

router.post("/payment", async (req, res) => {
  try {
    const paymentData = req.body;

    console.log("paymentData", paymentData);

    const payment = new PaymentDetails(paymentData);

    const invoice = paymentData.invoiceId;

    const invoiceid = await invoiveschema.findById(invoice);

    invoiceid.balance -= paymentData.amount;

    if (invoiceid.balance < 0) {
      invoiceid.balance = 0;
    }

    if (invoiceid.balance > 0) {
      const invoiceDate = new Date(invoiceid.invoiceDate);
      const dueDate = new Date(invoiceid.dueDate);

      if (invoiceid.balance === invoiceid.grandTotal) {
        invoiceid.invoiceStatus = "UNPAID";
      } else if (invoiceDate > dueDate) {
        const overdueDays = Math.floor(
          (invoiceDate - dueDate) / (1000 * 60 * 60 * 24)
        );
        invoiceid.invoiceStatus = "OVERDUE";
      }
      // else {
      //   invoiceid.invoiceStatus = 'PARTIALLY PAID';
      // }
    } else {
      invoiceid.invoiceStatus = "PAID";
    }
    await invoiceid.save();

    const customer = await addCustomer.findById(invoiceid.customerName);

    customer.openingBalance -= paymentData.amount;

    await customer.save();

    const updatecustomerbalance = customer.openingBalance;

    let transactionStatus;
    switch (invoiceid.invoiceStatus) {
      case "PAID":
        transactionStatus = "PAID";
        break;

      default:
        transactionStatus = "UNPAID";
    }

    const bank = await BankDetails.findOne({ bankId: paymentData.bankId });

    console.log("bank", bank);
    const openingBalance = bank.openingBalance + paymentData.amount;

    await BankDetails.findByIdAndUpdate(bank._id, {
      openingBalance: openingBalance,
    });

    const transactionData = {
      customerid: customer.customerId,
      invoiceDate: invoiceid.invoiceDate,
      invoiceName: "Payment In",
      invoiceNumber: invoiceid.invoiceNumber,
      grandTotal: invoiceid.grandTotal,
      balance: invoiceid.balance,
      status: invoiceid.invoiceStatus,
      bankID: paymentData.bankId,
      paymentAmount: paymentData.amount,
    };
    const newTransaction = new TransactionModel(transactionData);
    await newTransaction.save();

    const ledgerData = {
      customerid: customer.customerId,
      invoiceDate: invoiceid.invoiceDate,
      invoiceName: "Payment In",
      invoiceNumber: invoiceid.invoiceNumber,
      credit: paymentData.amount,
      customerBalance: updatecustomerbalance,
    };

    const newLedgerEntry = new Ledgermodel(ledgerData);
    await newLedgerEntry.save();

    const savedPayment = await payment.save();

    res.status(201).json(savedPayment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/payment-in", async (req, res) => {
  try {
    const paymentData = req.body;

    console.log("paymentData", paymentData);

    const payment = new PaymentDetails(paymentData);

    const invoice = paymentData.invoiceId;
    console.log("invoiceNUMBER", invoice);

    for (let i = 0; i < invoice?.length; i++) {
      console.log("Value of I", i);

      const invoiceOID = new mongoose.Types.ObjectId(invoice[i]);
      console.log("Invoice ID:", invoiceOID); // Check the generated ObjectId
      const invoiceid = await invoiveschema.findById(invoiceOID);
      console.log("Invoice:", invoiceid);

      const InvoiceId = invoiceid.invoiceId;

      console.log("InvoiceIdasdasdd", InvoiceId);

      console.log("invoice traverseID", invoice[i]);

      invoiceid.balance -= invoiceid.balance;

      if (invoiceid.balance < 0) {
        invoiceid.balance = 0;
      }

      if (invoiceid.balance > 0) {
        const invoiceDate = new Date(invoiceid.invoiceDate);
        const dueDate = new Date(invoiceid.dueDate);

        if (invoiceid.balance === invoiceid.grandTotal) {
          invoiceid.invoiceStatus = "UNPAID";
        } else if (invoiceDate > dueDate) {
          const overdueDays = Math.floor(
            (invoiceDate - dueDate) / (1000 * 60 * 60 * 24)
          );
        }
      } else {
        invoiceid.invoiceStatus = "PAID";
      }
      await invoiceid.save();

      const customer = await addCustomer.findById(invoiceid.customerName);

      customer.openingBalance -= paymentData.amount;

      await customer.save();

      payment.customerName = invoiceid.customerName;
      await payment.save();
      const updatecustomerbalance = customer.openingBalance;

      console.log("first")

      if (paymentData.bankID.trim().length !== 0) {

        console.log("triggered")
        const bank = await BankDetails.findOne({ bankId: paymentData.bankID });

        const openingBalance = bank.openingBalance + paymentData.amount;

        await BankDetails.findByIdAndUpdate(bank._id, {
          openingBalance: openingBalance,
        });
      }

      let transactionStatus;
      switch (invoiceid.invoiceStatus) {
        case "PAID":
          transactionStatus = "PAID";
          break;
          // case "PARTIALLY PAID":
          //   transactionStatus = "PARTIALLY PAID";
          break;
        default:
          transactionStatus = "UNPAID";
      }
      console.log("AFTERbank");

      const transactionData = {
        customerid: customer.customerId,
        invoiceDate: invoiceid.invoiceDate,
        invoiceName: "Payment In",
        invoiceNumber: invoiceid.invoiceNumber,
        // grandTotal: invoiceid.grandTotal,
        // balance: invoiceid.balance,
        status: invoiceid.invoiceStatus,
        // paymentAmount: paymentData.amount,
        paymentAmount: invoiceid.grandTotal,
        bankID: paymentData.bankID,
      };
      console.log("transactionData", transactionData);

      const newTransaction = new Transactionmodel(transactionData);
      console.log("newTransaction", newTransaction);
      await newTransaction.save();

      const ledgerData = {
        customerid: customer.customerId,
        invoiceDate: invoiceid.invoiceDate,
        invoiceName: "Payment In",
        invoiceNumber: invoiceid.invoiceNumber,
        credit: invoiceid.grandTotal,
        customerBalance: updatecustomerbalance,
        bankID: paymentData.bankID,
        paymentMode: paymentData.paymentType,
      };

      const newLedgerEntry = new LedgerModel(ledgerData);
      await newLedgerEntry.save();

      const savedPayment = await payment.save();
      console.log("savedPayment", savedPayment);
    }

    res.status(201).json("success");
  } catch (error) {
    res.status(400).json({ error1: error });
  }
});

router.get("/payment/:bid", async (req, res) => {
  const bussinessid = req.params.bid;
  try {
    const payments = await PaymentDetails.find({businessId: bussinessid}).populate("customername");

    console.log("payments", payments);
    res.status(200).json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve payments" });
  }
});

router.get("/paymentbycustomerid/:customerID", async (req, res) => {
  const customerID = req.params.customerID;

  try {
    const payments = await PaymentDetails.find({ customerid: customerID });
    res.status(200).json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve payments" });
  }
});

router.get("/paymentinforview/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const paymentIn = await PaymentDetails.findById(id).populate(
      "customerName"
    );

    if (!paymentIn) {
      return res.status(404).json({ error: "paymentIn not found" });
    }

    res.status(200).json(paymentIn);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
