// album-rating.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AlbumRating } from '../models/album-rating';

@Injectable({
  providedIn: 'root'
})
export class AlbumRatingService {
  private baseUrl = 'http://your-backend-url'; // Replace with your backend URL

  constructor(private http: HttpClient) { }

  createRating(albumId: number, vote: number): Observable<AlbumRating> {
    const url = `${this.baseUrl}/create_album_rating/`;
    const payload = { album: albumId, vote: vote };
    return this.http.post<AlbumRating>(url, payload);
  }

  getAlbumRatings(albumId: number): Observable<any> {
    const url = `${this.baseUrl}/get_album_ratings/${albumId}/`;
    return this.http.get(url);
  }
}
