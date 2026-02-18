const express= require('express')
const router = express.Router()

router.get('/',(reg,res)=>{
    res.render('site/devamsizlik')
})
module.exports = router
