import { useState } from 'react';
import PropTypes from 'prop-types';

import { Track } from '../types/track';
import { Album } from '../types/album';

type AlbumProps = {
    album : Album
}

function AlbumCard(props: AlbumProps) {

    // need to use state instead of initializing a local variable because
    // of the async function in useEffect which will run last

    const trackItems = props.album.tracks.map((track: Track) => {
        track.album = props.album;
        return <li key={track._id}>
            {track.name} - {track.features.energy} - {track.album.name}</li>;
    }
        // note - no brackets because that denotes function that returns void
        
    );

    return (
        <div className="album-card">
            <img src={props.album.picUrl} />
            <h2>{props.album.name}</h2>
            <h3>Number of tracks: {props.album.tracks.length}</h3>
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