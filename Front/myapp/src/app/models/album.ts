// album.ts
import { Artist } from './artist';
import { Genre } from './genre';

export class Album {
  id?: number;
  artist!: Artist;
  genre!: string;
  album_title: string = "";
  albumYear: number = 0;
  description: string = "";
  price: number = 0;
  yt_link?: string;
  songs_list?: string[];
  album_cover?: string;
  quantity?: number;
}
export { Genre };

