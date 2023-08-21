import { Component, Input } from '@angular/core';
import { AlbumRatingService } from '../../services/album-rating.service';

@Component({
  selector: 'app-album-rating',
  template: `
    <span
      class="material-symbols-outlined"
      [class.voted]="isVotedUp"
      (click)="vote(1)"
      data-icon="e8dc"
    ></span>
    <span
      class="material-symbols-outlined"
      [class.voted]="isVotedDown"
      (click)="vote(-1)"
      data-icon="\e8db"
    ></span>
  `,
  styleUrls: ['./album-rating.component.css']
})
export class AlbumRatingComponent {
  @Input() albumId: number = 0;

  isVotedUp = false;
  isVotedDown = false;

  constructor(private albumRatingService: AlbumRatingService) { }

  vote(vote: number): void {
    this.albumRatingService.createRating(this.albumId, vote).subscribe({
      next: response => {
        // Handle success (e.g., update UI or show a success message)
        console.log('Vote submitted successfully', response);
        if (vote === 1) {
          this.isVotedUp = true;
          this.isVotedDown = false;
        } else if (vote === -1) {
          this.isVotedUp = false;
          this.isVotedDown = true;
        }
      },
      error: error => {
        // Handle error (e.g., display error message)
        console.error('Error submitting vote', error);
      }
    });
  }
}
