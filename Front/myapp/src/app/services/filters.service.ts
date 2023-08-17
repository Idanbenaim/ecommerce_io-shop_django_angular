// filters.service.ts:
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Genre } from '../models/genre';
import { BASE_API_URL } from '../api.config';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FiltersService {
  private MY_SERVER = `${BASE_API_URL}/genres`;

  constructor(private http: HttpClient) { }

  // fetch genres
  getGenres(): Observable<Genre[]> {
    // console.log(this.http.get<any>(`${this.MY_SERVER_GENRES}`));
    return this.http.get<any>(`${this.MY_SERVER}`);
  }

  private selectedGenresSubject = new BehaviorSubject<string[]>([]);
  selectedGenres$ = this.selectedGenresSubject.asObservable();

  updateSelectedGenres(selectedGenres: string[]) {
    this.selectedGenresSubject.next(selectedGenres);
  }

  private selectedDecadesSubject = new BehaviorSubject<string[]>([]);
  selectedDecades$ = this.selectedDecadesSubject.asObservable();

  updateSelectedDecades(selectedDecades: string[]) {
    this.selectedDecadesSubject.next(selectedDecades);
  }
}
