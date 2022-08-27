// create documents and put into database
// - artist
// - album
// - track

// add an additional album or track to an artist
// update specific track features?


// general - enter in database then decide whether to create or update?

const mongoose = require('./mongoose');

const Artist = require('./schemas/Artist');
const Album = require('./schemas/Album');

async function putAlbum(albumData){
    // check if album already exists
    return Album.create(albumData);
}

async function getArtist(artistId){
    return Artist.findById(artistId);
}

async function putArtist(artistData){
    
    // check if I should update the artist?

    Artist.create(artistData);

    // will need to save it?

}

module.exports = { putArtist, getArtist }