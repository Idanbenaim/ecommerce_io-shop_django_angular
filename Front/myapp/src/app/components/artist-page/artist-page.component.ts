// artists-page.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Artist } from 'src/app/models/artist';
import { Album } from 'src/app/models/album';
import { ArtistPageService } from 'src/app/services/artist-page.service';
import { BASE_API_URL } from 'src/app/api.config';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-artist-page',
  templateUrl: './artist-page.component.html',
  styleUrls: ['./artist-page.component.css']
})
export class ArtistPageComponent implements OnInit {
  BASE_API_URL = BASE_API_URL;
  artist$!: Observable<Artist>; // The artist details
  albums$!: Observable<Album[]>; // The artist's albums

  constructor(
    private artistService: ArtistPageService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getArtist();
    this.getAlbums();
  }

  getArtist(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.artist$ = this.artistService.getArtist(id);

  }

  getAlbums(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.albums$ = this.artistService.getArtistAlbums(id);

  }
}
