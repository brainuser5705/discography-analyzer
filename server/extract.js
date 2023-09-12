const mongoose = require('mongoose');

const spotify = require('./spotify');

const Artist = require('./schemas/Artist');
const Album = require('./schemas/Album');

BLACKPINK_ID = '41MozSoPIsD1dJM0CLPjZF';
VANISHING_GIRL_ID = '0z5Sp5kPFConDlXjb0V9vJ'
NEW_JEANS_ID = '6HvZYsbFfjnjFrWF950C9d';
CLAIRO_ID = '3l0CmX0FuQjFxr8SK7Vqag';

async function extractData(artistId){

    var accessToken = await spotify.getAccessToken();

    function getTrackFeatures(trackId){

        return new Promise((resolve, reject) => {
            spotify.getFullData(accessToken, `audio-features/${trackId}`)
            .then((features) => {
                
                resolve({
                    "acousticness": features.acousticness,
                    "danceability": features.danceability,
                    "energy": features.energy,
                    "instrumentalness": features.instrumentalness,
                    "liveness": features.liveness,
                    "loudness": features.loudness,
                    "speechiness": features.speechiness,
                    "valence": features.valence               
                });
            })
            .catch((error) => {
                reject(`Error getting track features: ${error.message}`);
            })
        })
        
    }

    function getTracks(albumId){
        
        return new Promise((resolve, reject) => {
            let tracks = [];
            spotify.getItemData(accessToken, `albums/${albumId}/tracks`)
            .then(async (trackData) => {

                await Promise.all(trackData.map(async (track) => {

                    // trouble with the await keyword
                    let features = await getTrackFeatures(track.id);

                    tracks.push({
                        "_id": track.id,
                        "name": track.name,
                        "features": features
                    });
                }));
                
                resolve(tracks);
                 
            })
            .catch((error) => {
                reject(`Error getting track data: ${error.message}`);
            })
        })
        

    }

    function getAlbums(artistId){
        
        return new Promise((resolve, reject) => {
            let albumIds = [];
            spotify.getItemData(accessToken, `artists/${artistId}/albums`, "include_groups=single,album")
            .then(async (albumData) => {

                // need Promise.all because of map (array of promises)
                await Promise.all(albumData.map(async (album) => {
                    let albumDoc = await Album.exists({"_id": album.id});
                    if (!albumDoc){
                        
                        let tracks = await getTracks(album.id);

                        await Album.create({
                            "_id": album.id,
                            "name": album.name,
                            "picUrl": album.images[0].url,
                            "tracks": tracks
                        });
                    }
                    // else{
                    //     console.log(`Album ${album.id} already has document.`);
                    // }
                    albumIds.push(album.id);
                }));

                resolve(albumIds);

            })
            .catch((error) => {
                reject(`Error getting album data: ${error.message}`);
            })
        })
    
    }

    async function getArtist(artistId){
        // need to be a promise because we need to do something with the data when it's called
        return new Promise(async (resolve) => {
  
            let album_ids = await getAlbums(artistId);
            
            let artistDoc = await Artist.exists({"_id": artistId});
            if (!artistDoc){
    
                spotify.getFullData(accessToken, `artists/${artistId}`)
                .then(async (artistData) => {
                    await Artist.create({
                        "_id": artistId,
                        "name": artistData.name,
                        "picUrl": artistData.images[0].url,
                        "album_ids": album_ids
                    });
                    resolve(1);
                })
                .catch(async (error) => {
                    console.error(`Error extracting artist ${artistId}: ${error}`);
                    resolve(-1);
                });
    
            }else{
                console.log(`Artist ${artistId} already has document.`);
                // await Artist.updateOne({"_id": artistId}, {"$push": {"album_ids": album_ids}});
                resolve(2);
            }

        });
        
    }

//     // await Artist.deleteOne({"_id" : '0z5Sp5kPFConDlXjb0V9vJ'});
//     // await Album.deleteOne({"_id" : '0edYR0ydMBFJFt2OHwDrmt'});
//     await getArtist[BLACKPINK_ID];
//     await getArtist(VANISHING_GIRL_ID);
//     await getArtist(NEW_JEANS_ID);
//     await getArtist(CLAIRO_ID);
//     // need to be able to update the artist album lists
    
    return await getArtist(artistId);

}

async function fetchArtist(artistId) {
    // need to be a promise because we need to do something with the data when it's called
    return new Promise((resolve, reject) => {
        mongoose.connect(process.env.MONGODB_URI)
        .then(async () => {
            var result = await extractData(artistId);
            resolve(result);
        })
        .catch(() => {
            console.error("Error connecting to database");
            reject(false);
        });    
    });
}

module.exports = { fetchArtist }