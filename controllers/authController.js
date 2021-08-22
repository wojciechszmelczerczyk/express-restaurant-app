const colors = require('colors');
const path = require('path');
const bcrypt = require("bcryptjs");

// jwt
const jwt = require('jsonwebtoken');

// mongodb
const mongo = require('mongodb');
const express = require('express');
const client = new mongo.MongoClient('mongodb://localhost:27017', { // connect to mongodb
    useNewUrlParser: true
});



// function for tokens
const maxAge = 3 * 24 * 60 * 60 // 3 days in seconds

const createToken = (id) => {
    return jwt.sign({
        id
    }, 'wojciech baby secret', {
        expiresIn: maxAge
    })
}

// function for logging the user

const login = async (email, password) => {
    client.connect(async (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Connected to the database');

            const db = client.db('MammaMia');

            const user = db.collection('user');

            const thisUser = await user.findOne({
                email
            });
            console.log(colors.bgMagenta(thisUser._id));
            if (thisUser) {
                const auth = await bcrypt.compare(password, thisUser.password) // comparing hashed password with user log in with hashed password in db
                console.log(colors.bgBlue(`Authentication: ${auth}`));
                if (auth) {
                    return thisUser;
                }
                throw Error('Incorrect password')
            } else {
                throw Error('Incorrect email');
            }



        }

    });
}

module.exports.signup_get = (req, res) => {
    res.render(path.join(__dirname, '../public/views', 'signup.ejs'));
}

module.exports.login_get = (req, res) => {
    res.render(path.join(__dirname, '../public/views', 'login.ejs'));
}

module.exports.signup_post = async (req, res) => {

    let {
        email,
        password
    } = req.body; // extract email and password from post request


    client.connect(async (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Connected to the database');

            const db = client.db('MammaMia');

            const user = db.collection('user');

            // creating salt and hash for password
            const salt = await bcrypt.genSalt();
            password = await bcrypt.hash(password, salt)

            // save email and hashed password in db
            const currentUser = await user.insertOne({
                email,
                password,
            })



            // token
            const token = createToken(currentUser.insertedId);
            console.log(`Token is ${token}`);
            res.cookie('jwt', token, {
                httpOnly: true,
                maxAge: maxAge * 1000 // generate cookies
            });

            res.status(201).json({ // working but i have to do research
                currentUser: currentUser.insertedId
            })


        }

    });
}

module.exports.login_post = async (req, res) => {

    const {
        email,
        password
    } = req.body; // extract form values into email and password via destructurization 

    try {
        login(email, password) // function which compare data from login form with db data
        const token = createToken(thisUser._id); //TODO: no access to this variable outside the login function, come up with some solution

        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: maxAge * 1000 // generate cookies
        });
        res.status(200).json({
            thisUser: thisUser._id //TODO: no access to this variable outside the login function, come up with some solution
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({});
    }

}