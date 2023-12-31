const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trime: true
    },
    password: {
        type: String,
        required: true,
    },
    visibility: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('User', userSchema);;