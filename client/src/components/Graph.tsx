import { useContext, useEffect, useRef } from 'react';
import { AlbumContext } from '../App';

import * as d3 from 'd3';

function Graph(){

    // Using useRef in conjunction with useEffect because the svg element
    // is not needed for rerendering
    const graphRef = useRef(null);
    const graphWidth = 1000;
    const graphHeight = 500;

    const albums = useContext(AlbumContext);

    // for each album
    // for each track
    // get the values of the features (in order)
    // plot them accordingly

    useEffect(() => {

        const svg = d3.select(graphRef.current);



    }, [albums]);

    return (
        <svg ref={graphRef} width={graphWidth} height={graphHeight} style="background: lightgray;">

        </svg>
    )

}

export default Graph;