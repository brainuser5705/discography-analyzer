import PropTypes from 'prop-types';
import { useState } from 'react';

import { Track } from '../types/track';
import { Album } from '../types/album';

type SelectedTrackProps = {
    id: string
}

function SelectedTrack(props : SelectedTrackProps){

    const [track, setTrack] = useState<Track>({
        _id: "",
        name: "",
        album: null,
        features : {
            acousticness: 0,
            danceability: 0,
            energy: 0,
            instrumentalness: 0,
            liveness: 0,
            loudness: 0,
            speechiness: 0,
            valence: 0
        }
    });

    return;
    
}

export default SelectedTrack;

SelectedTrack.propTypes = {
    id: PropTypes.string,
}