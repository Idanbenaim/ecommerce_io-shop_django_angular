// album page service

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { Album } from '../models/album';
import { BASE_API_URL } from '../api.config';

@Injectable({
  providedIn: 'root'
})
export class AlbumPageService {
  private MY_SERVER = `${BASE_API_URL}/albums`;

  constructor(private http: HttpClient){}

  getAlbum(id: any): Observable<Album> {
    const url = `${this.MY_SERVER}/${id}`;
    return this.http.get<Album>(url).pipe(
      catchError((error: any) => {
        console.error('Error fetching album:', error);
        throw error;
      })
    );
  }

}
export { Album };
