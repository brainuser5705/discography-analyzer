import { useContext, useEffect, useRef } from 'react';
import { AlbumContext } from '../App';

import * as d3 from 'd3';
import { Album } from '../types/album';

function Graph(props) {

    const context = useContext(AlbumContext);

    // Using useRef in conjunction with useEffect because the svg element
    // is not needed for rerendering
    const graphRef = useRef(null);
    const graphWidth = props.width;
    const graphHeight = props.height;

    const graphPadding = 50;
    const axSpacing = 0.142857143;

    const noTrackSelected = "No track selected";

    const featureScale = d3.scaleLinear()
        .domain([0.0, 1.0])
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

    // for each album
    // for each track
    // get the values of the features (in order)
    // plot them accordingly

    useEffect(() => {

        if (context.finished) {

            const svg = d3.select(graphRef.current).attr("transform", "translate(0,0)");

            svg.selectAll("g").remove();
            svg.selectAll("text").remove();

            for (let i = 0; i < features.length; i++) {
                svg.append("g")
                    .attr("transform", "translate(" + (i * axSpacing * graphWidth + 20) + ", 0)")
                    // .call((features[i]=="loudness")?loudnessAxMkr:featureAxMkr);
                    .call(featureAxMkr);

                svg.append("text")
                    .text(features[i])
                    .attr("width", axSpacing)
                    .attr("x", (i * axSpacing * graphWidth + 20)).attr("y", graphHeight - graphPadding)
                    .attr("dy", 40)

            }

            context.selectedAlbums.forEach((album: Album) => {
                // choose a color for each album
                for (let track of album.tracks) {

                    // some tracks don't have features
                    if (track.features) {
                        const trackGroup = svg.append("g")
                            .attr("class", "group_" + album._id)
                            .attr("id", "track_" + track._id);

                        // need to define generic, default is [number, number]
                        var lnMkr = d3.line<string>()
                            .x((_d, i) => (i * axSpacing) * graphWidth + 20)
                            .y(d => featureScale(track.features[d]));

                        trackGroup.append("path")
                            .attr("fill", "none")
                            .attr("stroke", "gray")
                            .attr("opacity", "0.3")
                            // .attr("stroke-width", 10)
                            .attr("d", lnMkr(features));

                        trackGroup.selectAll("circle").data(features).enter()
                            .append("circle")
                            .attr("r", 10)
                            .attr("fill", "gray")
                            .attr("opacity", "0.3")
                            .attr("cx", (_d, i) => (i * axSpacing) * graphWidth + 20)
                            // .attr("cy", (d)=>(d=="loudness")?featureScale(track.features[d]));
                            .attr("cy", (d) => featureScale(track.features[d]));

                        //@ts-ignore
                        trackGroup.on("mouseenter", () => {
                            trackGroup.selectAll("circle").data([]).exit()
                                .attr("fill", "red")
                                .attr("opacity", "1.0");
                            trackGroup.selectAll("path").data([]).exit()
                                .attr("stroke", "red")
                                .attr("opacity", "1.0");
                            d3.select("#selected-track").text(track.name);
                            d3.select("#selected-track-img").attr("src", album.picUrl);
                            d3.select("#selected-track-features")
                                .selectAll("li").data(features).enter()
                                .append("li")
                                .text((d) => d + " - " + track.features[d]);
                            d3.select("#album_" + album._id).style("color", "red");
                        });

                        //@ts-ignore
                        trackGroup.on("mouseout", () => {
                            trackGroup.selectAll("circle").data([]).exit()
                                .attr("fill", "gray")
                                .attr("opacity", "0.3");
                            trackGroup.selectAll("path").data([]).exit()
                                .attr("stroke", "gray")
                                .attr("opacity", "0.3");
                            d3.select("#selected-track").text(noTrackSelected);
                            d3.select("#album_" + album._id).style("color", "gray");
                        });
                    }
                }

            });

        }

    }, [context.finished, context.selectedFinished, context.albums]);



    return (
        <div>
            <img id="selected-track-img" height="100px" />
            <div id="selected-track">{noTrackSelected}</div>
            <ul id="selected-track-features">

            </ul>
            <svg ref={graphRef} width={graphWidth} height={graphHeight}>

            </svg>
        </div>
    );

}

export default Graph;