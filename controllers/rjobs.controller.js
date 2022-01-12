const mongoose = require("mongoose");
const Job = require("../models/Job");
const Recruiter = require("../models/recruiter");
const Seeker = require("../models/seeker");
const Payment = require("../models/payment");
const Quiz = require("../models/quiz");
const CV = require("../models/CV");
const Answer = require("../models/Answer");
const Application = require("../models/application");

const User = require("../models/User");
const stripe = require("stripe")(
    "sk_test_51J33DXAS6wWQYlKwTjFjso6fSO9WJAZE33A3FFMhfoIO7W9jz57TexeIwJTFeJ5aBGfCAjzD7knlNQ9CXYRmsjZm00bfyQQ1ij"
);

// getting all jobs by everyone [ for admin user ]
exports.get = async(req, res, next) => {
    try {
        // const jobs = await Job.find().exec()

        let jobs = [];
        const job1 = await Job.find({
            package: { $in: ["basic", "standard", "premium"] },
        }).exec();
        for (let i = 0; i < job1.length; i++) {
            jobs.push(job1[i]);
        }

        const job2 = await Job.find({
            package: { $nin: ["basic", "standard", "premium"] },
        }).exec();

        for (let i = 0; i < job2.length; i++) {
            jobs.push(job2[i]);
        }

        res.status(200);
        res.send(jobs);
    } catch (error) {
        res.send(error);
    }
};

// posting jobs by a recruiter
exports.post = async(req, res, next) => {
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
            jobPrimer: req.body.jobPrimer,
            selectedHires: req.body.selectedHires,
            contractType: req.body.contractType,
            upperSalary: req.body.upperSalary,
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
exports.quiz = async(req, res, next) => {
    try {
        const user = await User.findById(req.user._id).exec();
        if (user.role !== "recruiter") {
            res.status(401).send("Unauthorized Access");
            return;
        }

        const quiz = new Quiz({
            recruiterId: user._id,
            questions: req.body.question,
            jobId: req.body.jobId,
        });

        const createdQuiz = await quiz.save();
        if (!createdQuiz) {
            res.status(404).send("Quiz Not created");
            return;
        }
        res.status(200);
        res.send(createdQuiz);
    } catch (error) {
        console.log("ERROR = " + error);
        res.send(error);
    }
};

exports.test = async(req, res, next) => {
    try {
        let id = req.params.jobId;
        const test = await Quiz.find({ jobId: id }).select("questions");

        if (!test) {
            res.status(404).send("No Test Found");
            return;
        }
        res.status(200);
        res.send(test);
    } catch (error) {
        console.log("ERROR = " + error);
        res.send(error);
    }
};

exports.answer = async(req, res, next) => {
    try {
        const user = await User.findById(req.user._id).exec();
        if (user.role !== "seeker") {
            res.status(401).send("Unauthorized Access");
            return;
        }

        const answer = new Answer({
            seekerId: user._id,
            questions: req.body.answer,
            jobId: req.params.jobId,
        });

        const createdAnswer = await answer.save();
        if (!createdAnswer) {
            res.status(404).send("Quiz Not created");
            return;
        }
        if (createdAnswer) {
            const job = await Job.findById(req.params.jobId).exec();
            // getting recruiter id
            const recruiter = job.recruiter;
            //getting seekerId
            const sId = req.user._id;
            // getting CV
            const cv = await CV.findOne({ seeker: req.user._id }).exec();
            // getting cvId
            const cvId = cv._id;

            // check if seeker has applied to it before or not
            // const seekerId = await Application.findOne({ seekerId: user._id });
            // if (seekerId)
            //     return res.send("Application already sent, Please wait for the result");

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
            res.send("Applied to the Job");
        }
    } catch (error) {
        console.log("ERROR = " + error);
        res.send(error);
    }
};

exports.getTrendingJobs = async(req, res, next) => {
    try {
        const jobs = await Job.find({
            package: { $in: ["basic", "standard", "premium"] },
        }).exec();
        console.log("getTrendingJobs", jobs);
        res.status(200);
        res.send(jobs);
    } catch (error) {
        res.send(error);
    }
};

exports.flagJob = async(req, res, next) => {
    try {
        const user = await User.findById(req.user._id).exec();
        if (user.role !== "seeker") {
            res.status(401).send("Unauthorized Access");
            return;
        }
        console.log(req.user._id);
        const jobs = await Job.findById(req.params.jobId).exec();
        if (jobs) {
            jobs.flagged.flag = 1;
            jobs.flagged.userId = req.user._id;

            const updatedJob = await jobs.save();
            console.log(updatedJob);
            res.send(updatedJob);
        }
    } catch (error) {
        console.log("ERROR = " + error);
        res.send(error);
    }
};

exports.unFlagJob = async(req, res, next) => {
    try {
        const user = await User.findById(req.user._id).exec();
        if (user.role !== "seeker") {
            res.status(401).send("Unauthorized Access");
            return;
        }

        const jobs = await Job.findById(req.params.jobId).exec();
        if (jobs) {
            jobs.flagged.flag = 0;
            jobs.flagged.userId = "";
            const updatedJob = await jobs.save();
            console.log(updatedJob);
            res.send(updatedJob);
        }
    } catch (error) {
        console.log("ERROR = " + error);
        res.send(error);
    }
};

exports.stripePayment = async(req, res, next) => {
    res.header("Access-Control-Allow-Origin: *");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    console.log("req", req.body);
    try {
        const user = await User.findById(req.user._id).exec();
        if (user.role !== "recruiter") {
            res.status(401).send("Unauthorized Access");
            return;
        }

        let price = req.body.price;
        let amount1 = price * 100;
        const body = {
            source: req.body.token.id,
            amount: amount1,
            currency: "usd",
        };

        await stripe.charges.create(body, async(StripeErr, StripeRes) => {
            if (res.StripeErr) {
                res.status(500).send({ error: StripeErr });
                return;
            }

            // res.status(200).send({ success: StripeRes });
            console.log(StripeRes);
            if (StripeRes.status === "succeeded") {
                let skills = req.body.jobData.skills.split(",");
                const job = new Job({
                    recruiter: user._id,
                    company: req.body.jobData.company,
                    title: req.body.jobData.title,
                    category: req.body.jobData.selectedCategory,
                    selectedLocation: req.body.jobData.selectedLocation,
                    jobPrimer: req.body.jobData.jobPrimer,
                    selectedHires: req.body.jobData.selectedHires,
                    contractType: req.body.jobData.contractType,
                    upperSalary: req.body.jobData.upperSalary,
                    lowerSalary: req.body.jobData.lowerSalary,
                    description: req.body.jobData.description,
                    skills: skills,
                    package: req.body.plan,
                });

                const createdJob = await job.save();
                if (!createdJob) {
                    res.status(404).send("Job Not created");
                    return;
                }
                res.status(200);
                res.send(createdJob);
            }
        });
    } catch (error) {
        console.log("ERROR = " + error);
        res.send(error);
    }
};

// getting one specfied job with its Id
exports.getOne = async(req, res, next) => {
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
exports.putOne = async(req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.jobId)) {
            res.status(404).send("Invalid Id");
            return;
        }
        const response = { payLoad: {}, message: "" };
        const jobId = req.params.jobId;
        const job = await Job.findById(jobId).exec();
        if (!job) {
            res.status(404);
            res.send(`No job associated with id: ${jobId}`);
            return;
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
exports.deleteOne = async(req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.jobId)) {
            res.status(404).send("Invalid Id");
            return;
        }
        const response = { payLoad: {}, message: "" };
        const deleteJob = await Job.findByIdAndDelete(req.params.jobId).exec();
        if (deleteJob) {
            const application = Application.findByIdAndDelete(
                req.params.jobId
            ).exec();
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
exports.jobsByRecruiter = async(req, res, next) => {
    try {
        const findJobsByRecruiter = await Job.find({
                recruiter: { $in: [mongoose.Types.ObjectId(req.params.recruiterId)] },
            },
            function(err, docs) {
                if (err) {
                    res.send(err);
                    return;
                }
            }
        ).exec();
        res.status(200);
        res.send(findJobsByRecruiter);
    } catch (error) {
        next(error);
    }
};

// Recommendations
exports.recommendation = async(req, res, next) => {
    try {
        // let recommendedJobs = {}
        // console.log("im here in reocmmndations")
        const user = await Seeker.findOne({ id: req.user._id }).exec();
        let count = 0;
        let counts = 0;
        // console.log(user)
        const skills = user.skills ? user.skills : [];
        // console.log("skills of seeker: ",skills )
        const response = { payLoad: [] };
        const jobs = await Job.find().exec();
        console.log("jobs len: ", jobs.length);

        let passesCriteria = false;
        for (let index = 0, addCount = 0; index < jobs.length; index++) {
            const element = jobs[index];
            // console.log("zero par jo job ha" , jobs[0])

            // console.log("add Count: ",addCount)
            // console.log("index", index)

            // console.log("Element in jobs " + element)
            if (skills.length > 0 && element.skills) {
                count++;
                // console.log("skills of seeker", skills)
                // console.log("element job skills: "+ element.skills)
                // console.log("here before passes: "+ count)

                passesCriteria = false;
                skills.forEach((skill) => {
                    if (element.skills.includes(skill)) {
                        counts++;
                        // console.log("count when matches: " + counts)
                        // console.log("element job matched skills: "+ element.skills)
                        passesCriteria = true;
                    }
                });
            }
            if (passesCriteria && addCount < 12) {
                response.payLoad.push(element);
                jobs.splice(index, 0);
                addCount++;
            }
        }

        // recommendedJobs= response.payLoad
        res.status(200);
        res.send(response.payLoad);
    } catch (error) {
        next(error);
    }
};