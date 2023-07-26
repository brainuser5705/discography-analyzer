import { Album } from "../types/album";

async function fetchAlbum(albumId: string) : Promise<Album>{
    // console.log(`Fetching album: ${albumId}`);
    let response = await fetch(`http://localhost:3000/album/${albumId}`)
    let albumJson = await response.json();
    return albumJson;
}

export default fetchAlbum;