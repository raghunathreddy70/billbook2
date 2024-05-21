const mongoose = require("mongoose");

const addExpenseSchema = new mongoose.Schema({
  expenseId: {
    type: String,
    // required: true,
  },
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BusinessSchema",
  },
  expenseName: {
    type: String,
  },
  expenseNumber: {
    type: String,
  },
  partyName: {
    type: String,
  },
  originalInvoiceNumber: {
    type: String,
  },
  expenseDate: {
    type: String,
  },
  paymentMode: {
    type: String,
  },
  notes: {
    type: String,
  },
  currentRevenu: {
    type: String
  },
  balance: {
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

  table: [
    {
      exproductId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ExpenseProducts",
      },
      productName: {
        type: String,
      },
      itemName: {
        type: String,
      },
      quantity: {
        type: Number,
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
    // selectBank: [{
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "BankDetails"
    // }],
    uploadReceipt: {
      url: String,
      public_id: String,
    },
    totalDiscount: Number,
    totalGst: Number,
    taxableAmount: Number,
  },
});
module.exports = mongoose.model("AddExpense", addExpenseSchema);
