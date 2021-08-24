// cookie parser
const cookieParser = require('cookie-parser');

// controller
const mammaMiaController = require('../controllers/mammaMiaController');

// auth route
const authRoutes = require('./auth')

// auth middleware

const {
    requireAuth
} = require('../middleware/authMiddleware');

// database
const mongo = require('mongodb');
const express = require('express');
const client = new mongo.MongoClient('mongodb://localhost:27017', { // connect to mongodb
    useNewUrlParser: true
});

// port
const port = process.env.port || 3000;

function wrapper(app) {

    // listening on port 3000
    app.listen(port, () => {
        console.log(`Server running at:http://127.0.0.1:${port}`);
    });

    // template engine
    app.set('template engine', 'ejs');


    // middleware for static files
    app.use('/static', express.static('public'));

    app.use(express.json());
    app.use(express.urlencoded({
        extended: true
    }));
    // cookie middleware
    app.use(cookieParser());

    // routing
    app.get('/', mammaMiaController.mammaMiaHome);
    app.get('/menu', mammaMiaController.mammaMiaMenu);
    app.get('/gallery', mammaMiaController.mammaMiaGallery);
    app.get('/order', requireAuth, mammaMiaController.mammaMiaOrder)
    app.route('/your-order')
        .get(mammaMiaController.mammaMiaYourOrderGet)
        .post(mammaMiaController.mammaMiaYourOrderPost);
    app.get('/your-order/:id', mammaMiaController.mammaMiaYourOrderGetSingle); // get single order
    app.delete('/your-order/:id', mammaMiaController.mammaMiaYourOrderDelete) // delete single order
    app.get('/about', mammaMiaController.mammaMiaAbout);
    app.get('/contact', mammaMiaController.mammaMiaContact);
    app.use(authRoutes); // auth routing

    app.use(mammaMiaController.mammaMia404) // 404 not found

}
module.exports = wrapper;