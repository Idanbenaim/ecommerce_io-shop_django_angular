import { Album } from './album';

export class AlbumRating {
  id?: number;
  album?: number;
  user?: number ;
  vote?: number;

  constractor() {
  this.id = 0;
  this.album = 0;
  this.user = 0;
  this.vote = 0;
}
}
