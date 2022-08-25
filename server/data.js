const express = require('express');
const mongoose = require('mongoose');

const spotify = require('./spotify');

BLACKPINK_ID = '41MozSoPIsD1dJM0CLPjZF'

async function test(){

    try{
        let accessToken = await spotify.getAccessToken();
        //let data = await spotify.getData(accessToken, 'artists', BLACKPINK_ID);
        await spotify.getData(accessToken, 'artists', BLACKPINK_ID, 'albums');
    }catch(error){
        console.error(error.message);
    }
    
}

module.exports = { test }