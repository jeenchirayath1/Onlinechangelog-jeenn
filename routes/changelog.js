const path = require('path');

//const Changelog = require('./../models/Changelog')

const express = require('express');

const changelogController= require('../controllers/changelog');
const isAuth= require('../middleware/is-auth');

const router = express.Router();

router.get('/',changelogController.frontPage);


router.get('/home',isAuth,changelogController.getHome);
router.get('/home/newchangelog',isAuth,changelogController.newchangelog);

router.get('/home/edit/:id',isAuth,changelogController.getEdit);
router.post('/edit',isAuth,changelogController.postEdit);
router.get('/home/createaccount',isAuth,changelogController.createaccount);
router.get('/home/show/:id',isAuth,changelogController.getChangelog);
router.get('/home/:id',isAuth,changelogController.getswitchingaccount); 
router.post('/home/newchangelog',isAuth,changelogController.postAddChangelog);
router.post('/home/delete-changelog',isAuth,changelogController.postDeleteChangelog);
//router.get('/home/createaccount',isAuth,changelogController.createaccount);
router.post('/home/createaccount',isAuth,changelogController.postaccount);

module.exports = router; 
