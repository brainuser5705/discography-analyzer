const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const artistSchema = new Schema({
    _id: String,
    name: String,
    picUrl: String,
    album_ids: [{
        type: String,
        ref: 'Album'
    }] // primitive array, array of SchemaTypes
});

module.exports = mongoose.model("Artist", artistSchema);