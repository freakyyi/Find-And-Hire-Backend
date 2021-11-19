const mongoose = require("mongoose");
const Job = require("../models/Job");
const Recruiter = require("../models/recruiter");
const Seeker = require("../models/seeker");
const User = require("../models/User");

// getting all jobs by everyone [ for admin user ]
exports.get = async (req, res, next) => {
  try {
    const jobs = await Job.find().exec();
    res.status(200);
    res.send(jobs);
  } catch (error) {
    res.send(error);
  }
};

// posting jobs by a recruiter
exports.post = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).exec();
    if (user.role !== "recruiter") {
      res.status(401).send("Unauthorized Access");
      return;
    }
    // const recruiterId = await Job.findOne({ recruiter: user._id });
    // if (recruiterId > 3) return res.status(403).send("You cant post more than 3 jobs in basic package");
    
    // const jobRestrict = await Job.find(
    //   {
    //     recruiter: { $in: [
    //       mongoose.Types.ObjectId(req.user._id) 
    //     ] },
    //   }
    // ).exec();
   

    // if(jobRestrict.recruiter > 5 ){
    //   console.log("you cant post more than 5 times ")
    //   res.status(403);
    //   res.send("You cant post NOT MORE THAN 5 TIMES IN A MONTH");
    //   return
    // }


    const job = new Job({
      recruiter: user._id,
      company: req.body.company,
      title: req.body.title,
      category: req.body.category,
      selectedLocation: req.body.selectedLocation,
      jobPrimer : req.body.jobPrimer,
      selectedHires : req.body.selectedHires,
      contractType : req.body.contractType,
      upperSalary : req.body.upperSalary,
      lowerSalary: req.body.lowerSalary,
      description: req.body.description,
      skills: req.body.skills,
    });

    const createdJob = await job.save();
    if (!createdJob) {
      res.status(404).send("Job Not created");
      return;
    }
    res.status(200);
    res.send(createdJob);
  } catch (error) {
    console.log("ERROR = " + error);
    res.send(error);
  }
};

// getting one specfied job with its Id
exports.getOne = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.jobId)) {
      res.status(401).send("Invalid id");
      return;
    }
    const job = await Job.findById(req.params.jobId).exec();
    res.status(200);
    res.send(job);
  } catch (error) {
    next(error);
  }
};

// updating a job by its id
exports.putOne = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.jobId)) {
      res.status(404).send("Invalid Id");
      return
    }
    const response = { payLoad: {}, message: "" };
    const jobId = req.params.jobId;
    const job = await Job.findById(jobId).exec();
    if (!job) {
      res.status(404);
      res.send(`No job associated with id: ${jobId}`);
      return
    }
    for (const key in req.body) {
      if (
        job.schema.obj.hasOwnProperty(key) &&
        key !== "id" &&
        key !== "_id" &&
        key !== "recruiter"
      ) {
        job[key] = req.body[key];
      }
    }
    const updatedJob = await job.save();
    if (updatedJob) {
      response.message = "SUCCESS";
      response.payLoad = updatedJob;
    } else {
      res.status(404);
      res.send(`Job with id: ${jobId} not updated`);
    }
    res.status(200);
    res.send(response);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

// deleting a job by its id
exports.deleteOne = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.jobId)) {
      res.status(404).send("Invalid Id");
      return
    }
    const response = { payLoad: {}, message: "" };
    const deleteJob = await Job.findByIdAndDelete(req.params.jobId).exec();
    if (deleteJob) {
      response.message = "SUCCESS";
      res.status(200);
      res.send(response);
    } else {
      res.status(404);
      res.send(`Job with id: ${req.params.jobId} not deleted`);
    }
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

// jobs by the recruiter [clicking on recruiter profile]
exports.jobsByRecruiter = async (req, res, next) => {
  try {
    const findJobsByRecruiter = await Job.find(
      {
        recruiter: { $in: [
          mongoose.Types.ObjectId(req.params.recruiterId) 
        ] },
      },
      function (err, docs) {
        res.send(err)
        return
      }
    ).exec();
    res.status(200);
      res.send(findJobsByRecruiter)
    

    
  } catch (error) {
    next(error);
  }
};

// Recommendations
exports.recommendation = async (req, res, next) => {
  try {
    // let recommendedJobs = {}
    // console.log("im here in reocmmndations")
    const user = await Seeker.findOne({ id: req.user._id }).exec()
    let count = 0
    let counts = 0
    // console.log(user)
    const skills = user.skills ? user.skills : []
    // console.log("skills of seeker: ",skills )
    const response = { payLoad: [] }
    const jobs = await Job.find().exec()
    console.log("jobs len: ",jobs.length)

    let passesCriteria = false
    for (let index = 0, addCount = 0; index < jobs.length; index++) {
      const element = jobs[index]
      // console.log("zero par jo job ha" , jobs[0])
      
      // console.log("add Count: ",addCount)
      // console.log("index", index)

      // console.log("Element in jobs " + element)
      if (skills.length > 0 && element.skills) {
        count++ 
        // console.log("skills of seeker", skills)
        // console.log("element job skills: "+ element.skills)
        // console.log("here before passes: "+ count)

        passesCriteria = false
        skills.forEach(skill => {
          if (element.skills.includes(skill)) {
            counts++
            // console.log("count when matches: " + counts)
            // console.log("element job matched skills: "+ element.skills)
            passesCriteria = true

          }
         
        })
      }
      if (passesCriteria && addCount < 12) {
        response.payLoad.push(element)
        jobs.splice(index, 0)
        addCount++
      }
      
      
    }


    // recommendedJobs= response.payLoad
    res.status(200)
    res.send(response.payLoad)

    
  } catch (error) {
    next(error);
  }
};

