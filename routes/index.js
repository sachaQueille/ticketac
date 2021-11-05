var express = require('express');
var router = express.Router();
let {journeyModel} = require('../models/journey');
let {UserModel} = require('../models/users');

var city = ["Paris","Marseille","Nantes","Lyon","Rennes","Melun","Bordeaux","Lille"];
var date = ["2018-11-20","2018-11-21","2018-11-22","2018-11-23","2018-11-24"];


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', {});
});

router.get('/home', function(req, res, next) {
  res.render('home', {});
});

router.get('/results', async (req, res, next) => {
  res.render('results', {resultSearch: req.session.searchResult });
});

router.get('/noresults', function(req, res, next) {
  res.render('noresults', { title: 'Express' });
});

router.get('/order', function(req, res, next) {
	if (typeof(req.session.shop) == "undefined")  {
		req.session.shop = [];
	}
  let i = req.query.position;

  req.session.shop.push(
		req.session.searchResult[i]
	);


  res.render('order', {result: req.session.shop , username: req.session.firstname });
});

router.post('/sign-up', async(req, res, next) => {

  let newUser = new UserModel ({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.mail,
    pwd: req.body.pwd,
    tripsUser: [],
  })
  
  let checkMail = await UserModel.findOne({email: req.body.mail});
  
  
  if(checkMail == null) {
    var userSaved = await newUser.save();
    req.session.userid = userSaved._id;
    req.session.firstname = userSaved.firstname;
    req.session.lastname = userSaved.lastname;
    req.session.email = userSaved.email;
    req.session.tripsUser = userSaved.tripsUser;
    
    res.redirect('/home');
  } else {
    res.redirect('/');
  }

});

router.post('/sign-in', async(req, res, next) => {

  let userExist = await UserModel.findOne({mail: req.body.emailUser, pwd: req.body.pwdUser});

  if(userExist) {
    req.session.userid = userExist._id;
    req.session.firstname = userExist.firstname;
    req.session.lastname = userExist.lastname;
    req.session.email = userExist.email;
    req.session.tripsUser = userExist.tripsUser;
    res.redirect('/home');
  } else {
    res.redirect('/');
  }
 
});

router.post('/search', async (req, res, next) => {
  let resultSearch = await journeyModel.find({departure: req.body.cityfrom, arrival: req.body.cityto, date:req.body.date})
  
  let date = req.body.date; 

  if(resultSearch.length > 0){

    let results = [];

    for(let i = 0; i < resultSearch.length; i++) {
      results.push({
        cityfrom: req.body.cityfrom,
				cityto: req.body.cityto,
				date: req.body.date,
				hour: resultSearch[i].departureTime,
				price: Number( resultSearch[i].price ),
      });
    }
    req.session.searchResult = results;
   
    res.redirect("/results")
  } else {
    res.redirect("/noresults")
  }
}); 

router.get('/updatebdd', async (req, res, next) => {

	let user = await UserModel.findOne( {_id : req.session.userid});

	
	for (let i=0; i<req.session.shop.length; i++) {
		user.trips.push({
			departure: req.session.shop[i].cityfrom,
		  	arrival: req.session.shop[i].cityto,
		  	date: req.session.shop[i].date,
		  	departureTime: req.session.shop[i].hour,
		  	price: req.session.shop[i].price,
		});
	}
	
	await user.save();
	
	res.render('home', { username: req.session.firstname });
});

router.get('/lasttrips', async (req, res, next) => {

	let user = await UserModel.findOne( {_id : req.session.userid} );
  if(user) {
    let lastTrips = user.trips;
    res.render('lasttrips', { lastTrips});
  } else {
    res.redirect('/');
  }
	
});

router.get('/logout', function (req, res, next) {
  req.session.destroy();
   res.redirect('/');
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
  res.render('/');
});

module.exports = router;
