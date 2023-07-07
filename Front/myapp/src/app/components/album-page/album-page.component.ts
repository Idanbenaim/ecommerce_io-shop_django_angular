// album-page.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlbumPageService } from 'src/app/services/album-page.service';
import { Album } from 'src/app/models/album';
import { BASE_API_URL } from 'src/app/api.config';


@Component({
  selector: 'app-album-page',
  templateUrl: './album-page.component.html',
  styleUrls: ['./album-page.component.css']
})
export class AlbumPageComponent implements OnInit {
  BASE_API_URL = BASE_API_URL;
  album?: Album;

  constructor(private albumPageService: AlbumPageService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getAlbum();
  }

  getAlbum(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // id exists, convert it to a number and fetch the album details
      const idNumber = Number(id);
      this.albumPageService.getAlbum(idNumber).subscribe(albm => this.album = albm);

    } else {
      // id is null or undefined, handle this case here. For example, you could redirect to a 404 page.
    }
  }


}
