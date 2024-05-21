const mongoose = require("mongoose");

const businessTransactionSchema = new mongoose.Schema({

 businessId: {
    type: String,
  },
  purchasesDate: {
    type: Date,
  },
  purchaseName: {
    type: String,
  },
  purchaseNumber: {
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
    enum: ["PAID", "UNPAID"],
    default: "UNPAID",
  },
});

module.exports = mongoose.model("BusinessTransactions", businessTransactionSchema);
