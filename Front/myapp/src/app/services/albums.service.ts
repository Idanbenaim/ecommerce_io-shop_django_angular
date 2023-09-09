// albums list service
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Album } from '../models/album';
import { BASE_API_URL } from '../api.config';

@Injectable({
  providedIn: 'root'
})
export class AlbumsService {
  static getAllData(): Observable<Album[]> {
    throw new Error('Method not implemented.');
  }
  private MY_SERVER = `${BASE_API_URL}/albums`;

  constructor(private http: HttpClient) { }

  getAllData(): Observable<Album[]> {
    return this.http.get<Album[]>(this.MY_SERVER);
  }

  getFilteredData(selectedGenres: string[], selectedDecades: string[]): Observable<Album[]> {
    return this.http.get<Album[]>(this.MY_SERVER).pipe(
      map(albums => {
        let filteredAlbums = albums;

        if (selectedGenres.length > 0) {
          filteredAlbums = filteredAlbums.filter(album => selectedGenres.includes(album.genre));
        }

        if (selectedDecades.length > 0) {
          filteredAlbums = filteredAlbums.filter(album => {
            const albumDecadeDigit = album.albumYear.toString().charAt(2); // Get the third character from the left (representing the decade)
            return selectedDecades.includes(albumDecadeDigit);
          });
        }

        return filteredAlbums;
      })
    );
  }



}
