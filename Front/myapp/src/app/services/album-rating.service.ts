import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AlbumRating } from '../models/album-rating';
import { BASE_API_URL } from '../api.config';
import { MatSnackBar } from '@angular/material/snack-bar';


@Injectable({
  providedIn: 'root'
})
export class AlbumRatingService {
  private MY_SERVER = BASE_API_URL;
  private POST_RATING_URL = `${this.MY_SERVER}/create_album_rating/`;

  private headers: HttpHeaders;
  private authToken = localStorage.getItem('token');

  constructor(
    private httpClient: HttpClient,
    private snackBar: MatSnackBar
  ) {
    this.headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authToken}`
    });
    console.log("this.headers: ", this.headers)
  }

  // createRating(albumId: number, vote: number): Observable<AlbumRating> {
  //   const payload = { album: albumId, vote: vote };
  //   console.log("payload line 53: ", payload)

  //   return this.httpClient.post<AlbumRating>(this.POST_RATING_URL, payload, { headers: this.headers }).pipe(
  //     catchError((error: HttpErrorResponse) => {
  //       if (error.status === 400 && error.error?.error === 'You have already voted for this album.') {
  //         return throwError(() => 'You may have voted on this album already.');
  //       }
  //       return throwError(() => error);
  //     }),
  //   );
  // }

  createRating(albumId: number, vote: number): Observable<AlbumRating> {
    const payload = { album: albumId, vote: vote };

    return this.httpClient.post<AlbumRating>(this.POST_RATING_URL, payload, { headers: this.headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400 && error.error?.error === 'You have already voted for this album.') {
          const errorMessage = 'You may have voted on this album already.';
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

    getAlbumRatings(albumId: number): Observable < any > {
      const url = `${this.MY_SERVER}/get_album_ratings/${albumId}/`;

      // Define your custom headers here
      const headers = new HttpHeaders({
        'Authorization': 'Bearer your-access-token', // Replace with your actual token
      });

      return this.httpClient.get(url, { headers: headers });
    }
  }
