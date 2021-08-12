const path = require('path');
const express = require('express');
const {
    MongoClient
} = require('mongodb');
const app = express();




function wrapper(app) {

    // listening on port 3000
    app.listen(3000, () => {
        console.log("Server running at:http://127.0.0.1:3000");
    });

    //malware for static files
    app.use('/static', express.static('public'));

    //template engine
    app.set('template engine', 'ejs');

    //routing
    app.get('/', (req, res) => {

        const mongo = require('mongodb');
        const client = new mongo.MongoClient('mongodb://localhost:27017', { // connect to mongodb
            useNewUrlParser: true
        });

        client.connect((err) => { // connect to mongodb
            if (err) {
                console.log(err); // if error, print it
            } else {
                console.log('Connected to the database'); // connected to the database

                const db = client.db('MammaMia'); // get db

                const menu = db.collection('menu'); // collection

                menu.find({}).toArray((err, items) => { // find all items
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(items);
                        res.render(path.join(__dirname, '../public/views', 'index.ejs'), {
                            name: [items[0].name, items[1].name],
                            price: [items[0].price, items[1].price],
                            description: [items[0].description, items[1].description]

                        });
                    }
                });



            }
            // client.close(); //something wrong with ending connection 

        });
    })



    app.get('/menu', (req, res) => {
        res.render(path.join(__dirname, '../public/views', 'menu.ejs'));

    })



    app.get('/gallery', (req, res) => {
        res.render(path.join(__dirname, '../public/views', 'gallery.ejs'));
    })



    app.get('/order', (req, res) => {
        const mongo = require('mongodb');
        const client = new mongo.MongoClient('mongodb://localhost:27017', { // connect to mongodb
            useNewUrlParser: true
        });

        client.connect((err) => { // connect to mongodb
            if (err) {
                console.log(err); // if error, print it
            } else {
                console.log('Connected to the database'); // connected to the database

                const db = client.db('MammaMia'); // get db

                const menu = db.collection('menu'); // collection

                menu.find({}).toArray((err, items) => { // find all items
                    if (err) {
                        console.log(err);
                    } else {
                        // console.log(items);
                        res.render(path.join(__dirname, '../public/views', 'order.ejs'), {
                            name: [items[0].name, items[1].name],

                        });
                    }
                });



            }
            // client.close(); //something wrong with ending connection 

        });

    })

    app.get('/your-order', (req, res) => {
        res.render(path.join(__dirname, '../public/views', 'your-order.ejs'));
    })

    app.post('/your-order', (req, res) => {
        console.log(req.query);
        res.send('POST request to homepage')

        // res.redirect('/order');
    })

    app.get('/about', (req, res) => {
        res.render(path.join(__dirname, '../public/views', 'about.ejs'));

    })



    app.get('/contact', (req, res) => {
        res.render(path.join(__dirname, '../public/views', 'contact.ejs'));

    })
}
module.exports = wrapper;