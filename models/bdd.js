const mongoose = require('mongoose');
// --------------------- BDD -----------------------------------------------------
var options = {
    connectTimeoutMS: 5000,
    useNewUrlParser: true,
    useUnifiedTopology: true
   };

mongoose.connect('mongodb+srv://HackathonUser:Hackathon2021@cluster0.prvpu.mongodb.net/Ticketac?retryWrites=true&w=majority',
   options,
   function(err) {
    if (err) {
      console.log(`error, failed to connect to the database because --> ${err}`);
    } else {
      console.info('*** Database Ticketac connection : Success ***');
    }
   }
);


