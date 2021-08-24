const jwt = require('jsonwebtoken');
const path = require('path');


// check if jwt exists 
const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, 'wojciech baby secret', (err, decodedToken) => {
            if (err) {
                console.log('Token is invalid')
                res.redirect('/login')
            } else {
                console.log(decodedToken)
                next();
            }
        })
    } else {
        res.redirect('/login')
    }
}

module.exports = {
    requireAuth
};