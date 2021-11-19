const router = require("express").Router();
const authController = require('../controllers/auth.controller')
const { json } = require("express");


router.post("/register",authController.register)
router.post("/login", authController.login)

module.exports = router;
