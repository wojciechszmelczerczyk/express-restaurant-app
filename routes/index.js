const path = require('path');
// const express = require('express');
// const app = express();

//controller
const mammaMiaController = require('../controllers/mammaMiaController');


//database
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
        console.log("Server running at:http://127.0.0.1:3000");
    });

    //template engine
    app.set('template engine', 'ejs');
    // app.set('view engine', 'ejs'); //whats the difference between line above and this?

    //malware
    app.use('/static', express.static('public'));

    app.use(express.json());
    app.use(express.urlencoded({
        extended: true
    }));

    //routing
    app.get('/', mammaMiaController.mammaMiaHome);
    app.get('/menu', mammaMiaController.mammaMiaMenu);
    app.get('/gallery', mammaMiaController.mammaMiaGallery);
    app.get('/order', mammaMiaController.mammaMiaOrder)
    app.route('/your-order')
        .get(mammaMiaController.mammaMiaYourOrderGet)
        .post(mammaMiaController.mammaMiaYourOrderPost);
    app.get('/about', mammaMiaController.mammaMiaAbout);
    app.get('/contact', mammaMiaController.mammaMiaContact);


}
module.exports = wrapper;