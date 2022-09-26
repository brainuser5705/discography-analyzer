require("dotenv").config({ path: "./config.env" });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors') // for cross-origin resource sharing

const app = express();
const port = process.env.PORT || 5000;

const routes = require('./routes');

app.use(express.json());
app.use(cors())

app.listen(port, () => {
    console.log(`Server is running: http://localhost:${port}`);

    // connect to database then use routes middleware
    mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        app.use('', routes);
    })
    .catch((error) => {
        console.error(`Error connecting to database: ${error.message}`);
    });

});