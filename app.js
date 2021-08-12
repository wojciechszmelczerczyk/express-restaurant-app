const wrapper = require('./routes/index');
const express = require('express');
const app = express();
// const db = require('./db');

// db();
wrapper(app);