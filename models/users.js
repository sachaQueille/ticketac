let mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    pwd: String,
})

let UserModel = mongoose.model('users', userSchema)

module.exports = {UserModel}