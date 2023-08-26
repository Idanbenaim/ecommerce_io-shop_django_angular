// albums.component.ts
import { Component, OnInit } from '@angular/core';
import { Observable, map, of, switchMap } from 'rxjs';
import { AlbumsService } from 'src/app/services/albums.service';
import { BASE_API_URL } from 'src/app/api.config';
import { Album } from 'src/app/models/album';
import { FiltersService } from 'src/app/services/filters.service';
// import { AlbumRatingService } from 'src/app/services/album-rating.service';


@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.css'],
})

export class AlbumsComponent implements OnInit {
  BASE_API_URL = BASE_API_URL;
  // Define a property ar$ as an Observable that emits an array of Albums.
  allAlbums$!: Observable<Album[]> //= new Observable<Album[]>(subscriber => subscriber.complete());

  constructor(
    private albumsService: AlbumsService,
    private filtersService: FiltersService,
    // private albumRatingService: AlbumRatingService
  ) {}
  ngOnInit() {
    this.filtersService.selectedGenres$.pipe(
      switchMap(selectedGenres => {
        return this.filtersService.selectedDecades$.pipe(
          map(selectedDecades => {
            return { selectedGenres, selectedDecades };
          })
        );
      }),
      switchMap(({ selectedGenres, selectedDecades }) => {
        if (selectedGenres.length > 0 || selectedDecades.length > 0) {
          return this.albumsService.getFilteredData(selectedGenres, selectedDecades);
        } else {
          return this.albumsService.getAllData();
        }
      })
    ).subscribe(filteredAlbums => {
      this.allAlbums$ = of(filteredAlbums); // Wrap the filteredAlbums in an observable
    });

  }
}
