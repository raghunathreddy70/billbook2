const mongoose = require("mongoose");

const deletedInvoiceSchema = new mongoose.Schema({
  customerId: {
    type: String,
    required: true,
  },
  invoiceNumber: {
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
  invoiceDate: {
    type: Date,
    // required: true,
  },
  dueDate: {
    type: Date,
    // required: true,
  },
  referenceNo: {
    type: String,
  },
  paymentTerms: Number,
  currency: {
    type: Number,
  },
  website: {
    type: String,
  },
  grandTotal: {
    type: Number,
  },
  totalDiscount: {
    type: Number,
  },
  totalTax: {
    type: Number,
  },
  taxableAmount: {
    type: Number,
  },
  cgstTaxAmount: {
    type: Number,
  },
  sgstTaxAmount: {
    type: Number,
  },
  totalTaxPercentage: {
    type: Number,
  },
  totalDiscountPercentage: {
    type: Number,
  },
  cgstTaxPercentage: {
    type: Number,
  },
  sgstTaxPercentage: {
    type: Number,
  },
  invoiceId: {
    type: String,
  },
  payments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      default: "PaymentDetails",
    },
  ],
  balance: {
    type: Number,
  },
  table: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AddProducts",
      },
      productName: {
        type: String,
      },
      quantity: {
        type: Number,
      },
      unit: {
        type: String,
      },
      price: {
        type: Number,
      },
      discount: {
        type: Number,
        default: 0,
      },
      gstRate: {
        type: Number,
        default: 0,
      },
      totalAmount: {
        type: Number,
      },
      action: {
        type: String,
      },
    },
  ],
  bankDetails: {
    selectBank: {
      bankName: String,
      accountNumber: String,
      branchName: String,
      IFSCCode: String,
    },
    notes: String,
    termsAndConditions: String,
    discountType: String,
    additionalCharges: String,
    signatureName: String,
    signatureImage: {
      url: String,
      public_id: String,
    },
    // grandTotal: Number,
    totalDiscount: Number,
    totalGst: Number,
    taxableAmount: Number,
  },
  invoiceStatus: {
    type: String,
    enum: ["PAID", "UNPAID", "OVERDUE"],
    default: "UNPAID",
  },
  invoiceOID: {
    type: String,
  },
});

module.exports = mongoose.model("DeletedInvoice", deletedInvoiceSchema);
