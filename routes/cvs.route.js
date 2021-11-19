const express = require('express')
const router = express.Router()
const auth = require('../middleware/verifyTokens')
const cvsController = require('../controllers/cvs.controller')

router.get('/getCV/:seekerId',cvsController.getCVOfSeeker)
router.post('/createCV',auth,cvsController.createCV)
router.put('/updateCV/:cvId',auth,cvsController.updateCV)
 
module.exports = router;