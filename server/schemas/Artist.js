const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const artistSchema = new Schema({
    _id: String,
    name: String,
    pic_url: String,
    albums: [{
        type: String,
        ref: 'Album'
    }] // primitive array, array of SchemaTypes
});

module.exports = mongoose.model("Artist", artistSchema);