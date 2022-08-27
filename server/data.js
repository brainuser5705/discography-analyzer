const express = require('express');
const mongoose = require('mongoose');

const spotify = require('./spotify');

BLACKPINK_ID = '41MozSoPIsD1dJM0CLPjZF';

// higher level data processing, then adding it to the database

async function extractAllData(){

    // shared variable for spotify requests in inner functions
    var accessToken = await spotify.getAccessToken();
    console.log(accessToken);

    async function getTrackFeatures(trackID){

    }

    async function getTracks(albumID){

    }

    async function getAlbums(artistID){


        try{
            //let data = await spotify.getData(accessToken, 'artists', BLACKPINK_ID);
            let jsonData = await spotify.getData(accessToken, `artists/${artistID}/albums`, "include_groups=single,album");
            // console.log(jsonData);
            // parse the json for all the albums
        }catch(error){
            console.error(error.message);
        }
        
    }

    // get artist data

    getAlbums(BLACKPINK_ID);
    // the sequence of calls to extract all the data

    // getAlbums(BLACKPINK_ID)
    // .then((albums)=>{
    //     tracks = []
    //     for (var album of albums){
    //         tracks.push(getTracks());
    //     }
    //     return tracks;
    // })
    // .then((tracks)=>{
    //     // for each track, extract feature and put into database
    // });
    

}

extractAllData();

// module.exports = { extractAllData }