const mongoose = require("mongoose");

const partywiseVendorReportSchema = new mongoose.Schema({
  vendorId: {
    type: String,
  },
  products: [
    {
      productId: {
        type: String,
      },
      itemName: {
        type: String,
      },
      itemCode: {
        type: String,
      },
      purAmount: {
        type: Number,
      },
      quantity: {
        type: Number,
      },
    },
  ],
});

module.exports = mongoose.model("PartywiseVendorReport", partywiseVendorReportSchema);
