const path = require('path');
const express = require('express');
const app = express();




function wrapper(app) {

    app.listen(3000, () => {
        console.log("Server running at:http://127.0.0.1:3000");
    });

    //malware for static files
    app.use('/static', express.static('public'));

    //routing
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'public/index.html'));
    })

    app.get('/menu.html', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'public/menu.html'));

    })

    app.get('/gallery.html', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'public/gallery.html'));

    })

    app.get('/reservation.html', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'public/reservation.html'));

    })

    app.get('/about.html', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'public/about.html'));

    })

    app.get('/contact.html', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'public/contact.html'));

    })
}
module.exports = wrapper;