const express = require("express");
const router = express.Router();
const sJobsController = require("../controllers/sjobs.controller");

// routers when our database is setup alredi
// router.post('/postScrapeJobs',sJobsController.postScrapeJobs)
// router.get('/',sJobsController.getAll)

// routers when data is going directly
router.post("/", sJobsController.postScrapeJobs);
router.post("/scholarships", sJobsController.getScholarShips);

module.exports = router;