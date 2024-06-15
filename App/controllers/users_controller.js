const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { password } = require("pg/lib/defaults");
require("dotenv").config();

const userCtlr = {};

userCtlr.registerUser = async (req, res) => {
  try {
    const { body } = req;
    const newUser = await User.create(body)
    const saltvalue = await bcryptjs.genSalt()
    const hashvalue = await bcryptjs.hash(newUser.password, saltvalue)
    newUser.password = hashvalue
    const userData = await newUser.save()
    res.json(userData)
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      res.status(400).json({ error: "Username or email already exists" })
    } else if (error.name === "SequelizeValidationError") {
      res.status(400).json({ error: error.message })
    } else {
      console.error(error)
      res.status(500).json({ error: "Server error" })
    }
  }
};

userCtlr.loginUser = async (req, res) => {
  try {
    const { body } = req
    const userData = await User.findOne({ where: { username: body.username } })
    if (!userData) {
      return res.status(400).json({ error: "Invalid username or password" })
    }

    const isMatch = await bcryptjs.compare(body.password, userData.password)
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid username or password" })
    }
    const tokenData = {
      id: userData.id,
      username: userData.username,
    };
    const jwttoken = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    res.json({
      token: `Bearer ${jwttoken}`,
    });
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
};

userCtlr.getProfile = async (req, res) => {
  try {
    const userDetails = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });
    if (!userDetails) {
      return res.status(404).json({ error: "User not found" })
    }
    res.status(200).json(userDetails)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
};

module.exports = userCtlr
