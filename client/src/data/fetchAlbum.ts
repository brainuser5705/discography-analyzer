import { Album } from "../types/album";

async function fetchAlbum(albumId: string) : Promise<Album>{
    let response : Response = await fetch(process.env.REACT_APP_API_URI + `album/${albumId}`)
    let albumJson : Album = await response.json();
    return albumJson;
}

export default fetchAlbum;