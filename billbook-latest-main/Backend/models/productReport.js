const mongoose = require("mongoose");

const productReportSchema = new mongoose.Schema({
  productId: {
    type: String,
  },
  customerId: {
    type: String
  },
  invoiceName: {
    type: String,
  },
  invoiceDate: {
    type: Date,
  },
  quantity: {
    type: String,
  },
  invoiceNumber: {
    type: String,
  },
  closingStock: {
    type: String,
  },
  salesamount: {
    type: String,
  },
  purchaseAmount: {
    type: String,
  },
  itemName: {
    type: String,
  },
  itemCode: {
    type: String
  },
  purAmount: {
    type: String
  },
  salesAmount: {
    type: String
  }
});

module.exports = mongoose.model("ProductReport", productReportSchema);
