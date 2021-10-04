const mongoose = require("mongoose");

const userScema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    avatar: { type: String },
});

const User = mongoose.model('user', userScema);

module.exports = User;