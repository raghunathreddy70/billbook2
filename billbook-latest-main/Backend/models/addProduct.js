const mongoose = require("mongoose");

const addProductsSchema = new mongoose.Schema({
  productId: {
    type: String,
    unique: true,
    required: true,
  },
  taxType:{
    type: String,
  },
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BusinessSchema",
  },
  taxpurchaseType: {
    type: String
  },
  Godown: [
    {
      godownId: {
        type: String,
      },
      godownName: {
        type: String,
      },
      godownStreetAddress: {
        type: String,
      },
      godownCity: {
        type: String,
      },
      stock: {
        type: Number,
      },
    },
  ],
  itemType: {
    type: String,
  },
  itemName: {
    type: String,
  
    // required: true,
  },
  itemCategory: {
    type: String,
  },
  category:{
    type:String
  },
  salesPrice: {
    type: String,
  },
  gstTaxRate: {
    type: String,
  },
  measuringUnit: {
    type: String,
  },
  MRP: {
    type: String,
  },
  itemCode: {
    type: String,
  },
  HSNcode: {
    type: String,
  },
  godown: {
    type: String,
  },
  openingStock: {
    type: Number,
  },
  lowStockQuantity: {
    type: Number,
  },
  addingDate: {
    type: Date,
  },
  productDescription: {
    type: String,
  },
  purchasePrice: {
    type: String,
  },
  serviceName: {
    type: String,
  },
  serviceCode: {
    type: String,
  },
  productImage: {
    url: String,
    public_id: String,
  },
  salesProduct: {
    type: Number,
    default: 0,
  },
  purchaseProduct: {
    type: Number,
    default: 0,
  },
  stockValue: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("AddProducts", addProductsSchema);
