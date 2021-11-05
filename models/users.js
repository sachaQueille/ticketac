let mongoose = require('mongoose');

let tripsSchema = mongoose.Schema({
    departure: String,
    arrival: String,
    date: Date,
    departureTime: String,
    price: Number,
})

let userSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    pwd: String,
    trips: [tripsSchema],
})

let UserModel = mongoose.model('users', userSchema)

module.exports = {UserModel}