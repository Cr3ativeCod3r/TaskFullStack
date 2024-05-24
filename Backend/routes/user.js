const express = require("express");

const {
    register,
    login,
} = require("../controllers/user");

const {authUser} = require("../middlwares/auth");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);


module.exports = router;
