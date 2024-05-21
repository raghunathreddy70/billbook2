const mongoose = require('mongoose');

const VenledgerSchema = new mongoose.Schema({
    vendorid: {
        type: String,
    },
    bankId: {
        type: String,
    },
    purchasesDate: {
        type: Date,
    },
    purchaseName: {
        type: String,  
    },
    purchaseNumber: {
        type: String,    
    },
    credit: {
        type: Number,
    },
    debit: {
        type: Number, 
    },
    vendorBalance: {
        type: Number,  
    },
    paymentMode: {
        type: String,
    },

});

module.exports = mongoose.model('VenLedgerModel', VenledgerSchema);
