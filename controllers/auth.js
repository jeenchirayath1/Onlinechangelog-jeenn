const bcrypt=require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const User = require('../models/user');
const Account = require('../models/account');

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        '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'
    }
  })
);


exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/login', {
  pageTitle: 'Login',
  errorMessage: message
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    path:'/signup',
    pageTitle: 'Signup',
    errorMessage:message
  });
};
exports.postSignup = (req,res,next) =>{
  const name = req.body.name;
  const email = req.body.email;
  const weburl = req.body.weburl;
  const password = req.body.password;
  const confirmPassword = req.body.confirmpassword;
 
  User.findOne({ email: email })
  .then(userDoc => {
    if (userDoc) {
      req.flash('error','This email already exists');
      return res.redirect('/signup');
    }
    const account = new Account({
      weburl : weburl,
      //userId:result._id
     });
     return account.save().then(result=>{
  
      return bcrypt
      .hash(password, 12)
      .then(hashedPassword => {
        const user = new User({
          name :name,
          email : email,
          password:hashedPassword,
          role : 'owner',
          accounts:[{
                  accountId:result._id,
                  status:1
                  }
                  ] 
            
                
          });
       return user.save();
     })
    
   /* return bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
      const user = new User({
        name :name,
        email : email,
        password:hashedPassword,
        role : 'owner'
      });
     return user.save().then(result=>{
      const account = new Account({
        weburl : weburl,
        userId:result._id
       });
       return account.save();
       })*/
       .then(result => {
          res.redirect('/login');
          return transporter.sendMail({
          to: email,
          from: 'jeen.chirayath@hey.ooo',
          subject: 'Signup succeeded!',
          text:'Hello, Welcome to Heyooo Online Changelog!'
        });
      })
    });
  })
  .catch(err => {
      console.log(err);
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        req.flash('error','Invaild username or password');
        return res.redirect('/login');
      }
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/home');
            });
          }
          req.flash('error', 'Invalid password.');
          res.redirect('/login');
        })
        .catch(err => {
          
          res.redirect('/login');
        });
    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/login');
  });
};