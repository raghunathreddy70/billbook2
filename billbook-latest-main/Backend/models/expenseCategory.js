const mongoose = require('mongoose');

const expenseCategorySchema = new mongoose.Schema({

  expensecategoryName: String,
});

module.exports = mongoose.model('ExpenseCategory', expenseCategorySchema);
