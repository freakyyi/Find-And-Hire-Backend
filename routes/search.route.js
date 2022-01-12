const express = require("express");
const router = express.Router();
const auth = require("../middleware/verifyTokens");
const searchController = require("../controllers/search.controller");

router.get("/", searchController.getAll);
router.get("/jobs", auth, searchController.getJobs);
router.get("/users", auth, searchController.getUsers);
// router.post('/jobs', auth, searchController.getFilteredJobs)

module.exports = router;