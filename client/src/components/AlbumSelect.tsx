import { useContext } from "react";
import { AlbumContext } from "../App";

function AlbumSelect() {
    const context = useContext(AlbumContext);

    // Generate all the options for the select element based on the albums
    const albumOptions = context.albums.map((album) =>
        <option value={album._id}>{album.name}</option>
    );

    return (
        <div>
            <label htmlFor="albums-selection">Select an album: </label>
            <select
                name="albums-selection"
                id="albums-selection"
                defaultValue="all-albums"
            >
                <option value="all-albums">All albums</option>
                <option disabled={true}>----</option>
                {albumOptions}
            </select>
        </div>
    );
}

export default AlbumSelect;