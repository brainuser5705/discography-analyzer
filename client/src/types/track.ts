import { Album } from "./album";

export type Track = {
    _id: string;
    name: string;
    album: Album | null;
    features: {
        acousticness: number;
        danceability: number;
        energy: number;
        instrumentalness: number;
        liveness: number;
        loudness: number;
        speechiness: number;
        valence: number;
    }
};