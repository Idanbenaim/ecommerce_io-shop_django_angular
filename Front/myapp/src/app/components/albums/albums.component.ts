// albums.component.ts
import { Component, OnInit } from '@angular/core';
import { Observable, map, of, switchMap } from 'rxjs';
import { AlbumsService } from 'src/app/services/albums.service';
import { BASE_API_URL } from 'src/app/api.config';
import { Album } from 'src/app/models/album';
import { FiltersService } from 'src/app/services/filters.service';

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
    private filtersService: FiltersService
  ) {
    // this.allAlbums$ = this.filtersService.selectedGenres$.pipe(
    //   switchMap(selectedGenres => {
    //     if (selectedGenres.length > 0) {
    //       return this.albumsService.getFilteredData(selectedGenres);
    //     } else {
    //       return this.albumsService.getAllData();
    //     }
    //   })
    // );
  }
  ngOnInit() {
    //   this.allAlbums$ = this.albumsService.getAllData();

    //   this.filtersService.selectedGenres$.pipe(
    //     switchMap(selectedGenres => {
    //       return this.filtersService.selectedDecades$.pipe(
    //         map(selectedDecades => {
    //           return { selectedGenres, selectedDecades };
    //         })
    //       );
    //     }),
    //   ).subscribe(({ selectedGenres, selectedDecades }) => {
    //     this.allAlbums$ = this.albumsService.getFilteredData(selectedGenres, selectedDecades);
    //   });
    // }
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

    // We're assigning the Observable returned from albums.getAllData() to our ar$ property.
    // So ar$ is now an Observable that will emit an array of albums when someone subscribes to it.
