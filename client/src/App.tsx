import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import Profile from './components/Profile';
import { Artist } from './types/artist';
import AlbumCard from './components/AlbumCard';
import Graph from './components/Graph';
import { Album } from './types/album';
import fetchAlbum from './data/fetchAlbum';
import * as d3 from 'd3';

const AlbumContext = React.createContext<any>({});

function App() {

  // This sets the initial state with useEffect.
  // Using typescript generic to ensure that return value is also a string
  const [_id, setId] = useState<string>("3l0CmX0FuQjFxr8SK7Vqag");
  const [name, setName] = useState<string>("");
  const [picUrl, setPicUrl] = useState<string>("");
  const [albums, setAlbums] = useState<Album[]>([]); // figure out how to make it run only once

  // set to true when data fetching is done for final re-render
  const [finished, setFinished] = useState<boolean>(false);

  const albumListRef = useRef(null);

  const [graphWidth, setGraphWidth] = useState(0);
  const [graphHeight, setGraphHeight] = useState(0);
  const graphRef = useRef(null);

  // second argument is the dependencies to trigger useEffect when there is a rerender (like in the set functions)
  // we only need to run the side effect function once
  useEffect(() => {

    let albumArr : Album[] = [];

    fetch(`http://localhost:3000/artist/${_id}`)
      .then((response) => response.json(), (error) => console.log("Something went wrong: " + error))
      .then((artistJson: Artist) => {
        setId(artistJson._id);
        setName(artistJson.name);
        setPicUrl(artistJson.picUrl);
    
        (async function loop() {
          if (!finished){
            for (let id of artistJson.album_ids) {
              let album = await fetchAlbum(id);
              albumArr.push(album);
              console.log("Fetched album: " + album.name);
              setAlbums(albumArr);
            }
            setFinished(true);
          }
        })();

        setGraphWidth(graphRef.current.offsetWidth);
        setGraphHeight(graphRef.current.offsetHeight);
        
      })
      .catch((error) => {
        console.log("Something went wrong fetching artist id " + _id + "; " + error);
      });


  }, []);

  const albumCards = albums.map((album) => 
    <AlbumCard album={album} />
  );

  return (
    <div>
      <div id="graph-side" ref={graphRef}>
        <Profile name={name} picUrl={picUrl} numAlbums={albums.length}/>
        <AlbumContext.Provider value={{albums, finished}}>
          <div id="graph">
            < Graph width={graphWidth} height={graphHeight}/>
          </div>
        </AlbumContext.Provider>
      </div>
      <div id="list-side">
        { albumCards }
      </div>
    </div>
  );
}

export { App, AlbumContext };
