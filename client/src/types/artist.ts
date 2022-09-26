import {Album} from '../types/album';

export type Artist = {
    _id: string;
    name: string;
    picUrl: string;
    albums: Album[];
}