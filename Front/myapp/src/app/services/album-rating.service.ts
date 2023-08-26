// album-rating.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AlbumRating } from '../models/album-rating';
import { BASE_API_URL } from '../api.config';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from './user.service';


@Injectable({
  providedIn: 'root'
})
export class AlbumRatingService {
  private MY_SERVER = BASE_API_URL;
  private POST_RATING_URL = `${this.MY_SERVER}/create_album_rating/`;
  private GET_RATINGS_URL = `${this.MY_SERVER}/get_album_ratings/`;
  private authToken = localStorage.getItem('token');
  private headers: HttpHeaders = new HttpHeaders;
  private userId = this.userService.getUserId();

  constructor(
    private httpClient: HttpClient,
    private snackBar: MatSnackBar,
    private userService: UserService,
  ) {
    this.userService.getUserId().subscribe(userId => {
      if (userId) {
        // console.log('User is logged in. Loading cart from server...', userId);

        this.authToken = localStorage.getItem('token');
        this.headers = new HttpHeaders({
          'Authorization': `Bearer ${this.authToken}`
        });
      }
    });
  }

  createRating(albumId: number, vote: number): Observable<AlbumRating> {
    const payload = { album: albumId, vote: vote };

    return this.httpClient.post<AlbumRating>(this.POST_RATING_URL, payload, { headers: this.headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400 && error.error?.error === 'You have already voted for this album.') {
          const errorMessage = 'You have already voted for this album.';
          this.snackBar.open(errorMessage, 'Dismiss', {
            duration: 3000,
            verticalPosition: 'top',
            panelClass: 'error-snackbar'
          });
          return throwError(() => errorMessage);
        }

        this.snackBar.open('An error occurred. Please try again later.', 'Dismiss', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: 'error-snackbar'
        });
        return throwError(() => error);
      }),
    );
  }

  getAlbumRatings(albumId: number): Observable<AlbumRating > {

    const url = `${this.GET_RATINGS_URL}${albumId}/`;

    return this.httpClient.get<AlbumRating>(url, { headers: this.headers }).pipe(
        catchError((error: HttpErrorResponse) => {
          console.error(`Error getting Album ratings: ${error.message}`);
          return throwError(() => error);
        })
      );
    }
  }

