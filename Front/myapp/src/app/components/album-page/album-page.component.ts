// album-page.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlbumPageService } from 'src/app/services/album-page.service';
import { Album } from 'src/app/models/album';
import { BASE_API_URL } from 'src/app/api.config';
import { CartService } from 'src/app/services/cart.service';
import { AlbumRatingService } from 'src/app/services/album-rating.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


@Component({
  selector: 'app-album-page',
  templateUrl: './album-page.component.html',
  styleUrls: ['./album-page.component.css']

})
export class AlbumPageComponent implements OnInit {
  BASE_API_URL = BASE_API_URL;
  album?: Album;
  quantity: number = 0;
  upVotes: number | undefined;
  downVotes: number | undefined;
  ytLink: SafeHtml | undefined;

  constructor(
    private albumPageService: AlbumPageService,
    private route: ActivatedRoute,
    private cartService: CartService,
    private albumRatingService: AlbumRatingService,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    this.getAlbum();
    this.cartService.cartUpdated.subscribe(() => {
      if (this.album) {
        this.updateQuantity();
      }
    });

  }

  getAlbum(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // id exists, convert it to a number and fetch the album details
      const idNumber = Number(id);
      this.albumPageService.getAlbum(idNumber).subscribe(albm => {
        this.album = albm;
        this.updateQuantity();
        // Assuming you have received the JSON response and stored it in 'album' variable
        if (this.album?.yt_link) {
          this.ytLink = this.sanitizer.bypassSecurityTrustHtml(this.album.yt_link);
        }
        // Fetch album ratings here
        this.albumRatingService.getAlbumRatings(idNumber).subscribe(ratings => {
          // console.log("ratings: ", ratings)
          this.upVotes = ratings.up_votes;
          this.downVotes = ratings.down_votes;
        });

      },
        albumError => {
          console.error('Error fetching album:', albumError);
        }
      );
    } else {
      console.error('Album ID is null or undefined.');
    }
  }

  updateQuantity(): void {
    if (this.album) {
      const cartItem = this.cartService.getCart().find(item => item.album.id === this.album?.id);
      this.quantity = cartItem ? cartItem.quantity : 0;
    }
  }

  incrementQuantity(): void {
    if (this.album) {
      this.cartService.addToCart(this.album);
    }
  }

  decrementQuantity(): void {
    if (this.album && this.quantity > 0) {
      this.cartService.decrementQuantity(this.album);
    }
  }

}


