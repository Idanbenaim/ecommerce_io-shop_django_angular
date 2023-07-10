import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { BASE_API_URL } from '../api.config';
import { Artist } from '../models/artist';


@Injectable({
  providedIn: 'root'
})
export class ArtistsService {
  private MY_SERVER = `${BASE_API_URL}/artists`;
  private artistsData$: BehaviorSubject<Artist[]> = new BehaviorSubject<Artist[]>([]);

  constructor(private http: HttpClient) {
    // Fetch all artists' data and store it in artistsData$ BehaviorSubject
    this.getAllData().subscribe(artists => this.artistsData$.next(artists));
  }

  // Retrieve all artist data from the server
  getAllData(): Observable<Artist[]> {
    return this.http.get<Artist[]>(this.MY_SERVER);
  }

  // Get artists that start with the specified letter from the locally stored data
  getArtistsByLetter(letter: string): Observable<Artist[]> {
    return this.artistsData$.pipe(
      map(artists => artists.filter(artist => artist.artist_name.charAt(0).toLowerCase() === letter.toLowerCase()))
    );
  }

  // Get unique letters from artist names in the locally stored data
  getUniqueLetters(): Observable<string[]> {
    return this.artistsData$.pipe(
      map(artists => {
        const letters = new Set<string>();
        artists.forEach(artist => {
          const firstLetter = artist.artist_name.charAt(0).toUpperCase();
          letters.add(firstLetter);
        });
        return Array.from(letters).sort();
      })
    );
  }
}
