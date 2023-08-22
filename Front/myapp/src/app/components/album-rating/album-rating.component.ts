import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlbumRatingService } from '../../services/album-rating.service';

@Component({
  selector: 'app-album-rating',
  template: `
    <button
      class="vote-button"
      [class.active]="isVotedUp"
      (click)="vote(1)"
    >
      Like
    </button>
    <button
      class="vote-button"
      [class.active]="isVotedDown"
      (click)="vote(-1)"
    >
      Dislike
    </button>
  `,
  styleUrls: ['./album-rating.component.css']
})
export class AlbumRatingComponent {
  @Input() album_id: number = 0;
  @Output() voteChanged = new EventEmitter<number>();

  isVotedUp = false;
  isVotedDown = false;

  constructor(private albumRatingService: AlbumRatingService) { }

  vote(vote: number): void {
    this.albumRatingService.createRating(this.album_id, vote).subscribe({
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
        this.voteChanged.emit(vote); // Emit the vote change event
      },
      error: error => {
        // Handle error (e.g., display error message)
        console.error('Error submitting vote', error);
      }
    });
  }
}
