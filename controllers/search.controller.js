const mongoose = require("mongoose");
const Recruiter = require("../models/recruiter");
const Seeker = require("../models/seeker");
const User = require("../models/User");
const Job = require("../models/Job");

exports.getAll = async(req, res) => {
    try {
        const response = { payLoad: {} };
        const job = await Job.find().exec();
        const recruiter = await Recruiter.find().exec();
        const seeker = await Seeker.find().exec();
        const user = await User.find().exec();
        const flagJobs = await Job.find({ flag: 1 }).exec();
        response.payLoad = { job, recruiter, seeker, flagJobs, user };
        res.status(200);
        res.send(response);
    } catch (error) {
        res.send(error);
    }
};

exports.getJobs = async(req, res, next) => {
    try {
        const response = { payLoad: {} };
        const job = await Job.find().exec();
        response.payLoad = { job };
        res.status(200);
        res.send(response);
    } catch (error) {
        res.send(error);
    }
};

exports.getUsers = async(req, res, next) => {
    try {
        const response = { payLoad: {} };
        const recruiter = await Recruiter.find().exec();
        const seeker = await Seeker.find().exec();
        response.payLoad = { recruiter, seeker };
        res.status(200);
        res.send(response);
    } catch (error) {
        res.send(error);
    }
};