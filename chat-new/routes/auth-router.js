const express = require('express');
const router = express.Router();
const User = require('../model/User')
var passport = require('passport');
const bcryptjs = require('bcryptjs');

// ------------- Register User ------------------
router.get('/register', (req, res) => {
    res.render('backend/register', { title: 'Register' });
  });
// -----------------------------------------------
router.post('/register', (req, res, next)=> {  
    const { name, email, password, password2 } = req.body;
    const error = [];
    if (!name || !email || !password || !password2) {
      error.push({ msg: 'all fields are required' })
    }
    if (password !== password2) {
      error.push({ msg: 'password is not equal' })
    }
    if (error.length > 0) {
      res.render('backend/register', { title: 'Register', errorMsg: error, name, email, password, password2 });
    } else {
      User.findOne({ email: email })
        .then((user) => {
          if (user) {
            error.push({ msg: 'email already exist' })
            res.render('backend/register', { title: 'Register', errorMsg: error, name, email, password, password2 });
          }
          else {
            const user = new User({ name, email, provider: 'local',  password })  
            bcryptjs.genSalt(10, function (err, salt) {
              bcryptjs.hash(password, salt, function (err, hash) {
                user.password = hash;
                        // -------------------------------------------
                        if (req.files && Object.keys(req.files).length != 0) {  
                          user.image = req.files.image.name;
                          user.image =new Date().getTime()+'_'+user.image; 
                          var dir = "./public/images/"+user.image;
                          sampleFile = req.files.image;
                          sampleFile.mv(dir, function(err) { if (err) return res.status(500).send(err);});
                        }
                        // ------------------------------------------
                user.save((err) => {
                  if (err) { console.log(err); 
                    req.flash(
                      'error_msg',
                      'some error occured'
                    );
                  }
                  else{
                  req.flash(
                    'success_msg',
                    'Thank You for registrin with us please login to proceed'
                  );
                  res.redirect('/');
                  }
                })
              });
            });
  
          }
        })
        .catch(err => console.log(err))
    }
  });


//  ----------------------- login User -----------------------
router.get('/login',(req, res) => {
    res.render('backend/login', { title: 'Login' });
  }
  );
// ----------------------------------------------------------
router.post('/login', passport.authenticate('local', { failureRedirect: '/auth/login',  failureFlash: true}),(req, res) => {
    req.flash(
      'success_msg',
      'welcome ' + req.user.name
    );
    res.redirect('/dashboard');
  });
// ..........................................................
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });
module.exports = router;
