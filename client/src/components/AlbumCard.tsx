import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { Track } from '../types/track';
import { Album } from '../types/album';

import * as d3 from 'd3';

type AlbumProps = {
    album : Album
}

function AlbumCard(props: AlbumProps) {

    useEffect(() => {
        
        var albumCard = d3.select("#albumcard-"+props.album._id);
        albumCard
            .on("mouseover", (d)=>{
                d3.select(d.target).style("color", "blue");
                let group = d3.selectAll(".group_" + props.album._id) // cannot define outside because of order of rendering
                group.selectAll("circle").data([]).exit()
                    .attr("fill", "blue")
                    .attr("opacity", "1.0");
                group.selectAll("path").data([]).exit()
                    .attr("stroke", "blue")
                    .attr("opacity", "1.0");
            })
            .on("mouseout", (d)=>{
                d3.select(d.target).style("color", "black");
                let group = d3.selectAll(".group_" + props.album._id)
                group.selectAll("circle").data([]).exit()
                    .attr("fill", "black")
                    .attr("opacity", "0.3");
                group.selectAll("path").data([]).exit()
                    .attr("stroke", "black")
                    .attr("opacity", "0.3");
            });

        props.album.tracks.forEach((track) => {
            d3.select("#albumCard-track-"+track._id)
                .on("mouseover", (d)=>{
                    d3.select(d.target).style("color", "red");
                    let albumGroup = d3.selectAll(".group_"+props.album._id);
                    albumGroup.selectAll("circle").data([]).exit()
                        .attr("fill", "blue")
                        //.attr("opacity", "0.8");
                    albumGroup.selectAll("path").data([]).exit()
                        .attr("stroke", "blue")
                        //.attr("opacity", "0.8");
                    let trackGroup = d3.select("#track_"+track._id);
                    trackGroup.selectAll("circle").data([]).exit()
                        .attr("fill", "red")
                        .attr("opacity", "1.0");
                    trackGroup.selectAll("path").data([]).exit()
                        .attr("stroke", "red")
                        .attr("opacity", "1.0");
                })
                .on("mouseout", (d)=>{
                    d3.select(d.target).style("color", "black");
                    let albumGroup = d3.selectAll(".group_"+props.album._id);
                    albumGroup.selectAll("circle").data([]).exit()
                        .attr("fill", "black")
                        .attr("opacity", "0.3");
                    albumGroup.selectAll("path").data([]).exit()
                        .attr("stroke", "black")
                        .attr("opacity", "0.3");
                    let trackGroup = d3.select("#track_"+track._id);
                    trackGroup.selectAll("circle").data([]).exit()
                        .attr("fill", "black")
                        .attr("opacity", "0.3");
                    trackGroup.selectAll("path").data([]).exit()
                        .attr("stroke", "black")
                        .attr("opacity", "0.3");
                })
        })

    }, [props.album]); // needed so the album card can rerender all the d3 stuff after selection

    // need to use state instead of initializing a local variable because
    // of the async function in useEffect which will run last

    const trackItems = props.album.tracks.map((track: Track) => {
        track.album = props.album;
        return <li key={track._id} id={"albumCard-track-"+track._id}>
            {track.name} - {track.features.energy} - {track.album.name}</li>;
    }
        // note - no brackets because that denotes function that returns void
        
    );

    return (
        <div className="album-card">
            <img height="100px"src={props.album.picUrl} />
            <h2 id={"albumcard-"+props.album._id}>{props.album.name}</h2>
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