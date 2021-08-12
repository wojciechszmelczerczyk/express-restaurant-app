function getDB() {
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




        }
        // client.close(); //something wrong with ending connection 

    });
}

module.exports = getDB;