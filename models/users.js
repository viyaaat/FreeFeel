const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

//model of user
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'please enter an email'],
        unique: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'please enter an password'],
        minlength: [6, 'minimum password length is 6']
    },
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    batch: {
        type: String,
        required: true
    },
    dept: {
        type: String,
        required: true
    },
    other: {
        type: String,
        required: true
    }
});

//hashing passwords
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

//static method to login user
userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error("Incorrect password");
    }
    throw Error('Incorrect email');
}

//User model to export
const User = mongoose.model('user', userSchema);
module.exports = User;
