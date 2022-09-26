import { useEffect, useState } from 'react';
import './App.css';
import { Album } from './types/album';
import Profile from './components/Profile';
import { Artist } from './types/artist';
import AlbumCard from './components/AlbumCard';
import fetchAlbum from './data/fetchAlbum';

function App() {

  // setting the initial state with useEffect
  // using typescript generic to ensure that return value is also a string
  const [_id, setId] = useState<string>("6HvZYsbFfjnjFrWF950C9d");
  const [name, setName] = useState<string>("");
  const [picUrl, setPicUrl] = useState<string>("");
  const [albums, setAlbums] = useState<string[]>([]);

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
  // second argument is the dependencies to trigger useEffect when there is a rerender (like in the set functions)
  // we only need to run the side effect function once

  const albumCards = albums.map((albumId) =>
      <AlbumCard id={albumId} />
  );

  return (
    <div>
      <Profile name={name} picUrl={picUrl} numAlbums={albums.length} />
      {albumCards}
    </div>
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.tsx</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
  );
}

export default App;
