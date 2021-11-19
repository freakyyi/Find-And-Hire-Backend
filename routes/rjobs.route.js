const router = require("express").Router();
const auth = require('../middleware/verifyTokens')
const rJobsController = require('../controllers/rjobs.controller');
const application = require("../models/application");
const applicationController = require('../controllers/application.controller')

router.get("/",rJobsController.get)
router.get('/recommendations',auth,rJobsController.recommendation)
router.get('/fetchApplied',auth,applicationController.fetchApplied)

router.post("/postJob",auth,rJobsController.post)
router.get("/:jobId",auth,rJobsController.getOne)
router.put('/:jobId',auth,rJobsController.putOne)
router.delete('/:jobId',auth,rJobsController.deleteOne)

// finding all the jobs by the recruiter
router.get('/findByRecruiter/:recruiterId',auth,rJobsController.jobsByRecruiter)
// Clicking On Apply button
router.post('/application/:jobId',auth,applicationController.createApplication)
// Getting the details for the recruiter in order to get the seekers for that specific job
router.post('/application/getApplications/:jobId',auth,applicationController.getApplications)
//for a job seeker to see on what jobs he has applied to?

module.exports = router;
