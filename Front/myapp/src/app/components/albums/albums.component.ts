
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AlbumsService } from 'src/app/services/albums.service';
import { BASE_API_URL } from 'src/app/api.config';

// Add the Album interface here
export interface Album {
  id: number;
  album_title: string;
  albumYear: number;
  description: string;
  price: string;
  album_cover: string;
  artist: number;
  artist_name: string;
  genre: number;
  songs_list: string[];
}

@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.css'],
  // THis is new flexbox styling
  template: `
  <div class="parent">
    <app-albums *ngFor="let al of Album" [al]="al"></app-albums>
  </div>
`,
  styles: [
    `
    .parent {
      display: flex;
      flex-flow: row wrap;
      justify-content: space-around;
    }
  `,
  ],
})

export class AlbumsComponent {
  BASE_API_URL = BASE_API_URL;
  // Define a property ar$ as an Observable that emits an array of Albums.
  ar$: Observable<Album[]>;


  constructor(private albums: AlbumsService) {
    // We're assigning the Observable returned from albums.getAllData() to our ar$ property.
    // So ar$ is now an Observable that will emit an array of albums when someone subscribes to it.
    this.ar$ = this.albums.getAllData();
  }

}

