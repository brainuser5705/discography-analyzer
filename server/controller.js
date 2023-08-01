const Artist = require('./schemas/Artist');
const Album = require('./schemas/Album');

const extract = require('./extract');

async function postArtist(req, res) {
    const { artistId } = req.body;

    var newArtist = await extract.fetchArtist(artistId);
    console.log("newArtist: " + newArtist);
    switch (newArtist){
        case 1:
            console.log("Successfully added artist " + artistId);
            return res.status(200).json(newArtist);
        case 2:
            console.log()
            return res.status(409).json({ error: `Artist id ${artistId} already in database, updating instead.` })
        case -1:
            console.log("No such artist")
            return res.status(406).json({ error: `No such artist with id ${artistId}` });
    }

}

async function getArtist(req, res) {

    // destructing assignment
    const { artistId } = req.params;

    const artist = await Artist.findById(artistId);

    if (!artist) {
        return res.status(460).json({ error: "No such artist" });
    }

    return res.status(200).json(artist);
}

async function getAlbum(req, res) {

    const { albumId } = req.params;

    const album = await Album.findById(albumId);

    if (!album) {
        return res.status(400).json({ error: "No such album" });
    }

    return res.status(200).json(album);
}

module.exports = { getArtist, getAlbum, postArtist }