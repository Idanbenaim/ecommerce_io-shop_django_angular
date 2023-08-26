import { Component, OnInit, ElementRef } from '@angular/core';
import { ArtistsService } from 'src/app/services/artists.service';
import { MatCardModule } from '@angular/material/card';
import { BASE_API_URL } from 'src/app/api.config';



@Component({
  selector: 'app-artists',
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.css'],
})
export class ArtistsComponent implements OnInit {
  BASE_API_URL = BASE_API_URL;
  uniqueLetters: string[] = [];

  constructor(private artistsService: ArtistsService, private elementRef: ElementRef) { }

  ngOnInit() {
    // Subscribe to getUniqueLetters() to retrieve unique letters and assign them to uniqueLetters property
    this.artistsService.getUniqueLetters().subscribe(letters => {
      this.uniqueLetters = letters;
    });
  }

  // Get artists based on the specified letter
  getArtistsByLetter(letter: string) {
    return this.artistsService.getArtistsByLetter(letter);
  }

  navigateToLetter(letter: string) {
    const element = this.elementRef.nativeElement.querySelector(`#letter-${letter}`);
    if (element) {
      // Scroll to the element using the scrollIntoView method
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

}

