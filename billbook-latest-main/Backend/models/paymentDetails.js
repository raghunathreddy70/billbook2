const mongoose = require("mongoose");

const paymentDetailsSchema = new mongoose.Schema({
  // paymentId: {
  //     type: Number,
  //     unique: true
  //   },
  paymentNumber: {
    type: Number,
  },
  invoiceId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AddInvoice",
    },
  ],
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BusinessSchema",
  },
  // invoiceId: {
  //   type: String,
  // }, 
  isDeleted: {
    type: Boolean,
    default: false
  },
  customerId: {
    type: String,
  },
  customername: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AddCustomer",
  },
  voucherName: {
    type: String,
  },
  customerName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AddCustomer",
  },
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BusinessSchema",
  },
  bankId: {
    type: String,
  },
  // paymentMethod: {
  //   type: String,
  //   enum: ["",'Cash', 'Bank', 'Cheque']
  // },
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

module.exports = mongoose.model("PaymentDetails", paymentDetailsSchema);
