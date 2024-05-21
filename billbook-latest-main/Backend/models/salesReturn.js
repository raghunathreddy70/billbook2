const mongoose = require("mongoose");

const salesReturnSchema = new mongoose.Schema({
customerId: {
    type: String,
    required: true,
  },
  salesReturnName: {
    type: String,
    required: true,
  },
  salesReturnId: {
    type: String,
    unique: true,
    required: true
  },
  salesReturnNumber: {
    type: String,
  },
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BusinessSchema",
  },
  customerName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AddCustomer",
  },
  salesReturnDate: {
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
    default: "PaymentOutDetails"
  }],
  balance: {
    type: Number,
  },
  purchaseStatus: {
    type: String,
    enum: ['PAID', 'UNPAID', 'PARTIALLY PAID', 'OVERDUE'],
    default: 'UNPAID',
  },
  custPANNumber: {
    type: String
  },
  bussPANNumber: {
    type: String
  },
  bankId: {
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
    uploadReceipt: {
      url: String,
      public_id: String,
    },
    // grandTotal: Number,
    totalDiscount: Number,
    totalGst: Number,
    taxableAmount: Number,
  },
});

module.exports = mongoose.model("salesReturn", salesReturnSchema);









