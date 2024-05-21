const express = require('express');
const router = express.Router();
const businessHandler = require('../controllers/businessHandler');
const userRegistrationHandler = require('../controllers/userRegistrationHandler');
const userController = require("../controllers/userController")


router.post('/fetch-my-business',businessHandler.FetchUsersByContact)

router.post('/registration-verify', userRegistrationHandler.registerVerification)


router.post('/create-user', userController.userCreate)

router.get('/fetch-business-users/:aid', userController.fetchUser)
router.put('/edit-business-user/:id', userController.userUpdate)



module.exports = router;