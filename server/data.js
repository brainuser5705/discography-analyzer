const express = require('express');
const mongoose = require('mongoose');

const spotify = require('./spotify');

const Artist = require('./schemas/Artist');
const Album = require('./schemas/Album');

BLACKPINK_ID = '41MozSoPIsD1dJM0CLPjZF';
VANISHING_GIRL_ID = '0z5Sp5kPFConDlXjb0V9vJ'

// higher level data processing, then adding it to the database

async function extractAllData(){

    // shared variable for spotify requests in inner functions
    var accessToken = await spotify.getAccessToken();
    // console.log(accessToken);
    
    async function getTrackFeatures(trackId){

        console.log("Getting track features");

        try{
            let features = await spotify.getFullData(accessToken, `audio-features/${trackId}`);
            
            // could do destructing operation instead
            // return ({ acousticness, danceability, energy, instrumentalness, liveness, loudness, speechiness, valence }) => ({ acousticness, danceability, energy, instrumentalness, liveness, loudness, speechiness, valence })(features);

            return ({ 
                "acousticness": features.acousticness,
                "danceability": features.danceability,
                "energy": features.energy,
                "instrumentalness": features.instrumentalness,
                "liveness": features.liveness,
                "loudness": features.loudness,
                "speechiness": features.speechiness,
                "valence": features.valence
            });

        }catch(error){
            console.log(`Error getting track feature data: ${error.message}`);
        }

    }

    async function getTracks(albumId){

        console.log("Getting tracks");

        try{

            let tracks = [];

            let tracksData = await spotify.getItemData(accessToken, `albums/${albumId}/tracks`);
            
            tracksData.map(async (track) => {

                features = await getTrackFeatures(track.id);

                tracks.push({
                    "_id": track.id,
                    "name": track.name,
                    "features": features
                });
            });

            return tracks;

        }catch(error){
            console.error(`Error getting track data: ${error.message}`);
        }
    }

    async function getAlbums(artistId){

        console.log("Getting albums");

        try{

            let albumIds = [];

            let albumsData= await spotify.getItemData(accessToken, `artists/${artistId}/albums`, "include_groups=single,album");

            albumsData.map(async (album) => {

                await Album.deleteOne({"_id" : album.id});

                if (!(await Album.exists({"_id": album.id}))){

                    let tracks = await getTracks(album.id);
                    console.log("Tracks: " + tracks);

                    await Album.create({
                        "_id": album.id,
                        "name": album.name,
                        "pic_url": album.images[0].url,
                        "tracks": tracks
                    });

                    console.log("Created album!");
                    albumIds.push(album.id);
                    console.log("Pushed album to album ids: " + albumIds)

                }else{
                    console.log("Album already exists.");
                }

            });

            return albumIds;

        }catch(error){
            console.error(`Error getting album data: ${error.message}`);
        }
        
    }

    // get artist data
    async function getArtistData(artistId){

        console.log("Getting artist");
        
        await Artist.deleteOne({"_id" : artistId});

        try{

            if (!(await Artist.exists({"_id" : artistId}))){

                let artistData = await spotify.getFullData(accessToken, `artists/${artistId}`);

                await getAlbums(artistId).then(async (albums) => {
                    Artist.create({
                        "_id": artistId,
                        "name": artistData.name,
                        "pic_url": artistData.images[0].url,
                        "albums": albums
                    });

                    console.log("Created artist!");
                });
                
            }else{  
                console.log("Artist already exists. Updating instead:");
                await getAlbums(artistId).then(async (albums) => {
                    await Artist.updateOne({"_id": artistId}, {"$push": {"albums": albums}});
                });
            }

        }catch(error){
            console.log(`Error getting artist data: ${error.message}`);
        }

    }

    await getArtistData(VANISHING_GIRL_ID);

}

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    extractAllData()
})
.catch((error) => {
    console.error(`Error extracting: ${error}`);
});

// module.exports = { extractAllData }