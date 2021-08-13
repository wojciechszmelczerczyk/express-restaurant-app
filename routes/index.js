const path = require('path');
const express = require('express');
const {
    request
} = require('http');
const app = express();




function wrapper(app) {

    // listening on port 3000
    app.listen(3000, () => {
        console.log("Server running at:http://127.0.0.1:3000");
    });

    //template engine
    app.set('template engine', 'ejs');
    // app.set('view engine', 'ejs'); //whats the difference between line above and this?

    //malware for static files
    app.use('/static', express.static('public'));

    app.use(express.json());
    app.use(express.urlencoded({
        extended: true
    }));





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
                        // console.log(items);
                        res.render(path.join(__dirname, '../public/views', 'index.ejs'), {
                            name: [items[0].name, items[1].name, items[2].name, items[3].name],
                            price: [items[0].price, items[1].price, items[2].price, items[3].price],
                            description: [items[0].description, items[1].description, items[2].description, items[3].description]

                        });
                    }
                });



            }

        });
        // client.close(); //something wrong with ending connection 

    })



    app.get('/menu', (req, res) => {
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
                        res.render(path.join(__dirname, '../public/views', 'menu.ejs'), {
                            name: [items[0].name, items[1].name, items[2].name, items[3].name, items[4].name, items[5].name, items[6].name, items[7].name],
                            // name: items.forEach((item, i) => item[i].name), //optimalize this shit
                            price: [items[0].price, items[1].price, items[2].price, items[3].price, items[4].price, items[5].price, items[6].price, items[7].price],
                            description: [items[0].description, items[1].description, items[2].description, items[3].description, items[4].description, items[5].description, items[6].description, items[7].description]

                        });
                    }
                });



            }


        });


    })



    app.get('/gallery', (req, res) => {
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

                const gallery = db.collection('gallery'); // collection

                gallery.find({}).toArray((err, items) => { // find all items
                    if (err) {
                        console.log(err);
                    } else {
                        // console.log(items);
                        res.render(path.join(__dirname, '../public/views', 'gallery.ejs'), {
                            photo: items[0].url,

                        });
                    }
                });



            }
            // client.close(); //something wrong with ending connection 

        });

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
                            name: [items[0].name, items[1].name, items[2].name, items[3].name, items[4].name, items[5].name, items[6].name, items[7].name],

                        });
                    }
                });



            }
            // client.close(); //something wrong with ending connection 

        });

    })

    app.get('/your-order', (req, res) => {
        res.render(path.join(__dirname, '../public/views', 'your-order.ejs'))
    })




    app.post('/your-order', (req, res) => {
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

                const order = db.collection('order'); // collection

                order.insertOne({
                    name: req.body.from
                }) // insert one element
                // console.log(items);
                res.render(path.join(__dirname, '../public/views', 'your-order.ejs'), {
                    from: req.body.from,
                    to: req.body.to
                });





            }
            // client.close(); //something wrong with ending connection 

        });



    })






    app.get('/about', (req, res) => {
        res.render(path.join(__dirname, '../public/views', 'about.ejs'));

    })



    app.get('/contact', (req, res) => {
        res.render(path.join(__dirname, '../public/views', 'contact.ejs'));

    })
}
module.exports = wrapper;