const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// tracks are subdocuments to albums
const trackSchema = new Schema({
    _id: String,
    name: String,
    features: {
        acousticness: Number,
        danceability: Number,
        energy: Number,
        instrumentalness: Number,
        liveness: Number,
        loudness: Number,
        speechiness: Number,
        valence: Number
    }
});

const albumSchema = new Schema({
    _id: String,
    name: String,
    pic_url: String,
    tracks: [trackSchema] // document array
});

module.exports = mongoose.model("Album", albumSchema);