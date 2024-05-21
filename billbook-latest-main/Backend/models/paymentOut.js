const mongoose = require("mongoose");

const paymentOutDetailsSchema = new mongoose.Schema({
  // paymentId: {
  //     type: Number,
  //     unique: true
  //   },
  paymentOutNumber: {
    type: Number,
  },
  purchasesId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AddPurchases",
  },
  vendorId: {
    type: String,
  },
  // name: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "AddVendor",
  // },
  vendorname: {
    type: String
  },
  name: {
    type: String,
  },
  voucherName: {
    type: String,
  },
  bankId: {
    type: String,
  },
  paymentAmount: Number,
  paymentDate: { type: Date, default: Date.now },
  paymentType: String,
  notes: String,
  paymentStatus: {
    type: String,
    default: "Unpaid",
  },
  paymentBalance: Number,
  amount: Number,
  // balance: Number,
});

module.exports = mongoose.model("PaymentOutDetails", paymentOutDetailsSchema);
