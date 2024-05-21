const mongoose = require("mongoose");

const addInvoiceSchema = new mongoose.Schema({
  customerId: {
    type: String,
    required: true,
  },
  invoiceName: {
    type: String,
    // required: true,
  },
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BusinessSchema",
  },
  paymentType: String,
  invoiceId: {
    type: String,
    unique: true,
    index: true,
    required: true
  },
  bankId: {
    type: String,
  },
  invoiceNumber: {
    type: String,
  },
  customerName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AddCustomer",
    index: true,
  },
  customername: {
    type: String
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
  balance: {
    type: Number,
  },
  custPANNumber: {
    type: String
  },
  bussPANNumber: {
    type: String
  },
  invoiceStatus: {
    type: String,
    enum: ['PAID', 'UNPAID','OVERDUE'],
    default: 'UNPAID',
  },
  isEdit: {
    type: Boolean
  },

  table: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AddProducts",
      },
      pid: {
        type: String,
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
      godownId:{
        type: String,
      }
    },
  ],
  bankDetails: {
    selectBank: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "BankDetails",
      required: false
    }],
    notes: String,
    termsAndConditions: String,
    discountType: String,
    additionalCharges: String,
    signatureName: String,
    signatureImage: {
      url: String,
      public_id: String,
    },
    totalDiscount: Number,
    totalGst: Number,
    taxableAmount: Number,
  },
});

module.exports = mongoose.model("AddInvoice", addInvoiceSchema);