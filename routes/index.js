var express = require('express');
var router = express.Router();
let {journeyModel} = require('../models/journey');
let {UserModel} = require('../models/users');

var city = ["Paris","Marseille","Nantes","Lyon","Rennes","Melun","Bordeaux","Lille"];
var date = ["2018-11-20","2018-11-21","2018-11-22","2018-11-23","2018-11-24"];


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

router.post('/search', async function(req, res, next) {
  var trajet = await journeyModel.find({departure: req.body.cityfrom, arrival: req.body.cityto, date:req.body.date})
  console.log(trajet)
  if(!trajet){
    res.redirect("/oups")
  } else {
    res.redirect("/results", {trajet})
  }
});

router.get('/results', function(req, res, next) {
  res.render('results', { title: 'Express' });
});

router.get('/noresults', function(req, res, next) {
  res.render('noresults', { title: 'Express' });
});

router.get('/order', function(req, res, next) {
  res.render('order', { title: 'Express' });
});

router.get('/trips', function(req, res, next) {
  res.render('trips', { title: 'Express' });
});

router.post('/sign-up', async(req, res, next) => {

  let newUser = new UserModel ({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.mail,
    pwd: req.body.pwd,
  })
  
  let checkMail = await UserModel.findOne({email: req.body.mail});
  
  console.log(checkMail);
  //console.log(userSaved)
  if(checkMail == null) {
    let userSaved = await newUser.save();
    req.session.userName = userSaved.firstName;
    //console.log(req.session.name);
    req.session.userId = userSaved._id;
    //console.log(req.session)
    res.redirect('/home');
  } else {
    res.redirect('/');
  }

});

router.post('/sign-in', async(req, res, next) => {

  let userExist = await UserModel.findOne({mail: req.body.emailUser, pwd: req.body.pwdUser});

  if(userExist) {
    req.session.userName = userExist.firstName;
    req.session.userID = userExist._id;
    res.redirect('/home');
  } else {
    res.redirect('/');
  }
 
});

router.post('/search', async function(req, res, next) {
  let trajet = await journeyModel.find({departure: req.body.cityfrom, arrival: req.body.cityto, date:req.body.date})
  console.log(trajet)
  if(trajet.length > 0){
    res.redirect("/results")
  } else {
    res.redirect("/noresults",)
  }
}); 

// Remplissage de la base de donnée, une fois suffit
router.get('/save', async function(req, res, next) {

  // How many journeys we want
  var count = 300

  // Save  ---------------------------------------------------
    for(var i = 0; i< count; i++){

    departureCity = city[Math.floor(Math.random() * Math.floor(city.length))]
    arrivalCity = city[Math.floor(Math.random() * Math.floor(city.length))]

    if(departureCity != arrivalCity){

      var newUser = new journeyModel ({
        departure: departureCity , 
        arrival: arrivalCity, 
        date: date[Math.floor(Math.random() * Math.floor(date.length))],
        departureTime:Math.floor(Math.random() * Math.floor(23)) + ":00",
        price: Math.floor(Math.random() * Math.floor(125)) + 25,
      });
       
       await newUser.save();

    }

  }
  res.render('index', { title: 'Express' });
});

module.exports = router;
