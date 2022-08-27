const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const artistSchema = new Schema({
    _id: String,
    name: String,
    pic_url: String,
    albums: [String] // primitive array, array of SchemaTypes
});

module.exports = mongoose.model("Artist", artistSchema);