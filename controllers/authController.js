const User = require('../models/users');
const jwt = require('jsonwebtoken');


//handle errors
const handlErrors = (err) => {
    //console.log(err.message, err.code);
    let errors = { email: '', password: '' };

    /**** errors for login ****/
    if (err.message === 'Incorrect email') {
        errors.email = 'that email is not registered';
        return errors;
    }
    if (err.message === 'Incorrect password') {
        errors.password = 'password is incorrect';
        return errors;
    }

    /**** errors for signup ****/
    //=>duplicate error 
    if (err.code == 11000) {
        errors.email = 'that email is already registered';
        return errors;
    }
    //=>validation errors 
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        })
    }
    return errors;
}


const mxage = 2 * 60 * 60;

//create tokens
const createToken = (id) => {
    return jwt.sign({ id }, 'my secret', { expiresIn: mxage });
}


//get requests for signup and login to send webpage
module.exports.signup_get = (req, res) => {
    res.render('signup', { title: 'signup' });
}
module.exports.login_get = (req, res) => {
    res.render('login', { title: 'login' });
}


//signup code creating account on website
module.exports.signup_post = async (req, res) => {

    //getting email and password from request
    const { email, password, name, gender, batch, dept, other } = req.body;


    //try to signup
    try {
        const user = await User.create({ email, password, name, gender, batch, dept, other });

        //if successful sending jwt for login
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: mxage * 1000 });

        //sending data to browser
        res.status(201).json({ user });
    }
    catch (err) {
        const errors = handlErrors(err);

        //sending about errors to browser
        res.status(404).json({ errors });
    }
}



//logging in user
module.exports.login_post = async (req, res) => {

    //getting email and password from request
    const { email, password } = req.body;

    //trying to login
    try {
        const user = await User.login(email, password);

        //if successful sending jwt for login
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: mxage * 1000 });

        //sending data to browser
        res.status(200).json({ user: user._id });
    }
    catch (err) {
        const errors = handlErrors(err);

        //sending about errors to browser
        res.status(404).json({ errors });
    }
}

//get request for logout
module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
}

module.exports.user_details = (req, res) => {
    const id = req.params.id;
    User.findById(id).then((result) => {
        res.render('../project/profile.ejs', { profile: result, title: 'profile' });
    })
        .catch((err) => {
            res.status(404).render('../project/pages/404.ejs', { title: 'user not found' });
        });
}
module.exports.update_details = (req, res) => {
    const id = req.params.id;
    User.findById(id).then((result) => {
        res.render('../project/update.ejs', { profile: result, title: 'update' });
    })
        .catch((err) => {
            res.status(404).render('../project/pages/404.ejs', { title: 'user not found' });
        });
}

module.exports.update_user = (req, res) => {
    const _id = req.params.id;

    User.findOneAndUpdate({ _id }, {
        $set: {
            name: req.body.name,
            gender: req.body.gender,
            batch: req.body.batch,
            dept: req.body.dept,
            other: req.body.other
        }
    }).then((result) => {
        res.json(result);
    })
        .catch((err) => {
            res.status(404).render('../project/pages/404.ejs', { title: 'user not found' });
        });
}