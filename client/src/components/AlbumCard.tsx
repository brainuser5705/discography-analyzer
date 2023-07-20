import React, { ReactElement, useEffect, useState } from 'react';
import { Track } from '../types/track';
import PropTypes from 'prop-types';
import fetchAlbum from '../data/fetchAlbum';
import { Album } from '../types/album';

type AlbumProps = {
    id: string
}

function AlbumCard(props: AlbumProps) {

    // need to use state instead of initializing a local variable because
    // of the async function in useEffect which will run last
    const [album, setAlbum] = useState<Album>({
        _id: "",
        name: "testing",
        picUrl: "",
        tracks: [],
    });

    useEffect(() => {
        fetchAlbum(props.id)
        .then((data: Album) => {
            setAlbum(data);
        })
        .catch((error) => {
            console.log("Something went wrong: " + error);
        })
    }, []);

    const trackItems = album.tracks.map((track: Track) => {
        track.album = album;
        return <li key={track._id}>
        {track.name} - {track.features.energy} - {track.album.name}</li>;
    }
        // note - no brackets because that denotes function that returns void
        
    );

    return (
        <div className="album-card">
            <img src={album.picUrl} />
            <h2>{album.name}</h2>
            <h3>Number of tracks: {album.tracks.length}</h3>
            <ul>
                { trackItems }
            </ul>

        </div>
    );

}

export default AlbumCard;

AlbumCard.propTypes = {
    id: PropTypes.string,
}