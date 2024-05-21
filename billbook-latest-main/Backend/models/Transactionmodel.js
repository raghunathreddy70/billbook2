const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  productid: {
    type: String,
  },
  customerid: {
    type: String,
  },
  invoiceId: {
    type: String,
  },
  customerName: {
    type: String,
  },
  voucherName: {
    type: String,
  },
  bankID: {
    type: String,
  },
  invoiceDate: {
    type: Date,
  },
  invoiceName: {
    type: String,
  },
  invoiceNumber: {
    type: String,
  },
  grandTotal: {
    type: Number,
  },
  balance: {
    type: Number,
  },
  paymentAmount: {
    type: Number,
  },
  status: {
    type: String,
    enum: ["PAID",  "UNPAID"],
    default: "UNPAID",
  },
  isDeleted: {
    type: Boolean,
    default: false,
  }
});

module.exports = mongoose.model("TransactionModel", transactionSchema);
