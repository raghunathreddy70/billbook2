const mongoose = require("mongoose");

const invoiceTemplateSchema = new mongoose.Schema({
  template: {
    type: Number,
    default: 0
  },
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BusinessSchema",
  }
  
});


module.exports = mongoose.model("InvoiceTemplates", invoiceTemplateSchema);
