require("dotenv").config({ path: "./config.env" });

const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

const mongoose = require('mongoose');

const data = require('./data');

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`); 
});

data.test();