const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  businessName: {
    type: String,
  },
  role: {
    type: String,
    enum: ["superAdmin","admin", "salesman", "delivery", "stock", "partner", "accountant"],
    default: "admin",
  },
  businessType: {
    type: String,
  },
  industryType:{
    type: String,
  },
  registrationType:{
    type: String,
  },
  gstNumber:{
    type: String,
  },
  password:{
    type: String,
  
  },
  otp:{
    type:String,
  },
 hasAdmin:{
  type:String,
 },
 status:{
  type:String,
  enum:["Active","Inactive","Deleted"],
 },
 template:{
  type:Number,
  default:1
 }
})

mongoose.models = {};
module.exports = mongoose.model("UserSchema", UserSchema);
