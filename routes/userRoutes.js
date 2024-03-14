const express = require('express')
const { userRegisterController, userLoginController, resetPasswordController, checkUserController, userUpdateController } = require('../controllers/userControllers')
const requireSignin = require('../middlewares/middleware')

// ROUTE OBJECT
const router = express.Router()

// ROUTES
// register
router.post('/register', userRegisterController)

// login
router.post('/login', userLoginController)

// check the user to reset password
router.post('/check-user', checkUserController)

// reset password
router.post('/reset-password', resetPasswordController)

// update user
router.put('/update-user',requireSignin, userUpdateController)
// EXPORT
module.exports = router