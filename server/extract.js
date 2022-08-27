const express = require('express');
const mongoose = require('mongoose');

const spotify = require('./spotify');
const controller = require('./controller');

BLACKPINK_ID = '41MozSoPIsD1dJM0CLPjZF';

// higher level data processing, then adding it to the database

async function extractAllData(){

    // shared variable for spotify requests in inner functions
    var accessToken = await spotify.getAccessToken();
    // console.log(accessToken);

    async function getTrackFeatures(trackId){

        try{
            let features = await spotify.getData(accessToken, `audio-features/${trackId}`);
            
            // could do destructing operation instead 
            return {
                "acousticness": features.acousticness,
                "danceability": features.danceability,
                "energy": features.energy,
                "instrumentalness": features.instrumentalness,
                "liveness": features.liveness,
                "loudness": features.loudness,
                "speechiness": features.speechiness,
                "valence": features.valence
            }

        }catch(error){
            console.log(error.message);
        }

    }

    async function getTracks(albumID){

        let tracks = [];

        try{

            let tracksData = await spotify.getData(accessToken, `albums/${albumID}/tracks`);
            tracksData.map(track => {
                tracks.push({
                    "_id": track.id,
                    "name": track.name,
                    "features": getTrackFeatures(track.id)
                });
            });

            return tracks;

        }catch(error){
            console.error(error.message);
        }
    }

    async function getAlbums(){

        let albumIds = [];

        try{
            let albumsData= await spotify.getData(accessToken, `artists/${artistID}/albums`, "include_groups=single,album");
            albumsData.map(album => {
                controller.putAlbum({
                    "_id": album.id,
                    "name": album.name,
                    "pic_url": album.images[0].url,
                    "tracks": getTracks(album.id)
                });
                albumIds.push(album.id);
            });

            return albumsId;

        }catch(error){
            console.error(error.message);
        }
        
    }

    // get artist data
    function getArtistData(artistId){

        try{
            let artistData = await spotify.getData(accessToken, `artists/${artistID}`);
            // call database controller function
            controller.putArtist({
                "_id": artistId,
                "name": artistData.name,
                "pic_url": artistData.images[0].url,
                "albums": getAlbums(artistId)
            });

        }catch(error){
            console.log(`Error getting artist data: ${error.message}`);
        }

    }

    // the sequence of calls to extract all the data

    // // for each artist id
    // artistIds.map(artistId => {

    //     // get artist data
    //     getArtistData(artistId)
    //     .then((artistIds) => {
    //         artistIds.map(artistId => getAlbums(artistId)
    //         .then((albumIds) => { 
    //             albumIds.map(albumId => getTracks(albumId));
    //         }));
    //     }).catch((error) => {
    //         console.error(`Error extracting data: ${error.message}`);
    //     })
    // });
    

}

extractAllData();

// module.exports = { extractAllData }