const colors = require('colors');
const path = require('path');
const bcrypt = require("bcryptjs");

// jwt
const jwt = require('jsonwebtoken');

// mongodb
const mongo = require('mongodb');
const express = require('express');
const client = new mongo.MongoClient('mongodb://localhost:27017', {
    useNewUrlParser: true
});



// function for tokens
const maxAge = 3 * 24 * 60 * 60

const createToken = (id) => {
    return jwt.sign({
        id
    }, 'wojciech baby secret', {
        expiresIn: maxAge
    })
}

// function for error handling

const handleErrors = (err) => {
    // console.log(err.message, err.code)
    let errors = {
        email: '',
        password: ''
    }

    // validation errors
    if (err.code === 11000) {
        errors.email = 'Unique email violation'
    } else if (err.code === 121) {
        errors.email = 'Please enter email which match pattern'
    }


    // incorrect email
    if (err.message === 'Incorrect email') {
        errors.email = 'Incorrect email'
    }

    // incorrect password
    if (err.message === 'Incorrect password') {
        errors.password = 'Incorrect password'
    }

    return errors;
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
    } = req.body;


    client.connect(async (err) => {
        if (err) {
            console.log(err);
        } else {
            try {

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
                res.cookie('jwt', token, {
                    httpOnly: true,
                    maxAge: maxAge * 1000
                });

                res.status(201).json({
                    currentUser: currentUser.insertedId
                })

            } catch (err) {
                const errors = handleErrors(err);
                // console.log(colors.bgBlue(errors));
                res.status(400).json({
                    errors
                })
            }
        }

    });
}

module.exports.login_post = async (req, res) => {

    const {
        email,
        password
    } = req.body;

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
            try {
                if (thisUser) {
                    const auth = await bcrypt.compare(password, thisUser.password)
                    if (auth) {

                        const token = await createToken(thisUser._id);

                        res.cookie('jwt', token, {
                            httpOnly: true,
                            maxAge: maxAge * 1000
                        });
                        res.status(200).json({
                            thisUser: thisUser._id
                        });

                    }
                    throw Error('Incorrect password')
                } else {
                    throw Error('Incorrect email');
                }
            } catch (err) {
                const errors = handleErrors(err);
                res.status(400).json({
                    errors
                })
            }

        }

    })
}

// logout function
module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', {
        maxAge: 1
    })
    res.redirect('/');
}