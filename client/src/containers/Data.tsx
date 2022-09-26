import React, { useState } from 'react';
import { Track } from '../types/track';

function Data() {

    // number because they are linked together by the id
    const [selectedTracks, setSelectedTracks] = useState<number[]>([]);
    const [highlightedTrack, setHighlightedTrack] = useState<number>(0);
}

export default Data;