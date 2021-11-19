const router =  require('express').Router();
const verify = require('../middleware/verifyTokens');

router.get('/',verify , (req,res) => {
    if(req.user.roles === "seeker"){
         
    }
    else {
        
    }
    console.log(req.user)
    res.json({
        posts: {
            title : "first post",
            description : 'random no access'
        }
    })
})

module.exports = router;