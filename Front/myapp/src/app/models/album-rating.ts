// album-rating.ts
import { Album } from './album';

export class AlbumRating {
  id?: number;
  album?: number;
  user?: number ;
  vote?: number;
  up_votes: number | undefined;
  down_votes: number | undefined;

  constructor() {
  this.id = 0;
  this.album = 0;
  this.user = 0;
  this.vote = 0;
  this.up_votes = 0;
  this.down_votes = 0;
}
}
