const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const artistSchema = new Schema({
    name: String,
    pic_url: String,
    albums: [ObjectId] // primitive array, array of SchemaTypes
});

module.exports = mongoose.model("Artist", artistSchema);