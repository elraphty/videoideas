const mongoose = require('./mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

// Create Schema
const usersSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

usersSchema.statics.getUserByUsername = function (email) {
    var User = this;
    return User.findOne({ email });
}

usersSchema.statics.comparePassword = function (password, hash) {
    return bcrypt.compare(password, hash);
}

usersSchema.statics.getUserById = function (id) {
    let User = this;
    return User.findById(id);
}

//Mongoose middleware
usersSchema.pre('save', function (next) {
    let User = this;

    if (User.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(User.password, salt, (err, hash) => {
                User.password = hash;
                next();
            });
        });
    } else {
        next();
    }

});

const Users = mongoose.model('users', usersSchema);

module.exports = Users;