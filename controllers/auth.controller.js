const router = require("express").Router();
const User = require("../models/User");
const Recruiter = require("../models/recruiter");
const Seeker = require("../models/seeker");
const {
  registerValidation,
  loginValidation,
} = require("../functions/validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { json } = require("express");
const user = require("../models/User");
const CV = require("../models/CV")
exports.register = async (req, res, next) => {
  // Validating the data before making the user
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // Checking if the user is already in the database
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) return res.status(400).send("Email already Exists");
  // HASH THE PASSWORD
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  try {
    const user = new User({
      firstname: req.body.firstname,
      lastname : req.body.lastname,
      email: req.body.email,
      password: hashPassword,
      role : req.body.role
    });
    // const userData = req.body;
    // const user = new User(userData);
    const savedUser = await user.save();

    user.id = savedUser.id;
    const userDetails =
      // savedUser.role === "seeker" ? new Seeker(user) : new Recruiter(user);
      savedUser.role === "seeker"
        ? new Seeker({ id: user.id })
        : new Recruiter({ id: user.id });

    const savedUserDetails = await userDetails.save();


    // res.send({ user: user._id });
    res.json({Role : savedUser.role, User:user,userAsRole:savedUserDetails});
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.login = async (req, res, next) => {
  // Validating the data before making the user
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Checking if the email exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email doesnt Exist");

  // Password is correct
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid Password");

  // Create and assigning a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
    // expiresIn: "1h",
  });

  const cvOfSeeker = await CV.findOne({ seeker : user._id });
        // if (!cvOfSeeker){
        //     res.status(400).send("CV Doesn't Exists against this userId") 
        //     return
        // }
        // res.status(200)
  res.json({ msg: "User loggedIn", token: token, user: user ,cv:cvOfSeeker});
};

