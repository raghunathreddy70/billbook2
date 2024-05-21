const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const mongoose = require("./config/db");
const randomstring = require("randomstring");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");

const customerController = require("./controllers/customerController");
const vendorController = require("./controllers/vendorController");
const ledgerController = require("./controllers/ledgerController");
const invoiceController = require("./controllers/invoiceController");
const productController = require("./controllers/productController");
const quotationController = require("./controllers/quotationController");
const purchasesController = require("./controllers/purchasesController");
const logout = require("./controllers/logout");
const categoryController = require("./controllers/categoryController");
const gstController = require("./controllers/gstController");
const paymentController = require("./controllers/paymentController");
const currencyController = require("./controllers/currencyController");
const bankAccountController = require("./controllers/bankAccountController");
const creditNotesController = require("./controllers/creditNotesController");
const deliveryChallengeController = require("./controllers/deliveryChallenController");
const convertToInvoiceController = require("./controllers/convertToInvoice");
const profileController = require("./controllers/profileController");
const GodownController = require("./controllers/godownController");
const unitController = require("./controllers/unitController");
const performaController = require("./controllers/proformaController");
const paymentOutController = require("./controllers/paymentOutController");
const purchaseReturnController = require("./controllers/purchaseReturnController");
const purchaseOrdersController = require("./controllers/purchaseOrdersController");

const debitNotesController = require("./controllers/debitNotesController");
const countryController = require("./controllers/countryController");
const stateController = require("./controllers/stateController");
const cityController = require("./controllers/cityController");

const expenseCategoryController = require("./controllers/expenseCategoryController");
const expenseProduductController = require("./controllers/expenseProductsController");
const expenseController = require("./controllers/expenseController");
const partyController = require("./controllers/partyController");
const businessController = require("./controllers/businessController");
const salesReturnController = require("./controllers/salesReturnController");
const templateController = require("./controllers/templateController");
const Business = require("./models/businessModel")
const jwt = require("jsonwebtoken")

const util = require("util");
require("dotenv").config();
const cors = require("cors");

const app = express();
const port = process.env.PORT || 8000;

const otpStorage = {};

const readFileAsync = util.promisify(fs.readFile);

function generateOTP() {
  return randomstring.generate({
    length: 6,
    charset: "numeric",
  });
}

app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ extended: true, limit: "500mb" }));

const allowedOrigins = [
  "http://localhost:3002",
  "http://localhost:3000",
  "http://localhost:3001",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Send OTP via email
async function sendOTP(email, otp) {
  const htmlTemplate = await readFileAsync(
    "./utils/emailTemplate.html",
    "utf8"
  );
  const instaImgData = fs.readFileSync(
    "./utils/imgs/email-template-icon-instagram.png",
    "base64"
  );
  const facebookImgData = fs.readFileSync(
    "./utils/imgs/email-template-icon-facebook.png",
    "base64"
  );
  const twitterImgData = fs.readFileSync(
    "./utils/imgs/email-template-icon-twitter.png",
    "base64"
  );
  const youtubeImgData = fs.readFileSync(
    "./utils/imgs/email-template-icon-youtube.png",
    "base64"
  );
  const logoHirola = fs.readFileSync(
    "./utils/imgs/Hirolalogoblack.png",
    "base64"
  );

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "chandinihirola@gmail.com",
      pass: "cpmcvhrrsphmkufm",
    },
  });

  let info = await transporter.sendMail({
    from: '"Your Name" chandinihirola@gmail.com',
    to: email,
    subject: "Login OTP",
    html: htmlTemplate
      .replace("{{otp}}", otp)
      .replace("{{instaImg}}", `data:image/png;base64,${instaImgData}`)
      .replace(
        "{{facebookImgData}}",
        `data:image/png;base64,${facebookImgData}`
      )
      .replace("{{twitterImgData}}", `data:image/png;base64,${twitterImgData}`)
      .replace("{{youtubeImgData}}", `data:image/png;base64,${youtubeImgData}`)
      .replace("{{logoHirola}}", `data:image/png;base64,${logoHirola}`),
  });

  console.log("Message sent: %s", info.messageId);
}

let setOtpTime;
// Request OTP
app.post("/requestOTP", async (req, res) => {
  const { phone } = req.body;

  try{
    const user = await Business.findOne({phone, status: "Active"})
    console.log("user",user);
    if (!user) {
      return res.status(404).send("User not found");
    }

    let email;
    if(user){
       email =  user?.email
    }

    if (!email) {
      return res.status(400).send("User email not found");
    }
    const otp = generateOTP();
    sendOTP(email, otp)
    .then(async () => {
      await Business.updateOne({ phone: phone }, { OTP: otp });
      const OTPExpiryTime = Date.now() +(6 * 60 * 1000);
      // (6 * 60 * 1000)
      
      setOtpTime = setInterval(async() => {
        await Business.updateOne({ phone }, { OTP: "" });
      },  OTPExpiryTime - Date.now());

      setTimeout(() => {
        clearInterval(setOtpTime)
      }, OTPExpiryTime - Date.now() );
      res.status(200).send(email);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Failed to send OTP");
    });

  }catch(e){
    console.log("Error : ",e.message)
  }


});

// Verify OTP
app.post("/verifyOTP", async (req, res) => {
  const { phone, otp } = req.body
  console.log("object",phone);
  console.log("otp",otp);


  try {
    const user = await Business.findOne({ phone, status: "Active" });

  
    if((user.OTP && otp) && otp === user.OTP ){
      const token = jwt.sign({data:user},process.env.JWT_SECRET,{ expiresIn: '24h' })
  
      clearInterval(setOtpTime)
      
      res.status(200).json({ token , currentBusiness: user._id});
      await Business.updateOne({ phone }, { OTP: '' });
    }
  } catch (error) {
     res.status(400).send("Invalid OTP:",error);
  }

});

app.use("/api/business", businessController);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/superAdmin", logout);
app.use("/api/addCustomer", customerController);
app.use("/api/addVendor", vendorController);
app.use("/api/addLedger", ledgerController);
app.use("/api/addInvoice", invoiceController);
app.use("/api/addProduct", productController);
app.use("/api/addQuotation", quotationController);
app.use("/api/addPurchases", purchasesController);
app.use("/api/addCategory", categoryController);
app.use("/api/addgst", gstController);
app.use("/api/paymentDetails", paymentController);
app.use("/api/AddCurrency", currencyController);
app.use("/api/BankDeatils", bankAccountController);
app.use("/api/creditNotes", creditNotesController);
app.use("/api/delChallen", deliveryChallengeController);
app.use("/converttoinvoice", convertToInvoiceController);
app.use("/api/godown", GodownController);
app.use("/api/Unit", unitController);
app.use("/api/performa", performaController);
app.use("/api/paymentOutDetails", paymentOutController);
app.use("/api/purchaseReturn", purchaseReturnController);
app.use("/api/purchaseorder", purchaseOrdersController);
app.use("/api/debitNotes", debitNotesController);
app.use("/api/Unit", unitController);
app.use("/api/profile", profileController);
app.use("/api/countries", countryController);
app.use("/api/states", stateController);
app.use("/api/cities", cityController);
app.use("/api/ExpenseCat", expenseCategoryController);
app.use("/api/exproduct", expenseProduductController);
app.use("/api/Expense", expenseController);
app.use("/api/Parties", partyController);
app.use("/api/SalesReturn", salesReturnController);
app.use("/api/templates", templateController);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
