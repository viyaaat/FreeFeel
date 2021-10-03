const jwt = require('jsonwebtoken');
const User = require('../models/users');


//authentication for private page
const requireAuth = (req, res, next) => {

    //accessing browser cookies
    const token = req.cookies.jwt;

    //check for jwt existance
    if (token) {

        //verifying user if he is login
        jwt.verify(token, 'my secret', (err, decodedToken) => {
            if (err) {
                //error redirect to login
                res.redirect('/login');
            }
            else {
                //console.log(decodedToken);
                next();
            }
        })
    }
    else {
        //error redirect to login
        res.redirect('/login');
    }
}

//check current user
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    //check for jwt existance
    if (token) {

        //verifying user if he is login
        jwt.verify(token, 'my secret', async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.locals.user = null;
                next();
            }
            else {
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        })
    }
    else {
        res.locals.user = null;
        next();
    }
}

module.exports = { requireAuth, checkUser };