import { useContext, useEffect, useRef } from 'react';
import { AlbumContext } from '../App';

import * as d3 from 'd3';
import { Album } from '../types/album';
import { Track } from '../types/track';

function Graph(){

    // Using useRef in conjunction with useEffect because the svg element
    // is not needed for rerendering
    const graphRef = useRef(null);
    const graphWidth = 1000;
    const graphHeight = 500;

    const graphPadding = 10;
    const axSpacing = 0.125 // percentage

    const noTrackSelected = "No track selected";

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
        // "loudness",
        "speechiness",
        "valence"
    ];

    const context = useContext(AlbumContext);

    // for each album
    // for each track
    // get the values of the features (in order)
    // plot them accordingly

    useEffect(() => {

        const svg = d3.select(graphRef.current);

        for (let i = 0; i < features.length; i++){
            svg.append("g")
                .attr("transform", "translate(" + (i*axSpacing)*graphWidth + ", 0)")
                // .call((features[i]=="loudness")?loudnessAxMkr:featureAxMkr);
                .call(featureAxMkr);
        }

        context.albums.forEach((album : Album) => {
            // choose a color for each album
            for (let track of album.tracks){

                const trackGroup = svg.append("g").attr("class", "group_" + album._id);

                trackGroup.selectAll("circle").data(features).enter()
                    .append("circle")
                    .attr("r", 10)
                    .attr("fill", "gray")
                    .attr("cx", (_d,i)=>(i*axSpacing)*graphWidth)
                    // .attr("cy", (d)=>(d=="loudness")?featureScale(track.features[d]));
                    .attr("cy", (d)=>featureScale(track.features[d]));

                // need to define generic, default is [number, number]
                var lnMkr = d3.line<string>()
                    .x((_d,i)=>(i*axSpacing)*graphWidth)
                    .y(d=>featureScale(track.features[d]));

                
                trackGroup.append("path")
                    .attr("fill", "none")
                    .attr("stroke", "gray")
                    // .attr("stroke-width", 10)
                    .attr("d", lnMkr(features));

                //@ts-ignore
                trackGroup.on("mouseenter", () => { 
                    trackGroup.selectAll("circle").data([]).exit().attr("fill", "red");
                    trackGroup.selectAll("path").data([]).exit().attr("stroke", "red");    
                    d3.select("#selected-track").text(track.name);
                    console.log(track.album._id);
                    d3.select("#album_" + track.album._id).style("color", "red");
                });

                //@ts-ignore
                trackGroup.on("mouseout", () => {
                    trackGroup.selectAll("circle").data([]).exit().attr("fill", "gray");
                    trackGroup.selectAll("path").data([]).exit().attr("stroke", "gray");
                    d3.select("#selected-track").text(noTrackSelected);
                    d3.select("#album_" + track.album._id).style("color", "gray");
                });    

            }
        })

    }, [context.finished]);

    return (
        <div>
            <div id="selected-track">{ noTrackSelected }</div>
            <svg ref={graphRef} width={graphWidth} height={graphHeight}>

            </svg>
        </div>
    );
        
}

export default Graph;