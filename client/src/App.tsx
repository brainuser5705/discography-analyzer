import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import Profile from './components/Profile';
import { Artist } from './types/artist';
import AlbumCard from './components/AlbumCard';
import Graph from './components/Graph';
import { Album } from './types/album';
import fetchAlbum from './data/fetchAlbum';

const AlbumContext = React.createContext<Album[]>([]);

function App() {

  // This sets the initial state with useEffect.
  // Using typescript generic to ensure that return value is also a string
  const [_id, setId] = useState<string>("6HvZYsbFfjnjFrWF950C9d");
  const [name, setName] = useState<string>("");
  const [picUrl, setPicUrl] = useState<string>("");
  const [albums, setAlbums] = useState<Album[]>([]); // figure out how to make it run only once

  const [finished, setFinished] = useState<boolean>(false);

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
      <Profile name={name} picUrl={picUrl} numAlbums={albums.length} />
      <AlbumContext.Provider value={albums}>
        { albumCards }{/* make this its own component */}
        < Graph />
      </AlbumContext.Provider>
    </div>
  );
}

export { App, AlbumContext };
