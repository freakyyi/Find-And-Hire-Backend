const router = require("express").Router();
const auth = require("../middleware/verifyTokens");
const usersController = require("../controllers/users.controller");
const dashboardController = require("../controllers/dashboard.controller");

router.get("/", usersController.getAll);
router.post("/addmessage", auth, usersController.addMessage);
router.get("/getmessage", auth, usersController.getMessages);
router.get("/getone/:userId", auth, usersController.getOne);
router.put("/update/:userId", usersController.updateProfile);
router.put("/updateInUser/:userId", usersController.updateUserProfile);
router.delete("/:userId", auth, usersController.deleteOne);
router.get("/count/seekers", usersController.getSeekerCount);
router.get("/count/recruiters", usersController.getRecruiterCount);
router.get("/count/users", usersController.getUsersCount);
module.exports = router;