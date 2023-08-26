import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Artist } from 'src/app/models/artist';
import { Album } from 'src/app/models/album';
import { ArtistPageService } from 'src/app/services/artist-page.service';
import { BASE_API_URL } from 'src/app/api.config';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

}
