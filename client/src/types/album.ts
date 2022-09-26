import {Track} from '../types/track';

export type Album = {
    _id: string;
    name: string;
    picUrl: string;
    tracks: Track[];
}