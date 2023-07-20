import React, { useEffect, useState } from 'react';
import './App.css';
import Profile from './components/Profile';
import { Artist } from './types/artist';
import AlbumCard from './components/AlbumCard';
import { Album } from './types/album';

function App() {

  // This sets the initial state with useEffect.
  // Using typescript generic to ensure that return value is also a string
  const [_id, setId] = useState<string>("6HvZYsbFfjnjFrWF950C9d");
  const [name, setName] = useState<string>("");
  const [picUrl, setPicUrl] = useState<string>("");
  const [albums, setAlbums] = useState<string[]>([]); // album ids, might need to update the naming\

  // tracks context

  const AlbumContext = React.createContext<string[]>([]);

  // second argument is the dependencies to trigger useEffect when there is a rerender (like in the set functions)
  // we only need to run the side effect function once
  useEffect(() => {
    fetch(`http://localhost:3000/artist/${_id}`)
    .then((response) => response.json(), (error) => console.log("Something went wrong: " + error))
    .then((artistJson: Artist) => {
      setId(artistJson._id);
      setName(artistJson.name);
      setPicUrl(artistJson.picUrl);
      setAlbums(artistJson.albums);
    })
    .catch((error) => {
      console.log("Something went wrong: " + error);
    });
  }, []); 
  
  const albumCards = albums.map((albumId) =>
      <AlbumCard id={albumId} />
  );

  return (
    <div>
      <Profile name={name} picUrl={picUrl} numAlbums={albums.length} />
      <AlbumContext.Provider value={albums}>
        {albumCards} {/* make this its own component */}


      </AlbumContext.Provider>
    </div>
  );
}

export default App;
