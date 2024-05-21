const mongoose = require("mongoose");

const recentActivitiesSchema = new mongoose.Schema({
  date: {
    type: Date,
  },
  type: {
    type: String,
  },
  partyName: {
    type: String,
  },
  Amount: {
    type: Number,
  },
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BusinessSchema",
  },
});

module.exports = mongoose.model("RecentActivities", recentActivitiesSchema);
