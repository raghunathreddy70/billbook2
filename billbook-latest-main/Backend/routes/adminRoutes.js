const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");
const adminLogin = require("../controllers/adminLogin");
const register = require("../controllers/register");
const User = require("../models/UserModel");
//const customerController = require('../controllers/customerController');
const updateUser = require("../controllers/userupdation");
const updateAdmin = require("../controllers/adminUpdate");
const deleteUser = require("../controllers/userDeletion");
const { totalSalesPerMonth, totalBalancePerMonth, productCount, customerCount1 ,getMonthlySales, getTotalRevenue, invoiceCount, getSalesByDateRange, invoiceCount1, getInvoiceCountByRange} = require("../controllers/dashboard");
//const {manageBusiness,deleteBusiness, updateBusiness, business, uploadImage} = require("../controllers/manageBusiness");
//const { vendorCount, customerCount, getTotalRevenue, purchaseCount,  totalSalesPerMonth, totalBalancePerMonth } = require("../controllers/dashboard");
const {manageBusiness,deleteBusiness, updateBusiness, businessCreate, uploadImage} = require("../controllers/manageBusiness");
const rolePermission = require("../controllers/rolePermission");
//const customerCount = require("../controllers/dashboard");
// const { customerCount,  } = require("../controllers/dashboard");

router.use(express.json());
router.use(cookieParser());
router.use(
  express.urlencoded({
    extended: true,
  })
);

// Admin routes
router.post("/register", register);
router.post('')
// router.post('/create-business-user')
// router.post('/updateRole', updateRole)
//router.get("/customerCount", customerCount);
router.get("/customerCount1", customerCount1)
router.get('/getSalesByDateRange',getSalesByDateRange)
router.get("/getMonthlySales", getMonthlySales)

router.get('/getTotalRevenue',getTotalRevenue)
router.get('/productCount',productCount)
router.get('/invoiceCount',invoiceCount)
router.get('/getInvoiceCountByRange',getInvoiceCountByRange)
router.post("/updateUser", updateUser);
//router.post('/sales',sales)
router.post("/login", adminLogin);
router.post("/updateAdmin", updateAdmin);
router.post("/deleteUser", deleteUser);
router.get("/totalSalesPerMonth",totalSalesPerMonth)
//router.get("/purchaseCount",purchaseCount)
//router.get("/totalBalancePerMonth",totalBalancePerMonth)
//router.get('/manageBusiness',manageBusiness)
router.post('/manageBusiness',manageBusiness)
router.delete('/deleteBusiness',deleteBusiness)
router.put("/updateBusiness/:id",updateBusiness)
router.post("/businessCreate",businessCreate)
router.post("/uploadImage",uploadImage)
//router.post('/Customer', customerController);



router.post("/create-user-role/:bid", rolePermission.createUserRole)
router.post("/update-user-role/:bid", rolePermission.updateUserRole)
router.post("/update-role-permission/:bid", rolePermission.updateRolePermission)



module.exports = router;
