// album-page.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlbumPageService } from 'src/app/services/album-page.service';
import { Album } from 'src/app/models/album';
import { BASE_API_URL } from 'src/app/api.config';
import { CartService } from 'src/app/services/cart.service';


@Component({
  selector: 'app-album-page',
  templateUrl: './album-page.component.html',
  styleUrls: ['./album-page.component.css']
})
export class AlbumPageComponent implements OnInit {
  BASE_API_URL = BASE_API_URL;
  album?: Album;
  quantity: number = 1;

  constructor(private albumPageService: AlbumPageService, private route: ActivatedRoute, private cartService: CartService) { }

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
  addToCart(): void {
    if (this.album) {
      for (let i = 0; i < this.quantity; i++) {
        this.cartService.addToCart(this.album);
      }
    }
  }
}
  // addToCart(album: Album): void {
  //   console.log(album)
  //   this.cartService.addToCart(album);
  // }

