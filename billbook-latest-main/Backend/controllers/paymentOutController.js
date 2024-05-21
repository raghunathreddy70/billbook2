const express = require("express");
const router = express.Router();
const AddVendor = require("../models/addVendor");
const PaymentOutDetails = require("../models/paymentOut");
const VenTransaction = require("../models/venTransaction");
const VenLedger = require("../models/venLedger");
const AddPurchases = require("../models/addPurchases");
const BankDetails = require("../models/BankDetails");
require("dotenv").config();

router.post("/paymentout", async (req, res) => {
  try {
    const paymentoutData = req.body;

    console.log("paymentoutDatain", paymentoutData);

    const payment = new PaymentOutDetails(paymentoutData);

    const purchase = paymentoutData.purchasesId;

    console.log("purchasedfgthy", purchase)

    const purchaseid = await AddPurchases.findById(purchase);

    console.log("purchaseid", purchaseid)

    purchaseid.balance -= paymentoutData.amount;

    if (purchaseid.balance < 0) {
      purchaseid.balance = 0;
    }

    if (purchaseid.balance > 0) {
      const purchasesDate = new Date(purchaseid.purchasesDate);
      const dueDate = new Date(purchaseid.dueDate);

      if (purchaseid.balance === purchaseid.grandTotal) {
        purchaseid.purchaseStatus = "UNPAID";
      } else if (purchasesDate > dueDate) {
        const overdueDays = Math.floor(
          (purchasesDate - dueDate) / (1000 * 60 * 60 * 24)
        );
        purchaseid.purchaseStatus = "OVERDUE";

        // } else {
        //   purchaseid.purchaseStatus = "PARTIALLY PAID";
      }
    } else {
      purchaseid.purchaseStatus = "PAID";
    }
    await purchaseid.save();

    const vendor = await AddVendor.findById(purchaseid.name);

    vendor.openingBalance -= paymentoutData.amount;

    await vendor.save();

    const updatevendorbalance = vendor.openingBalance;

    // const bank = await BankDetails.findOne({bankId: paymentoutData.bankID});

    // bank.openingBalance += paymentoutData.amount;
    // await bank.save();

    let transactionStatus;
    switch (purchaseid.purchaseStatus) {
      case "PAID":
        transactionStatus = "PAID";
        break;
        // case "PARTIALLY PAID":
        //   transactionStatus = "PARTIALLY PAID";
        // break;
      default:
        transactionStatus = "UNPAID";
    }

    const transactionData = {
      vendorid: vendor.vendorId,
      purchasesDate: paymentoutData.paymentDate,
      // purchaseName: "Payment Out",
      purchaseName: purchaseid.purchaseName,
      purchaseNumber: purchaseid.purchaseNumber,
      grandTotal: purchaseid.grandTotal,
      balance: purchaseid.balance,
      status: purchaseid.purchaseStatus,
      bankID: paymentoutData.bankId,
      paymentAmount: paymentoutData.amount,
    };
    const newTransaction = new VenTransaction(transactionData);
    await newTransaction.save();

    const ledgerData = {
      vendorid: vendor.vendorId,
      purchasesDate: purchaseid.paymentDate,
      purchaseName: "Payment Out",
      purchaseNumber: purchaseid.purchaseNumber,
      credit: paymentoutData.amount,
      vendorBalance: updatevendorbalance,
      paymentMode: paymentoutData.paymentType,
    };

    const newLedgerEntry = new VenLedger(ledgerData);
    await newLedgerEntry.save();

    const savedPayment = await payment.save();

    res.status(201).json(savedPayment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/payment-out", async (req, res) => {
  try {
    const paymentData = req.body;

    console.log("paymentData", paymentData);

    const payment = new PaymentOutDetails(paymentData);

    const purchase = paymentData.purchasesId;

    console.log("purchase", purchase)
    
    for (const purchaseId of paymentData.purchasesId) {
      console.log("purchaseId", purchaseId)
      const purchaseid = await AddPurchases.findById(purchaseId);

      console.log("pur", purchaseid)

      purchaseid.balance -= paymentData.amount;

      if (purchaseid.balance < 0) {
        purchaseid.balance = 0;
      }

      if (purchaseid.balance > 0) {
        const purchasesDate = new Date(purchaseid.purchasesDate);
        const dueDate = new Date(purchaseid.dueDate);

        if (purchaseid.balance === purchaseid.grandTotal) {
          purchaseid.purchaseStatus = "UNPAID";
        } else if (purchasesDate > dueDate) {
          const overdueDays = Math.floor(
            (purchasesDate - dueDate) / (1000 * 60 * 60 * 24)
          );
          purchaseid.purchaseStatus = "OVERDUE";
        }
      } else {
        purchaseid.purchaseStatus = "PAID";
      }
      await purchaseid.save();

      const vendor = await AddVendor.findOne({ vendorId: purchaseid.vendorId });

      vendor.openingBalance -= paymentData.amount;

      await vendor.save();

      payment.name = purchaseid.name;
      await payment.save();
      const updatevendorbalance = vendor.openingBalance;

      let transactionStatus;
      switch (purchaseid.purchaseStatus) {
        case "PAID":
          transactionStatus = "PAID";
          break;
        default:
          transactionStatus = "UNPAID";
      }

      const transactionData = {
        vendorid: vendor.vendorId,
        purchasesDate: paymentData.paymentDate,
        purchaseName: "Payment Out",
        purchaseNumber: purchaseid.purchaseNumber,
        paymentAmount: paymentData.amount,
        bankID: paymentData.bankID,
      };
      const newTransaction = new VenTransaction(transactionData);
      await newTransaction.save();

      const ledgerData = {
        vendorid: vendor.vendorId,
        paymentDate: paymentData.paymentDate,
        purchaseName: "Payment Out",
        purchaseNumber: purchaseid.purchaseNumber,
        credit: paymentData.amount,
        vendorBalance: updatevendorbalance,
        bankId: paymentData.bankID,
        paymentMode: paymentData.paymentType,
      };

      const newLedgerEntry = new VenLedger(ledgerData);
      await newLedgerEntry.save();

      const savedPayment = await payment.save();
    }

    res.status(201).json({ message: "Payments processed successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});




// router.post("/payment-out", async (req, res) => {
//   try {
//     const paymentData = req.body;

//     console.log("paymentData", paymentData);

//     const payment = new PaymentOutDetails(paymentData);

//     const purchase = paymentData.purchasesId;

    
//     const purchaseid = await AddPurchases.findById(purchase);

//     purchaseid.balance -= paymentData.amount;

//     if (purchaseid.balance < 0) {
//       purchaseid.balance = 0;
//     }

//     if (purchaseid.balance > 0) {
//       const purchasesDate = new Date(purchaseid.purchasesDate);
//       const dueDate = new Date(purchaseid.dueDate);

//       if (purchaseid.balance === purchaseid.grandTotal) {
//         purchaseid.purchaseStatus = "UNPAID";
//       } else if (purchasesDate > dueDate) {
//         const overdueDays = Math.floor(
//           (purchasesDate - dueDate) / (1000 * 60 * 60 * 24)
//         );
//         purchaseid.purchaseStatus = "OVERDUE";
//       }
//       //  else {
//       //   purchaseid.purchaseStatus = "PARTIALLY PAID";
//       // }
//     } else {
//       purchaseid.purchaseStatus = "PAID";
//     }
//     await purchaseid.save();

//     const vendor = await AddVendor.findOne({ vendorId: purchaseid.vendorId });

//     // vendor.openingBalance -= paymentData.paymentAmount;
//     vendor.openingBalance -= paymentData.amount;

//     await vendor.save();

//     payment.name = purchaseid.name;
//     await payment.save();
//     const updatevendorbalance = vendor.openingBalance;

//     // const bank = await BankDetails.findOne({bankId: paymentData.bankID});

//     // bank.openingBalance += paymentData.amount;
//     // await bank.save();

//     let transactionStatus;
//     switch (purchaseid.purchaseStatus) {
//       case "PAID":
//         transactionStatus = "PAID";
//         break;
//       // case "PARTIALLY PAID":
//       //   transactionStatus = "PARTIALLY PAID";
//         break;
//       default:
//         transactionStatus = "UNPAID";
//     }

//     const transactionData = {
//       vendorid: vendor.vendorId,
//       purchasesDate: paymentData.paymentDate,
//       purchaseName: "Payment Out",
//       purchaseNumber: purchaseid.purchaseNumber,
//       paymentAmount: paymentData.amount,
//       bankID: paymentData.bankID,
//     };
//     const newTransaction = new VenTransaction(transactionData);
//     await newTransaction.save();

//     const ledgerData = {
//       vendorid: vendor.vendorId,
//       paymentDate: paymentData.paymentDate,
//       purchaseName: "Payment Out",
//       purchaseNumber: purchaseid.purchaseNumber,
//       credit: paymentData.amount,
//       vendorBalance: updatevendorbalance,
//       bankId: paymentData.bankID,
//       paymentMode: paymentData.paymentType,
//     };

//     const newLedgerEntry = new VenLedger(ledgerData);
//     await newLedgerEntry.save();

//     const savedPayment = await payment.save();

//     res.status(201).json(savedPayment);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });


// router.post("/payment-out", async (req, res) => {
//   try {
//     const paymentData = req.body;
//     const selectedInvoices = paymentData.purchasesId;

//     const paymentPromises = selectedInvoices.map(async (invoiceId) => {
//       const payment = new PaymentOutDetails(paymentData);

//       const purchaseid = await AddPurchases.findById(invoiceId);
//       purchaseid.balance -= paymentData.amount;

//       if (purchaseid.balance < 0) {
//         purchaseid.balance = 0;
//       }

//     if (purchaseid.balance > 0) {
//       const purchasesDate = new Date(purchaseid.purchasesDate);
//       const dueDate = new Date(purchaseid.dueDate);

//       if (purchaseid.balance === purchaseid.grandTotal) {
//         purchaseid.purchaseStatus = "UNPAID";
//       } else if (purchasesDate > dueDate) {
//         const overdueDays = Math.floor(
//           (purchasesDate - dueDate) / (1000 * 60 * 60 * 24)
//         );
//         purchaseid.purchaseStatus = "OVERDUE";
//       }
//       //  else {
//       //   purchaseid.purchaseStatus = "PARTIALLY PAID";
//       // }
//     } else {
//       purchaseid.purchaseStatus = "PAID";
//     }

//       await purchaseid.save();

//       const vendor = await AddVendor.findOne({ vendorId: purchaseid.vendorId });
//       vendor.openingBalance -= paymentData.amount;
//       await vendor.save();

//       payment.name = purchaseid.name;
//       await payment.save();

//       const updatevendorbalance = vendor.openingBalance;

//       // Create transaction data and save
//       const transactionData = {
//         vendorid: vendor.vendorId,
//         purchasesDate: paymentData.paymentDate,
//         purchaseName: "Payment Out",
//         purchaseNumber: purchaseid.purchaseNumber,
//         paymentAmount: paymentData.amount,
//         bankID: paymentData.bankID,
//       };
//       const newTransaction = new VenTransaction(transactionData);
//       await newTransaction.save();

//       // Create ledger entry and save
//       const ledgerData = {
//         vendorid: vendor.vendorId,
//         paymentDate: paymentData.paymentDate,
//         purchaseName: "Payment Out",
//         purchaseNumber: purchaseid.purchaseNumber,
//         credit: paymentData.amount,
//         vendorBalance: updatevendorbalance,
//         bankId: paymentData.bankID,
//         paymentMode: paymentData.paymentType,
//       };
//       const newLedgerEntry = new VenLedger(ledgerData);
//       await newLedgerEntry.save();

//       return payment.save();
//     });

//     const savedPayments = await Promise.all(paymentPromises);

//     res.status(201).json(savedPayments);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });


router.get("/paymentout", async (req, res) => {
  try {
    const payments = await PaymentOutDetails.find();
    res.status(200).json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve payments" });
  }
});

router.get("/paymentbyvendorid/:vendorID", async (req, res) => {
  const vendorID = req.params.vendorID;

  try {
    const payments = await PaymentOutDetails.find({ vendorid: vendorID });
    res.status(200).json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve payments" });
  }
});

router.get("/paymentoutforview/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const paymentOut = await PaymentOutDetails.findById(id).populate("name");

    if (!paymentOut) {
      return res.status(404).json({ error: "paymentOut not found" });
    }

    res.status(200).json(paymentOut);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
