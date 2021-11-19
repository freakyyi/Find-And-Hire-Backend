const mongoose = require("mongoose");
const User = require("../models/User");

const Recruiter = require("../models/recruiter");
const Seeker = require("../models/seeker");
const Education = require("../models/education");
const Job = require("../models/Job");
const Schema = mongoose.Schema;

// functions allowed to admin panel
exports.getAll = async (req, res, next) => {
  try {
    const recruiter = await Recruiter.find().exec();
    const seeker = await Seeker.find().exec();
    const user = await User.find().exec()
    
    res.json({userWithoutRole:user });
    res.status(200);
  } catch (error) {
    res.send(error);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      res.status(401).send(err);
    }
    let userWithoutRole = await User.findById({ _id: req.params.userId }).exec();
    const userId = req.params.userId;

    let userAccount = await User.findById(userId).exec();
    if (!userAccount) {
      res.status(404);
      res.send("No Account Found");
    }
    const role = userAccount.role;
    const user = role === "seeker" ? Seeker : Recruiter;
    let userDetails = await user.find({ id: userId }).exec();

    const userDetailsMainId = userDetails[0]._id;
    const getOrignalUserDetails = await user
      .findById({ _id: userDetailsMainId })
      .exec();

    res.status(200);
    res.json({
      roleDetails: userWithoutRole,
      roleDetailsSpecified : getOrignalUserDetails
      
    });
  } catch (error) {
    res.send(error);
  }
};

// now user chills
// the id is in the seeker / recruiter document. as "id" not "_id"
exports.updateProfile = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      res.status(401).send("Not a valid Id");
      return;
    }
    const userId = req.params.userId;

    let userAccount = await User.findById(userId).exec();
    if (!userAccount) {
      res.status(404);
      res.send("No Account Found");
    }
    const role = userAccount.role;
    const user = role === "seeker" ? Seeker : Recruiter;
    let userDetails = await user.find({ id: userId }).exec();

    const userDetailsMainId = userDetails[0]._id;
        // for seeker or recruiter  database 

    const getOrignalUserDetails = await user
      .findById({ _id: userDetailsMainId })
      .exec();

    for (const key in req.body) {
      if (
        user.schema.obj.hasOwnProperty(key) &&
        key !== "id" &&
        key !== "_id"
      ) {
        getOrignalUserDetails[key] = req.body[key];
      }
    }
    const updatedUserDetails = await getOrignalUserDetails.save();

    
    if (updatedUserDetails) {
      res.status(200)
      res.json({
        updatedAsRole :  updatedUserDetails,
      })
    } else {
      res.status(404);
      res.send("user with id : ${userId} not updated");
    }
  } catch (error) {
    console.log("ERROR = " + error);
    res.status(404).send("Error Occoured");
  }
};

exports.updateUserProfile = async(req,res,next) => {
  console.log('body',req.body)
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      res.status(404);
      res.send(`Invalid userId`);
    }


    const userId = req.params.userId;

    let userAccount = await User.findById(userId).exec();
    if (!userAccount) {
      res.status(404);
      res.send("No Account Found");
    }

    // for main USER database 
    for (const key in req.body) {
      if (
        User.schema.obj.hasOwnProperty(key) &&
        key !== "id" &&
        key !== "_id"
      ) {
        userAccount[key] = req.body[key];
      }
    }
    const updatedUserAccount = await userAccount.save()
    if (updatedUserAccount) {
      res.status(200)
      res.json({
        updatedAsUser :  updatedUserAccount,
      })
    } else {
      res.status(404);
      res.send("user with id : ${userId} not updated");
    }
    
  } catch (error) {
    console.log("ERROR = " + error);
    res.status(404).send("Error Occoured");
  }
}
 
exports.deleteOne = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      res.status(404);
      res.send(`Invalid userId`);
    }
    const userId = req.params.userId;
    const response = { payLoad: {}, message: "" };
    const userAccount = await User.findById(userId).exec();
    if (!userAccount) {
      res.status(404);
      res.send(`No user associated with id: ${userId}`);
      return;
    }
    const role = userAccount.role;
    let user = role === "seeker" ? Seeker : Recruiter;
    const deleteAccount = await User.findByIdAndDelete(userId).exec();
    const deleteResult = await user.findOneAndDelete({ id: userId }).exec();
    if ((user = role === "recruiter")) {
      
      Job.deleteMany({ recruiter: userId}, function(err) {})

    }

    if (deleteAccount && deleteResult) {
      response.message = "SUCCESS";
      res.status(200);
      res.send(response);
      return;
    } else {
      res.status(404);
      res.send(`User with id: ${userId} not deleted`);
      return;
    }
  } catch (error) {
    res.send(error);
  }
};
