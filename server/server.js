require("dotenv").config({ path: "./config.env" });

const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const auth = require('./authentication');

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

async function test(){

    try{
        let accessToken = await auth.getAccessToken();
        console.log(accessToken);
        let data = await auth.getData(accessToken, 'artists', '0TnOYISbd1XYRBk9myaseg');
        console.log(data);
    }catch(error){
        console.error(error.message);
    }
    
}

test();