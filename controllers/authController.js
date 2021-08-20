const path = require('path');
const bcrypt = require("bcryptjs");

// jwt
const jwt = require('jsonwebtoken');



// database
const mongo = require('mongodb');
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
            console.log(`this is salt: ${salt}`);
            password = await bcrypt.hash(password, salt)
            console.log(`this is hashed password: ${password}`);

            // save email and hashed password in db
            const currentUser = await user.insertOne({
                email,
                password,
            })

            console.log(`Inserted ID: ${currentUser.insertedId}`);



            // const currentUser = await user.findOne({ // get access to id of current user 
            //     password
            // });

            // console.log(`Current user password: ${currentUser.password}`)

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
        // res.status(201).json({
        //     user: user2._id 
        // });
    });
}

module.exports.login_post = async (req, res) => {

    // const {
    //     email,
    //     password
    // } = req.body;

    // console.log(email, password)

    res.send('new login');
}