const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash= require('connect-flash');


const Account= require('./models/account');
const User=require('./models/user');

const MONGODB_URI =
"mongodb+srv://Donnacc:KFV1xuwbpOhpmjDq@cluster0.zmpiu.mongodb.net/changelogdb";

const app = express();

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: false}));

const authRoutes = require('./routes/auth');
const changeLog = require('./routes/changelog');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);


app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
 

User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
     // console.log(req.user);
      next();
    })
    .catch(err => console.log(err));
});


app.use(authRoutes);
app.use(changeLog);


//app.use((req, res, next) => {
//  res.status(404).render('404', { pageTitle: 'Page Not Found' });
//});
mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true , useUnifiedTopology: true })
  .then(result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });

