import { Artist } from './artist';
import { Genre } from './genre';

export class Album {
  id?: number;
  artist!: Artist;
  genre!: Genre;
  album_title: string = "";
  albumYear: number = 0;
  description: string = "";
  price: number = 0;
  yt_link?: string;
  songs_list?: string;  // Might want to change to string[] if you're planning to split the list of songs
  album_cover?: string; // Assuming the image is represented by a URL string
}
