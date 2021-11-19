const mongoose = require("mongoose");
const Job = require("../models/Job");
const CV = require("../models/CV");
const User = require("../models/User");
const Application = require("../models/application");

exports.createApplication = async (req, res, next) => {
  try {
    //checking if the user is not recruiter that is applying to the job and getting user id
    const user = await User.findById(req.user._id).exec();
    if (user.role === "recruiter") {
      res.status(401).send("Unauthorized Access");
      return;
    }
    // getting job id
    const job = await Job.findById(req.params.jobId).exec();
    // getting recruiter id
    const recruiter = job.recruiter;
    //getting seekerId
    const sId = req.user._id;
    // getting CV
    const cv = await CV.findOne(req.seeker).exec();
    // getting cvId
    const cvId = cv._id;

    // check if seeker has applied to it before or not
    // const seekerId = await Application.findOne({ seekerId: user._id });
    // if (seekerId)
    //   return res
    //     .status(400)
    //     .send("Application already sent, Please wait for the result");

    const application = new Application({
      jobId: job._id,
      seekerId: sId,
      recruiterId: recruiter._id,
      cvId: cvId,
      status: req.body.status,
    });

    const savedApplication = await application.save();
    if (!savedApplication) {
      res.status(404).send("Application Not created");
      return;
    }
    res.status(200);
    res.send(savedApplication);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

exports.getApplications = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).exec();
    if (user.role === "seeker") {
      res.status(401).send("Unauthorized Access");
      return;
    }
    // const job = await Application.find({jobId}).exec();
    // console.log("Jaab" , job)

    const findApplicationsForThatJob = await Application.find(
      {
        jobId: { $in: [
          mongoose.Types.ObjectId(req.params.jobId) 
        ] },
      }
    ).exec();
    res.status(200);
    res.send(findApplicationsForThatJob);
  } catch (error) {
    res.send(error);
    return
  }
};


// show applied jobs :

exports.fetchApplied = async (req, res, next) => { 
  try {
    const response = {payLoad: []}

    const user = await User.findById(req.user._id).exec();
    if (user.role !== "seeker") {
      res.status(401).send("Unauthorized Access");
      return;
    }
    
    const findAppliedJobs = await Application.find(
      {
        seekerId: { $in: [
          mongoose.Types.ObjectId(req.user._id) 
        ] },
      }
    ).exec();


    for (let index = 0; index < findAppliedJobs.length; index++) {
      const status = findAppliedJobs[index].status
      const element = findAppliedJobs[index]
      const job = await Job.findById(element.jobId).exec()
      response.payLoad.push(job)
      response.payLoad.push(status)
    }
    res.status(200)
    res.json({"Your Applied Jobs and their status ":response})
  }
    catch (error) {
      res.send(error);
      return
    }
 
}
