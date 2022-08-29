const express = require('express');
const controller = require('./controller');
const router = express.Router();

router.get('/artist/:artistId', controller.getArtist);

router.get('/album/:albumId', controller.getAlbum);

module.exports = router