const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController"); 
router.post("/add", userController.signUp);
router.get("/logIn", userController.loginUser);
router.put("/update/:id", userController.updateUser); 
router.get("/admin/:userId",userController.checkAdmin)
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);
module.exports = router;
