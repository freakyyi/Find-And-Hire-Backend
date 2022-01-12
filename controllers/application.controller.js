const mongoose = require("mongoose");
const Job = require("../models/Job");
const CV = require("../models/CV");
const User = require("../models/User");
const Seeker = require("../models/seeker");
const Application = require("../models/application");
const Answer = require("../models/Answer");

exports.createApplication = async(req, res, next) => {
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
        res.send(savedApplication);
    } catch (error) {
        console.log(error);
        res.send(error);
    }
};

exports.getApplications = async(req, res, next) => {
    try {
        // const user = await User.findById(req.user._id).exec();
        // if (user.role === "seeker") {
        //   res.status(401).send("Unauthorized Access");
        //   return;
        // }
        const response = { payLoad: [] };
        const ObjectID = mongoose.Types.ObjectId;
        var jobId = req.params.jobId;
        var query = {
            jobId: new ObjectID(jobId),
        };
        let id = req.params.jobId;

        var applications = await Application.find(query);

        // console.log("querys",query)
        for (let index = 0; index < applications.length; index++) {
            const getAnswer = await Answer.find({
                jobId: id,
                seekerId: applications[index].seekerId,
            });
            console.log("getAnswer", getAnswer);
            var seekerId = applications[index]["seekerId"];
            var seeker = await User.findOne({ _id: seekerId }).exec();
            var cvId = applications[index]["cvId"];
            console.log("cviod", cvId);
            var cv = await CV.findOne({ _id: cvId }).exec();
            var convertedApplicationJSON = JSON.parse(
                JSON.stringify(applications[index])
            );
            response.payLoad.push({
                Application: convertedApplicationJSON,
                seeker: seeker,
                cv: cv,
                getAnswer,
            });
        }
        res.status(200);
        res.send(response);
    } catch (error) {
        next(error);
    }
};

// show applied jobs :

exports.fetchApplied = async(req, res, next) => {
    try {
        const response = { payLoad: [] };

        const user = await User.findById(req.user._id).exec();
        if (user.role !== "seeker") {
            res.status(401).send("Unauthorized Access");
            return;
        }

        const findAppliedJobs = await Application.find({
            seekerId: { $in: [mongoose.Types.ObjectId(req.user._id)] },
        }).exec();

        for (let index = 0; index < findAppliedJobs.length; index++) {
            const status = findAppliedJobs[index].status;
            const element = findAppliedJobs[index];
            let array = [];
            const job = await Job.findById(element.jobId).exec();
            array.push(job, { status: status });

            response.payLoad.push({ job: job, status: status });
            // response.payLoad.push(job)
            // response.payLoad.push(status)
        }
        res.status(200);
        res.json({ "Your Applied Jobs and their status ": response });
    } catch (error) {
        res.send(error);
        return;
    }
};

exports.updateApplicationStatus = async(req, res, next) => {
    console.log(req.body);
    try {
        // const user = await User.findById(req.user._id).exec();
        // if (user.role !== "recruiter") {
        //   res.status(401).send("Unauthorized Access");
        //   return;
        // }
        if (!mongoose.Types.ObjectId.isValid(req.params.applicationId)) {
            res.status(404).send("Invalid applicationId");
            return;
        }
        const response = { payLoad: [], message: "" };
        const applicationId = req.params.applicationId;

        const application = await Application.findById(applicationId).exec();
        if (!application) {
            res.status(404);
            res.send(`No application associated with id: ${applicationId}`);
            return;
        }
        // const application = await Application.findOneAndUpdate({_id: req.params.applicationId}, req.body, {new: true, runValidators: true});

        for (const key in req.body) {
            if (
                application.schema.obj.hasOwnProperty(key) &&
                key !== "id" &&
                key !== "_id" &&
                key !== "jobId" &&
                key !== "seekerId" &&
                key !== "recruiterId" &&
                key !== "cvId"
            ) {
                application[key] = req.body[key];
            }
        }

        const updatedStatus = await application.save();
        if (updatedStatus) {
            response.message = "Status Updated";
            // response.payLoad = updatedStatus;

            var applications = await Application.find({ jobId: updatedStatus.jobId });

            // console.log("querys",query)
            for (let index = 0; index < applications.length; index++) {
                const getAnswer = await Answer.find({
                    jobId: updatedStatus.jobId,
                    seekerId: applications[index].seekerId,
                });
                console.log("getAnswer", getAnswer);
                var seekerId = applications[index]["seekerId"];
                var seeker = await User.findOne({ _id: seekerId }).exec();
                var cvId = applications[index]["cvId"];
                console.log("cviod", cvId);
                var cv = await CV.findOne({ _id: cvId }).exec();
                var convertedApplicationJSON = JSON.parse(
                    JSON.stringify(applications[index])
                );
                response.payLoad.push({
                    Application: convertedApplicationJSON,
                    seeker: seeker,
                    cv: cv,
                    getAnswer,
                });
            }
        } else {
            res.status(404);
            res.send(`Application with id: ${applicationId} not updated`);
        }
        res.status(200);
        res.send(response);
    } catch (error) {
        console.log(error);
    }
};