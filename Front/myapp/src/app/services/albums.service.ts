// albums list service

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Album } from '../models/album';
import { BASE_API_URL } from '../api.config';



@Injectable({
  providedIn: 'root'
})
export class AlbumsService {
  MY_SERVER = `${BASE_API_URL}/albums`;

  constructor(private http: HttpClient) { }

  getAllData(): Observable<Album[]> {
    return this.http.get<any>(this.MY_SERVER)
  }
}
