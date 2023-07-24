import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import Profile from './components/Profile';
import { Artist } from './types/artist';
import AlbumCard from './components/AlbumCard';
import Graph from './components/Graph';
import { Album } from './types/album';

const AlbumContext: React.Context<Album[]> =React.createContext<Album[]>([]);

function App() {
  // This sets the initial state with useEffect.
  // Using typescript generic to ensure that return value is also a string
  const [_id, setId] = useState<string>("6HvZYsbFfjnjFrWF950C9d");
  const [name, setName] = useState<string>("");
  const [picUrl, setPicUrl] = useState<string>("");
  const [albumIds, setAlbumIds] = useState<string[]>([]);

  const albums = useRef<Album[]>([]);

  // second argument is the dependencies to trigger useEffect when there is a rerender (like in the set functions)
  // we only need to run the side effect function once
  useEffect(() => {

    fetch(`http://localhost:3000/artist/${_id}`)
      .then((response) => response.json(), (error) => console.log("Something went wrong: " + error))
      .then((artistJson: Artist) => {
        setId(artistJson._id);
        setName(artistJson.name);
        setPicUrl(artistJson.picUrl);
        setAlbumIds(artistJson.album_ids);
      })
      .catch((error) => {
        console.log("Something went wrong fetching artist id " + _id + "; " + error);
      });

  });

  const albumCards = albumIds.map((albumId) =>
    <AlbumCard id={albumId} />
  );

  const albumList = albums.current.map((album) =>
    <li>{album.name}</li>
  )
  
  return (
    <div>
      <Profile name={name} picUrl={picUrl} numAlbums={albums.current.length} />
      <AlbumContext.Provider value={ albums.current }>
        <ul>{ albumList }</ul>
        { albumCards }
        < Graph />
        
      </AlbumContext.Provider>
    </div>
  );
}

export { App, AlbumContext };
