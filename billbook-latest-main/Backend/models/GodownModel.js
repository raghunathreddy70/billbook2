const mongoose = require("mongoose");

const GodownSchema = new mongoose.Schema({
  godownId: {
    type: String,
    unique: true,
    required: true,
  },
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BusinessSchema",
  },
  Products: [
    {
      category: {
        type: String,
      },
      productId: {
        type: String,
      },
      taxType: {
        type: String,
      },
      itemName: {
        type: String,
      },
      itemCode: {
        type: String,
      },
      openingStock: {
        type: Number,
      },
      salesPrice: {
        type: String,
      },
      purchasePrice: {
        type: String,
      },
      stockValue: {
        type: String,
      },
      taxType: {
        type: String,
      },
      gstTaxRate: {
        type: String,
      },
    },
  ],
  productId: {
    type: String,
  },
  date: {
    type: Date,
  },
  godownName: {
    type: String,
  },
  godownStreetAddress: {
    type: String,
  },
  placeofsupply: {
    type: String,
  },
  godownPincode: {
    type: String,
  },
  godownCity: {
    type: String,
  },
});

module.exports = mongoose.model("Godown", GodownSchema);
