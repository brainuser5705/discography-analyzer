import { useContext, useEffect, useRef } from 'react';
import { AlbumContext } from '../App';

import { Album } from '../types/album';

import * as d3 from 'd3';

function Graph(props) {

    const context = useContext(AlbumContext);

    const graphRef = useRef(null);
    const graphWidth = props.width;
    const graphHeight = props.height;
    // padding within the svg to make space for the labels/axes
    const graphPadding = 50;
    // spacing between each axis
    const axSpacing = 0.142857143;

    // Message to display when user has not selected track
    const noTrackSelectedString = "No track selected";

    const featureScale = d3.scaleLinear()
        .domain([0.0, 1.0])
        .range([graphHeight - graphPadding, graphPadding]);
    const featureAxMkr = d3.axisRight(featureScale);

    // const loudnessScale = d3.scaleLinear()
    //     .domain([-60, 0])
    //     .range([graphHeight - graphPadding, graphPadding]);
    // var loudnessAxMkr = d3.axisRight(loudnessScale);

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

    useEffect(() => {

        if (context.selectedFinished) {

            const svg = d3.select(graphRef.current);

            // reset the graph so re-renders don't overlay on top of each other
            svg.selectAll("g").remove();
            svg.selectAll("text").remove();

            // build the parallel coordinate graph axes
            for (let i = 0; i < features.length; i++) {
                svg.append("g")
                    .attr("transform", 
                        "translate(" + 
                        (i * axSpacing * graphWidth + 20) +
                        ", 0)")
                    // .call((features[i]=="loudness")?loudnessAxMkr:featureAxMkr);
                    .call(featureAxMkr);

                svg.append("text")
                    .text(features[i])
                    .attr("width", axSpacing)
                    .attr("x", (i * axSpacing * graphWidth + 20))
                    .attr("y", graphHeight - graphPadding)
                    .attr("dy", 40)
            }

            context.selectedAlbum.forEach((album: Album) => {

                // choose a color for each album
                for (let track of album.tracks) {

                    // ignore tracks that don't have any audio analysis
                    if (track.features) {
                        const trackGroup = svg.append("g")
                            .attr("class", "group_" + album._id)
                            .attr("id", "track_" + track._id);

                        // Plot the lines
                        var lnMkr = d3.line<string>()   // string generic since
                                                        // features are strings
                            .x((_d, i) => (i * axSpacing) * graphWidth + 20)
                            .y(d => featureScale(track.features[d]));

                        trackGroup.append("path")
                            .attr("fill", "none")
                            .attr("stroke", "gray")
                            .attr("opacity", "0.3")
                            .attr("d", lnMkr(features));

                        // Plot the dots
                        trackGroup.selectAll("circle").data(features).enter()
                            .append("circle")
                            .attr("r", 10)
                            .attr("fill", "gray")
                            .attr("opacity", "0.3")
                            .attr("cx", (_d, i) => 
                                (i * axSpacing) * graphWidth + 20)
                            .attr("cy", (d) => featureScale(track.features[d]));

                        //@ts-ignore
                        trackGroup.on("mouseenter", () => {
                            trackGroup.selectAll("circle").data([]).exit()
                                .attr("fill", "red")
                                .attr("opacity", "1.0");
                            trackGroup.selectAll("path").data([]).exit()
                                .attr("stroke", "red")
                                .attr("opacity", "1.0");
                            d3.select("#selected-track-name").text(track.name);
                            d3.select("#selected-track-img")
                                .attr("src", album.picUrl);

                            // change the selected track information
                            d3.select("#selected-track-features")
                                .selectAll("div").remove();
                            d3.select("#selected-track-features")
                                .selectAll("div").data(features).enter()
                                .append("div")
                                .text((d) => d + " - " + track.features[d]);

                            d3.select("#album_" + album._id)
                                .style("color", "red");
                        });

                        //@ts-ignore
                        trackGroup.on("mouseout", () => {
                            trackGroup.selectAll("circle").data([]).exit()
                                .attr("fill", "gray")
                                .attr("opacity", "0.3");
                            trackGroup.selectAll("path").data([]).exit()
                                .attr("stroke", "gray")
                                .attr("opacity", "0.3");
                            // d3.select("#selected-track-img")
                            //     .attr("src", "");    
                            d3.select("#selected-track-name")
                                .text(noTrackSelectedString);
                            d3.select("#album_" + album._id)
                                .style("color", "gray");
                            // d3.select("#selected-track-features")
                            //     .selectAll("div").remove();
                        });
                    }
                }

            });

        }

    }, [context.selectedFinished]);


    return (
        <div>
            <div className="item-display" id="selected-track">
                <img alt="" id="selected-track-img"/>
                <div className="content" id="selected-track-div">
                    <div className="name" id="selected-track-name">
                        {noTrackSelectedString}</div>
                    <div id="selected-track-features"></div>
                </div>
            </div>
            
            <svg ref={graphRef} width={graphWidth} height={graphHeight}></svg>
        </div>
    );

}

export default Graph;