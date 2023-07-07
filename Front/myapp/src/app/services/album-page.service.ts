// album page service

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Album } from '../models/album';
import { BASE_API_URL } from '../api.config';

@Injectable({
  providedIn: 'root'
})
export class AlbumPageService {
  private apiUrl = `${BASE_API_URL}/albums`;

  constructor(private http: HttpClient) { }

  getAlbum(id: number): Observable<Album> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Album>(url);
  }
}
export { Album };

