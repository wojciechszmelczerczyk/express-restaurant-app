const path = require('path');
const express = require('express');
const app = express();

//Routing
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));

})

app.get('/menu.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'menu.html'));

})

app.get('/gallery.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'gallery.html'));

})

app.get('/reservation.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'reservation.html'));

})

app.get('/about.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'about.html'));

})

app.get('/contact.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'contact.html'));

})

app.use('/static', express.static('public'));

app.listen(3000, () => {
    console.log("Server running at:http://127.0.0.1:3000");
});