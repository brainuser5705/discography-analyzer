import { useContext, useEffect, useState } from 'react';
import { AlbumContext } from '../App';
import addArtist from '../data/addArtist';

function SearchArtist() {

    const context = useContext(AlbumContext);

    const [prevId, setPrevId] = useState(context._id);

    return (
        <div id="search-artist">
            <label htmlFor="artist-search">Search for artist: </label>

            <input
                value={context.id}
                onChange={(e) => {
                    context.setId(e.target.value);
                }}
                id="artist-search"
                name="artist-search"
                placeholder="Type artist id here"
            />

            <input
                id="artist-submit"
                type="submit"
                value="Search"
                onClick={() => {

                    let msgElement =
                        document.getElementById("new-artist-message");

                    if (context._id !== prevId) {
                        addArtist(context._id).then((response) => {
                            // send back a status message
                            if (!response.ok) {
                                response.json().then((json) => {
                                    msgElement.innerHTML = json.error;
                                });
                            } else {
                                if (response.status === 201) {       // created
                                    msgElement.innerHTML =
                                        `Successfully added artist
                                     ${context._id} to database and showing`;
                                } else if (response.status == 202) { // accepted
                                    msgElement.innerHTML = `Showing artist 
                                        ${context._id}`;
                                }
                                // reset all states since the new artist
                                // will have new data
                                context.setFinished(false);
                                context.setSelectedAlbum([]);
                                context.setSelectedFinished(false);
                            }
                        });
                    } else {
                        msgElement.innerHTML = `Artist ${context._id} is 
                            already displayed.`
                    }

                    setPrevId(context._id);

                }}
            />

            <div id="new-artist-message"></div>

        </div>
    );
}

export default SearchArtist;