import { useEffect } from 'react';
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

    }, []); // no dependencies to re-render for

    const trackItems = props.album.tracks.map((track: Track) => {

        // needed to refer when highlighting other tracks in the same album
        track.album = props.album;
        
        return <li key={track._id} id={"albumCard-track-"+track._id}>
            {track.name}
            {track.features ? "" :
                <span className="no-track-features">
                    No track feature analysis</span>}
            </li>;
    });

    return (
        <div className="item-display album-card">
            <img alt="" src={props.album.picUrl} />
            <div className="content">
                <div className="album-card-name" id={"albumcard-"+props.album._id}>{props.album.name}</div>
                <div>Number of tracks: {props.album.tracks.length}</div>
                <ul>
                    { trackItems }
                </ul>
            </div>
            
        </div>
    );

}

export default AlbumCard;

AlbumCard.propTypes = {
    id: PropTypes.string,
}