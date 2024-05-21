const mongoose = require("mongoose");

const addCategorySchema = new mongoose.Schema({
  // categoryId: {
  //   type: String,
  //   unique: true,
  //   required: true
  // },
  categoryName: String,
  slug: String,
  parentCategory: String, 
  image: {
    url: String,
    public_id: String,
  },
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BusinessSchema",
  },
});

module.exports = mongoose.model("AddCategory", addCategorySchema);
