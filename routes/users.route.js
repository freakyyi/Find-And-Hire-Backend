const router = require("express").Router();
const auth = require('../middleware/verifyTokens')
const usersController = require('../controllers/users.controller')
const dashboardController = require('../controllers/dashboard.controller')

router.get('/',auth ,usersController.getAll)
router.get('/getone/:userId',auth, usersController.getOne)
router.put('/update/:userId',usersController.updateProfile)
router.put('/updateInUser/:userId',usersController.updateUserProfile)
router.delete('/:userId', auth, usersController.deleteOne)

module.exports = router;

