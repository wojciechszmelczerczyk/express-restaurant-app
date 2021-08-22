// for debugging purposes
const colors = require('colors')

const path = require('path');
const bcrypt = require("bcryptjs");

// jwt
const jwt = require('jsonwebtoken');

// mongoose
const User = require('../models/User');


// function for tokens
const maxAge = 3 * 24 * 60 * 60 // 3 days in seconds

const createToken = (id) => {
    return jwt.sign({
        id
    }, 'wojciech baby secret', {
        expiresIn: maxAge
    })
}

module.exports.signup_get = (req, res) => {
    res.render(path.join(__dirname, '../public/views', 'signup.ejs'));
}

module.exports.login_get = (req, res) => {
    res.render(path.join(__dirname, '../public/views', 'login.ejs'));
}

module.exports.signup_post = async (req, res) => {
    const {
        email,
        password
    } = req.body; // extract email and password from post request

    // creating salt and hash for password
    const salt = await bcrypt.genSalt();
    console.log(`this is salt: ${salt}`);
    const encodedPassword = await bcrypt.hash(password, salt)
    console.log(`this is hashed password: ${encodedPassword}`); 

    const user = new User({ email, password: encodedPassword});

    try {

        // token
        const token = createToken(currentUser.insertedId);
        console.log(`Token is ${token}`);
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: maxAge * 1000 // generate cookies
        });

        // store the token?
        user.token = token;

        const saved = await user.save();
        console.log(colors.red(`Saved user: ${saved}`));

        res.status(200).send({
            token,
            email: user.email,
        });
    } catch (error) {
        res.status(500).send({});
    }
}

module.exports.login_post = async (req, res) => {

    const {
        email,
        password
    } = req.body; // extract form values into email and password via destructurization 



    try {
        const user = await User.login(email, password);
        res.status(200).json({
            user: user._id
        });
    } catch (err) {
        res.status(401).json({});
    }

}