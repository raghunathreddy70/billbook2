const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema({
    unitName: {
        type: String,
        required: true,
    },
    shortName: {
        type: String,
        required: true,
    },
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BusinessSchema",
      },
});

module.exports = mongoose.model('UnitModel', unitSchema);
