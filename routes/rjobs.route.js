const router = require("express").Router();
const auth = require("../middleware/verifyTokens");
const rJobsController = require("../controllers/rjobs.controller");
const application = require("../models/application");
const applicationController = require("../controllers/application.controller");

router.get("/", rJobsController.get);
router.get("/recommendations", auth, rJobsController.recommendation);
router.get("/getTrendingJobs", rJobsController.getTrendingJobs);
router.get("/flagjob/:jobId", auth, rJobsController.flagJob);
router.get("/unflagjob/:jobId", auth, rJobsController.unFlagJob);

// Getting the details for the recruiter in order to get the seekers for that specific job
router.get("/getApplications/:jobId", applicationController.getApplications);

//for a job seeker to see on what jobs he has applied to?
router.get("/fetchApplied", auth, applicationController.fetchApplied);

router.post("/postJob", auth, rJobsController.post);
router.post("/stripe", auth, rJobsController.stripePayment);
router.post("/quiz", auth, rJobsController.quiz);
router.get("/test/:jobId", auth, rJobsController.test);
router.post("/answer/:jobId", auth, rJobsController.answer);
router.get("/:jobId", auth, rJobsController.getOne);
router.put("/:jobId", auth, rJobsController.putOne);
router.delete("/:jobId", auth, rJobsController.deleteOne);
// Clicking On Apply button
router.get(
    "/application/:jobId",
    auth,
    applicationController.createApplication
);
// finding all the jobs by the recruiter
router.get(
    "/findByRecruiter/:recruiterId",
    auth,
    rJobsController.jobsByRecruiter
);
router.put(
    "/UpdateStatus/:applicationId",
    applicationController.updateApplicationStatus
);
module.exports = router;