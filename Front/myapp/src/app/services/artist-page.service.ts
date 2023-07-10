import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Artist } from '../models/artist';
import { Album } from '../models/album';
import { BASE_API_URL } from '../api.config';

@Injectable({
  providedIn: 'root'
})
export class ArtistPageService {
  private MY_SERVER = `${BASE_API_URL}/artists`;
  constructor(private http: HttpClient) { }

  getArtist(id: number): Observable<Artist> {
    return this.http.get<Artist>(`${this.MY_SERVER}/${id}`);
  }

  getArtistAlbums(artist_id: number): Observable<Album[]> {
    return this.http.get<Album[]>(`${this.MY_SERVER}/${artist_id}/albums`);
  }
}
