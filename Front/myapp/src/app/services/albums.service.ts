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
  // getFilteredData(selectedGenres: string[]): Observable<Album[]> {
  //   return this.http.get<Album[]>(this.MY_SERVER).pipe(
  //     map(albums => {
  //       if (selectedGenres.length === 0) {
  //         return albums; // Return all albums if no genres are selected
  //       } else {
  //         return albums.filter(album => selectedGenres.includes(album.genre));
  //       }
  //     })
  //   );
  // }

  // getFilteredData(selectedGenres: string[], selectedDecades: string[]): Observable<Album[]> {
  //   return this.http.get<Album[]>(this.MY_SERVER).pipe(
  //     map(albums => {
  //       let filteredAlbums = albums;

  //       if (selectedGenres.length > 0) {
  //         filteredAlbums = filteredAlbums.filter(album => selectedGenres.includes(album.genre));
  //       }

  //       if (selectedDecades.length > 0) {
  //         filteredAlbums = filteredAlbums.filter(album => {
  //           const decade = Math.floor(album.albumYear / 10) * 10; // Calculate the decade
  //           console.log(decade);
  //           return selectedDecades.includes(`${decade}s`);
  //         });
  //       }

  //       return filteredAlbums;
  //     })
  //   );
  // }
  getFilteredData(selectedGenres: string[], selectedDecades: string[]): Observable<Album[]> {
    return this.http.get<Album[]>(this.MY_SERVER).pipe(
      map(albums => {
        let filteredAlbums = albums;

        if (selectedGenres.length > 0) {
          filteredAlbums = filteredAlbums.filter(album => selectedGenres.includes(album.genre));
        }

        if (selectedDecades.length > 0) {
          filteredAlbums = filteredAlbums.filter(album => {
            const decadePrefix = album.albumYear.toString().substr(0, 1); // Get the first digit of albumYear
            return selectedDecades.includes(`${decadePrefix}0s`);
          });
        }

        return filteredAlbums;
      })
    );
  }


}
