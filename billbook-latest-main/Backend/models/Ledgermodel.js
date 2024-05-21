const mongoose = require("mongoose");

const ledgerSchema = new mongoose.Schema({
  customerid: {
    type: String,
  },
  invoiceId: {
    type: String
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
  credit: {
    type: Number,
  },
  debit: {
    type: Number,
  },
  customerBalance: {
    type: Number,
  },
  paymentMode: {
    type: String,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("LedgerModel", ledgerSchema);
