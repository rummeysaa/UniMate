const express= require('express')
const router = express.Router()

// Session kontrolü middleware'i
const checkAuth = (req, res, next) => {
  if (!req.session.userID || !req.session.userName) {
    return res.redirect('/login');
  }
  next();
};

router.get('/', checkAuth, (req, res) => {
  console.log('Dashboard session bilgileri:', {
    userID: req.session.userID,
    userName: req.session.userName
  });
  
  res.render('site/dashboard', { 
    userName: req.session.userName,
    userID: req.session.userID
  });
});

module.exports = router