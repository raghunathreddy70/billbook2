const mongoose = require("mongoose");

const partywiseReportSchema = new mongoose.Schema({
  customerId: {
    type: String
  },
  products: [{
    productId: {
      type: String,
    },
    closingStock: {
      type: Number,
    },
    itemName: {
      type: String,
    },
    itemCode: {
      type: String
    },
    salesAmount: {
      type: Number
    },
    quantity: {
        type: Number,
    },
  }]
  
});

module.exports = mongoose.model("PartywiseReport", partywiseReportSchema);
