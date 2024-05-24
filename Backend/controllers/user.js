const {
    validateEmail,
    validateLength,
} = require("../helpers/validation");

const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {generateToken} = require("../helpers/tokens");
const mongoose = require("mongoose");

exports.register = async (req, res) => {
    try {
        const {
            email,
            password,
            name,
            lastname,
            nick,
            continent
        } = req.body;

        if (!validateEmail(email)) {
            return res.status(400).json({message: "Wrong e-mail"});
        }
        const check = await User.findOne({email});
        if (check) {
            return res.status(400).json({message: "Email taken"});
        }

        if (!validateLength(name, 3, 30)) {
            return res.status(400).json({message: "Name beetwen 3-30 characters"});
        }
        if (!validateLength(password, 6, 40)) {
            return res.status(400).json({message: "Password must have at least 6 characters"});
        }

        const cryptedPassword = await bcrypt.hash(password, 12);

        const user = await new User({
            email: email,
            password: cryptedPassword,
            first_name: name,
            last_name: lastname,
            username: nick,
            continent: continent
        }).save();

        res.status(400).json({message: "Your account has been made, please login"});


    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({
                message:
                    "the email address you entered is not connected to an account.",
            });
        }
        const check = await bcrypt.compare(password, user.password);
        if (!check) {
            return res.status(400).json({
                message: "Invalid credentials.Please try again.",
            });
        }
        const token = generateToken({id: user._id.toString(), userTyp: user.usertyp}, "1m");
        res.cookie('token', token, {path: '/', httpOnly: true});
        
        res.send({
            id: user._id,
            username: user.username,
            picture: user.picture,
            first_name: user.first_name,
            last_name: user.last_name,
            token: token,
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.findUser = async (req, res) => {
    try {
        const {email} = req.body;
        const user = await User.findOne({email}).select("-password");
        if (!user) {
            return res.status(400).json({
                message: "Account does not exists.",
            });
        }
        return res.status(200).json({
            email: user.email,
            picture: user.picture,
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

