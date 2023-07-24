import { useContext, useEffect, useRef } from 'react';
import { AlbumContext } from '../App';

import * as d3 from 'd3';
import { Album } from '../types/album';

function Graph(){

    // Using useRef in conjunction with useEffect because the svg element
    // is not needed for rerendering
    const graphRef = useRef(null);
    const graphWidth = 1000;
    const graphHeight = 500;

    const graphPadding = 10;
    const axSpacing = 0.125 // percentage

    const featureScale = d3.scaleLinear()
        .domain([0.0,1.0])
        .range([graphHeight - graphPadding, graphPadding]);

    const loudnessScale = d3.scaleLinear()
        .domain([-60, 0])
        .range([graphHeight - graphPadding, graphPadding]);

    var featureAxMkr = d3.axisRight(featureScale);
    var loudnessAxMkr = d3.axisRight(loudnessScale);

    const features = [
        "acousticness",
        "danceability",
        "energy", 
        "instrumentalness",
        "liveness",
        "loudness",
        "speechiness",
        "valence"
    ];

    const albums : Album[] = useContext(AlbumContext);

    // for each album
    // for each track
    // get the values of the features (in order)
    // plot them accordingly

    useEffect(() => {

        const svg = d3.select(graphRef.current);

        for (let i = 0; i < features.length; i++){
            svg.append("g")
                .attr("transform", "translate(" + (i*axSpacing)*graphWidth + ", 0)")
                .call((features[i]=="loudness")?loudnessAxMkr:featureAxMkr);
        }

        albums.forEach((album) => {
            for (let track of album.tracks
                
                ){

            }
        })

        

    }, [albums]);

    return (
        <svg ref={graphRef} width={graphWidth} height={graphHeight}>

        </svg>
    )

}

export default Graph;