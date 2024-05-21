const mongoose = require('mongoose');

const addCustomerSchema = new mongoose.Schema({
  customerId: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    // required: true,
    // unique: true,
  },
  phoneNumber: {
    type: String,
    //required: true,
  },
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BusinessSchema",
  },
  name: {
    type: String,
    required: true,
  },
  currency: {
    type: String,
  },
  website: {
    type: String,
  },
  partyType: {
    type: String,
  },
  notes: {
    type: String,
  },
  image: {
    url: String,
    public_id: String,
  },
  openingBalance: {
    type: Number,
    default: 0,
  },

  balanceType: {
    type: Number,
  },
  companyName: {
    type: String,
  },
  GSTNo: {
    type: String,
  },
  PANNumber: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  billingAddress: {
    name: {
      type: String,
    },
    addressLine1: {
      type: String,
    },
    country: {
      type: Object,
    },
    state: {
      type: Object,
    },
    city: {
      type: Object,
    },
    pincode: {
      type: String,
    },
  },
  Invoices: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "AddInvoice",
  }],
  creditNotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "CreditNotes",
  }],
  payments: [{
    type: mongoose.Schema.Types.ObjectId,
    default: "PaymentDetails"
  }],
  shippingAddress: {
    name: {
      type: String,
    },
    addressLine1: {
      type: String,
    },
    country: {
      type: Object,
    },
    state: {
      type: Object,
    },
    city: {
      type: Object,
    },
    pincode: {
      type: Object,
    },
  },
}
);

module.exports = mongoose.model('AddCustomer', addCustomerSchema);
