import { useContext } from "react";
import { AlbumContext } from "../App";

function AlbumSelect() {
    const context = useContext(AlbumContext);

    const albumOptions = context.albums.map((album) =>
        <option value={album._id}>{album.name}</option>
    );

    return (
        <select name="albums-selection" id="albums-selection">
            <option value="all-albums" defaultValue="all-albums">All albums</option>
            <option disabled={true}>----</option>
            { albumOptions }
        </select>
    );
}

export default AlbumSelect;