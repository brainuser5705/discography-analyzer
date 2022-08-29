const Artist = require('./schemas/Artist');
const Album = require('./schemas/Album');

async function getArtist(req, res){

    // destructing assignment
    const { artistId } = req.params;

    const artist = await Artist.findById(artistId);

    if (!artist){
        return res.status(400).json({error: "No such artist"});
    }

    return res.status(200).json(artist);
}

async function getAlbum(req, res){

    const { albumId } = req.params;

    const album = await Album.findById(albumId);

    if (!album){
        return res.status(400).json({error: "No such album"});
    }
    
    return res.status(200).json(album);
}

module.exports = { getArtist, getAlbum }