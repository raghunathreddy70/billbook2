const mongoose = require('mongoose');

const expenseProductsSchema = new mongoose.Schema({
  exproductId: {
    type: String,
    unique: true,
    required: true
  },
  itemTypeproduct: {
    type: String,
  },
  purchasePrice: {
    type: String,
  },
  itemName: {
    type: String,
  },
  gstTaxRate: {
    type: String,
  },
  measuringUnit: {
    type: String,
  },
  HSNcode: {
    type: String,
  },
  ITCApplicable: {
    type: String
  }
  
});  

module.exports = mongoose.model('ExpenseProducts', expenseProductsSchema);
