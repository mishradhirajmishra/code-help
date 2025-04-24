const express = require('express');

const router = express.Router();
var moment = require('moment')
var User = require('../model/User')
const Contact = require('../model/Contact')
/* GET home page. */
const authcheck = (req, res, next) => {
    
    if (!req.isAuthenticated()) {
        res.redirect('/')
    }
    else { next(); }
}
router.get('/', (req, res) => {
    res.render('index', { title: 'Home'})
});

router.get('/dashboard', authcheck, (req, res) => {
    var alluser = User.find({'_id' :{ $ne:req.user._id}})
    .then((data)=>{
           res.render('backend/dashbord', { title: 'Dashboard',  logedIn: true, alluser:data })
    })
    .catch((e)=>{
        console.log(e);
    })

});
router.get('/chat', authcheck, (req, res) => {
    Contact.find({admin_id:req.user._id})
    .select('user_id admin_id')
    .populate('user_id') 
    .exec()
    .then((result)=>{
        res.render('backend/chat', { title: 'Chat', contacts:result})
    })
    
});
router.post('/addcontact', authcheck, (req, res) => {
     Contact.find({admin_id:req.user._id,user_id:req.body.id},(err,result)=>{
         if(!err){            
            if(result.length==0){                
                var room =Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                var contact  = new Contact({admin_id:req.user._id,user_id:req.body.id,room:room});
                contact.save().then(()=>{
                    res.send('added')    
                })
            }else{
                res.send('already Exist') 
            }
         }
     })

       
});
module.exports = router;

