const mongo = require('mongodb');
const express = require('express');
const client = new mongo.MongoClient('mongodb://localhost:27017', { // connect to mongodb
    useNewUrlParser: true
});
const path = require('path');
// const {
//     start
// } = require('repl');

const mammaMiaHome = (req, res) => {
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
                    res.render(path.join(__dirname, '../public/views', 'index.ejs'), {
                        name: [items[0].name, items[1].name, items[2].name, items[3].name], // optimalize with foreach
                        price: [items[0].price, items[1].price, items[2].price, items[3].price], // optimalize with foreach
                        description: [items[0].description, items[1].description, items[2].description, items[3].description] // optimalize with foreach

                    });
                }
            });
        }

    });
}

const mammaMiaMenu = (req, res) => {
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
                    res.render(path.join(__dirname, '../public/views', 'menu.ejs'), {
                        name: [items[0].name, items[1].name, items[2].name, items[3].name, items[4].name, items[5].name, items[6].name, items[7].name], //optimalize with foreach
                        price: [items[0].price, items[1].price, items[2].price, items[3].price, items[4].price, items[5].price, items[6].price, items[7].price], //optimalize with foreach
                        description: [items[0].description, items[1].description, items[2].description, items[3].description, items[4].description, items[5].description, items[6].description, items[7].description] //optimalize with foreach

                    });
                }
            });
        }
    });
}

const mammaMiaGallery = (req, res) => {
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
                    res.render(path.join(__dirname, '../public/views', 'gallery.ejs'), {
                        // photo: encodeURIComponent(items[0].url),

                    });
                }
            });
        }
    });
}

const mammaMiaOrder = (req, res) => {
    client.connect((err) => { // connect to mongodb
        if (err) {
            console.log(err); // if error, print it
        } else {
            console.log('Connected to the database'); // connected to the database

            const db = client.db('MammaMia'); // get db

            const menu = db.collection('menu'); // collection
            // const ingredients = db.collection('ingredients'); // collection

            menu.find({}).toArray((err, items) => { // find all items
                if (err) {
                    console.log(err);
                } else {
                    res.render(path.join(__dirname, '../public/views', 'order.ejs'), {
                        name: [items[0].name, items[1].name, items[2].name, items[3].name, items[4].name, items[5].name, items[6].name, items[7].name], //optimalize with foreach
                        ingredients: [items[0].ingredients[0], items[0].ingredients[1], items[0].ingredients[2], items[0].ingredients[3]],
                    });
                }
            });

        }
    });
}

const mammaMiaYourOrderGet = (req, res) => {
    client.connect(async (err) => {
        if (err) {
            console.log(err);
        } else {

            console.log('Connected to the database');

            const db = client.db('MammaMia');

            const order = db.collection('order');

            // total number of records from database
            let total = await order.countDocuments();


            // console.log(total);

            let perPage = 5;

            let pages = Math.ceil(total / perPage);

            let pageNumber = (req.query.page == null) ? 1 : req.query.page;
            let startFrom = (pageNumber - 1) * perPage;

            order.find({}).sort({
                "id": -1
            }).skip(startFrom).limit(perPage).toArray((err, items) => {
                if (err) {
                    console.log(err);
                } else {
                    res.render(path.join(__dirname, '../public/views', 'your-order.ejs'), {
                        names: items,
                        pages: pages

                    });
                }
            })

        }
    });
}

const mammaMiaYourOrderPost = (req, res) => {
    client.connect((err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Connected to the database');

            const db = client.db('MammaMia');

            const order = db.collection('order');
            order.insertOne({
                name: req.body.to,
                // price: order.
                ingredients: req.body.to2 // working
            })
            res.redirect('/your-order');

        }
    });
}

const mammaMiaYourOrderGetSingle = (req, res) => {
    const id = req.params.id; //extract id parameter
    client.connect((err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Connected to the database');

            const db = client.db('MammaMia');

            const order = db.collection('order');

            order.findOne({
                    _id: mongo.ObjectId(id)
                })
                .then(result => {
                    if (result) {
                        res.render(path.join(__dirname, '../public/views', 'details.ejs'), {
                            pizza: result
                        });
                    } else {
                        console.log(`No documents matches the provided query`)

                    }
                })
                .catch(err => console.log(`Failed to find document: ${err}`));


        }
    });
}

const mammaMiaYourOrderDelete = (req, res) => {
    const id = req.params.id;
    client.connect((err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Connected to the database');

            const db = client.db('MammaMia');

            const order = db.collection('order');

            order.findOneAndDelete({
                    _id: mongo.ObjectId(id)
                })
                .then(result => {
                    res.json({
                        redirect: '/your-order'
                    })
                })
                .catch(err => console.log(err));


        }
    });

}

const mammaMiaAbout = (req, res) => {
    res.render(path.join(__dirname, '../public/views', 'about.ejs'));
}

const mammaMiaContact = (req, res) => {
    res.render(path.join(__dirname, '../public/views', 'contact.ejs'));
}

const mammaMia404 = (req, res) => {
    res.status(404).render(path.join(__dirname, '../public/views', '404.ejs'));
}

module.exports = {
    mammaMiaHome,
    mammaMiaMenu,
    mammaMiaGallery,
    mammaMiaOrder,
    mammaMiaYourOrderGet,
    mammaMiaYourOrderPost,
    mammaMiaAbout,
    mammaMiaContact,
    mammaMia404,
    mammaMiaYourOrderGetSingle,
    mammaMiaYourOrderDelete
}