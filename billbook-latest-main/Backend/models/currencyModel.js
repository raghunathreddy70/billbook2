const mongoose = require('mongoose');

const addCurrencySchema = new mongoose.Schema({
    cityName: {
        type: String,
        require: true
    },
    currency: {
        type: String,
        require: true,
    },
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BusinessSchema",
      },
    currencyValue: {
        type: Number,
        require: true,
    }
});

module.exports = mongoose.model('Currency', addCurrencySchema);
