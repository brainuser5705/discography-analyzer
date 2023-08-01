import { useContext } from 'react';
import { AlbumContext } from '../App';

function SearchArtist() {

    const context = useContext(AlbumContext);

    return (
        <div id="search-artist">
            <label htmlFor="artist-search">Search for artist: </label>

            <input
                value={context.id}
                onChange={(e)=>{
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
                onClick={()=>{
                    // reset all states since the new artist will have new data
                    context.setFinished(false);
                    context.setSelectedAlbum([]);
                    context.setSelectedFinished(false);
                }}
            />      
        </div>
    );
}

export default SearchArtist;