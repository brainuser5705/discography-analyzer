import React, { useEffect, useRef, useState } from 'react';

import Profile from './components/Profile';
import AlbumCard from './components/AlbumCard';
import Graph from './components/Graph';
import AlbumSelect from './components/AlbumSelect';
import SearchArtist from './components/SearchArtist';
import SubmitArtist from './components/SubmitArtist';

import { Album } from './types/album';
import { Artist } from './types/artist';

import fetchAlbum from './data/fetchAlbum';

import './App.css';

// State shared by components to re-render if changed
const AlbumContext = React.createContext<any>({});

function App() {

  // Spotify id of the artist
  const [_id, setId] = useState<string>("3l0CmX0FuQjFxr8SK7Vqag");
  // Name of the artist
  const [name, setName] = useState<string>("");
  // Url of the artist profile picture on Spotify
  const [picUrl, setPicUrl] = useState<string>("");

  // List of all the albums of the artist
  const [albums, setAlbums] = useState<Album[]>([]);
  // List of selected albums (only a list of one at this point)
  const [selectedAlbum, setSelectedAlbum] = useState<Album[]>([]);
  // The id of the selected album
  const [albumSelection, setAlbumSelection] = useState<string>("all-albums");

  // Set to true when data (all albums) is (async) fetched for final re-render
  const [finished, setFinished] = useState<boolean>(false);
  // Set to true when new album is selected and data is fetched for re-render
  const [selectedFinished, setSelectedFinished] = useState<boolean>(false);

  // Graph dimensions dynamically set when graph is rendered
  const graphRef = useRef(null);
  const [graphWidth, setGraphWidth] = useState(0);
  const [graphHeight, setGraphHeight] = useState(0);


  /**
   * Runs once for every render
   */
  useEffect(() => {

    // Sets the graph dimensions based off CSS dimensions
    setGraphWidth(graphRef.current.offsetWidth);
    setGraphHeight(graphRef.current.offsetHeight);

    // This will only run whenever a new artist (including the first load) is
    // set, since that is when `finished` will be reset to false
    if (!finished) {
      let albumArr: Album[] = [];
      fetch(process.env.REACT_APP_API_URI + `artist/${_id}`)
        .then((response) => response.json())
        .then((artistJson: Artist) => {
          setId(artistJson._id);
          setName(artistJson.name);
          setPicUrl(artistJson.picUrl);

          // each loop is its own async operation which awaits for the promise
          // returned by fetchAlbum()
          (async function loop() {
            for (let id of artistJson.album_ids) {
              let album = await fetchAlbum(id);
              if (!finished) {
                albumArr.push(album);
                setAlbums(albumArr);
              }
            }
            setFinished(true); // all albums have been fetched
          })();

        })
        .catch((error) => {
          // !!! need to have error message
          console.log("Error fetching artist id " + _id + "; " + error);
        });
    }

    // All albums need to be fetched before we can filter out the selected ones
    if (finished && !selectedFinished) {
      for (let album of albums) {
        if (albumSelection === "all-albums" || album._id === albumSelection) {
          selectedAlbum.push(album);
          setSelectedAlbum(selectedAlbum);
          if (album._id === albumSelection) {
            break;
          }
        }
      }
      setSelectedFinished(true);
    }

  },
    [selectedFinished, finished] // re-render triggered when these states change
  );


  // Sets the event listener to change state for re-render for select element
  if (finished) { // finished means the select element has been rendered
    let selectionElement =
      (document.getElementById("albums-selection") as HTMLInputElement);
    selectionElement.addEventListener("click", () => {
      setAlbumSelection(selectionElement.value);
      setSelectedAlbum([]); // reset all selected album related states
      setSelectedFinished(false);
    });
  }

  // Create the album cards divs to display
  const albumCards = (() => {
    if (selectedFinished) { // render only if selected albums have been set
      if (albumSelection === "all-albums") {
        return albums.map((album) => <AlbumCard album={album} />);
      } else {
        let album = albums.filter((album) => album._id === albumSelection)[0];
        return <AlbumCard album={album} />;
      }
    }
  })();

  return (
    <div id="submit-artist">
      <AlbumContext.Provider
        value={{
          albums,                           // AlbumSelect
          selectedAlbum,                    // Graph
          finished, selectedFinished,       // Graph
          _id, setId,                       // SearchArtist
          setFinished, setSelectedFinished, // SearchArtist
          setSelectedAlbum                  // SearchArtist
        }}>

        {/* Displays the parallel coordinate graph */}
        <div id="graph-side" ref={graphRef}>
          <div id="graph">
            < Graph width={graphWidth} height={graphHeight} />
          </div>
        </div>

        {/* Displays the list of album cards and interactivity control */}
        <div id="list-side">
          <SubmitArtist />
          <SearchArtist />
          <Profile name={name} picUrl={picUrl} numAlbums={albums.length} />
          <AlbumSelect />
          {albumCards}
        </div>

      </AlbumContext.Provider>
    </div>
  );
}

export { App, AlbumContext };
