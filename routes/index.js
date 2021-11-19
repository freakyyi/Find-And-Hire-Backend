const express= require('express');
const router = express.Router();



// importing routes
const authRoute = require('./auth.route');
const userRoute = require('./users.route');
const scrapRoute = require('./sjobs.route');
const rjobsRoute = require('./rjobs.route')
const searchRoute = require('./search.route')
const cvsRoute = require('./cvs.route')

router.use('/accounts/auth' , authRoute)
router.use('/users', userRoute)
router.use('/sjobs', scrapRoute)
router.use('/rjobs', rjobsRoute)
router.use('/search',searchRoute)
router.use('/cv',cvsRoute)

module.exports = router;
