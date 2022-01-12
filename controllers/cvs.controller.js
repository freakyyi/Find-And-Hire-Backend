const mongoose = require("mongoose");

const CV = require("../models/CV");
const User = require("../models/User");

exports.createCV = async(req, res, next) => {
    try {
        const user = await User.findById(req.user._id).exec();
        if (user.role !== "seeker") {
            res.status(401).send("Unauthorized Access");
            return;
        }
        const seekerId = await CV.findOne({ seeker: user._id });
        if (seekerId)
            return res
                .status(403)
                .send(
                    "CV already Exists, You can Update it , instead of creating a new one"
                );

        const cv = new CV({
            seeker: user._id,
            experience: req.body.experience,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            profession: req.body.profession,
            city: req.body.city,
            state: req.body.state,
            zipcode: req.body.zipcode,
            phone: req.body.phone,
            email: req.body.email,
            education: req.body.education,
            workHistory: req.body.workHistory,
            skills: req.body.skills,
            summary: req.body.summary,
        });

        const savedCV = await cv.save();

        if (!savedCV) {
            res.status(404).send("CV Not created");
            return;
        }
        res.status(200);
        res.send(savedCV);
    } catch (error) {
        console.log("full sed error " + error);
        res.send(error);
    }
};

exports.updateCV = async(req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.cvId)) {
            res.status(404).send("Invalid Id");
        }
        const response = { payLoad: {}, message: "" };
        const cvId = req.params.cvId;
        const cv = await CV.findById(cvId).exec();
        if (!cv) {
            res.status(404);
            res.send(`No cv associated with id: ${cvId}`);
            return;
        }
        for (const key in req.body) {
            if (
                cv.schema.obj.hasOwnProperty(key) &&
                key !== "id" &&
                key !== "_id" &&
                key !== "seeker"
            ) {
                cv[key] = req.body[key];
            } else {
                res.send(error);
                return;
            }
        }
        const updatedCV = await cv.save();
        if (updatedCV) {
            response.message = "SUCCESS";
            response.payLoad = updatedCV;
        } else {
            res.status(404);
            res.send(`CV with id: ${cvId} not updated`);
        }
        res.status(200);
        res.send(response);
    } catch (error) {
        console.log(error);
        res.send(error);
    }
    console.log("Update cv", req.body);
};

exports.getCVOfSeeker = async(req, res, next) => {
    try {
        const seekerId = await CV.findOne({ seeker: req.params.seekerId });
        if (!seekerId) {
            res.status(400).send("CV Doesn't Exists against this userId");
            return;
        }
        // else if(seekerId){

        //   res.status(403).send("CV already Exists, You can Update it , instead of creating a new one");
        //   return
        //   }

        const cvOfSeeker = await CV.find({ seeker: req.params.seekerId });
        res.status(200);
        res.send(cvOfSeeker);
    } catch (error) {
        console.log("error: ", error);
        res.status(404).send("CV Not Found Against this user");
        return;
    }
};