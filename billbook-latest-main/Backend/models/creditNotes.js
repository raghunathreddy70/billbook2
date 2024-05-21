const mongoose = require("mongoose");

const creditNotesSchema = new mongoose.Schema({

  customerId: {
    type: String,
    required: true,
  },
  invoiceName: {
    type: String,
    required: true,
  },
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BusinessSchema",
  },
  creditnotesId: {
    type: String,
    unique: true,
    required: true
  },
  creditnotesNumber: {
    type: String,
  },
  bankId: {
    type: String,
  },
  customerName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AddCustomer",
  },
  creditnotesDate: {
    type: Date,
    // required: true,
  },
  invoiceStatus: {
    type: String,
    enum: ['PAID', 'UNPAID','OVERDUE'],
    default: 'UNPAID',
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
    type: Number
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
  payments: [{
    type: mongoose.Schema.Types.ObjectId,
    default: "PaymentDetails"
  }],
  balance: {
    type: Number,
  },
  custPANNumber: {
    type: String
  },
  bussPANNumber: {
    type: String
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
    
    selectBank: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "BankDetails"
    }],
    // selectBank: {
      // bankName: String,
      // accountNumber: String,
      // branchName: String,
      // IFSCCode: String,
      
    // },
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
});

module.exports = mongoose.model("CreditNotes", creditNotesSchema);









