// album-page.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlbumPageService } from 'src/app/services/album-page.service';
import { Album } from 'src/app/models/album';
import { BASE_API_URL } from 'src/app/api.config';
import { CartService } from 'src/app/services/cart.service';
import { CartItem } from 'src/app/models/cart-item';


@Component({
  selector: 'app-album-page',
  templateUrl: './album-page.component.html',
  styleUrls: ['./album-page.component.css']
})
export class AlbumPageComponent implements OnInit {
  BASE_API_URL = BASE_API_URL;
  album?: Album;
  quantity: number = 0;


  constructor(private albumPageService: AlbumPageService, private route: ActivatedRoute, private cartService: CartService) { }

  ngOnInit(): void {
    this.getAlbum();
    this.cartService.cartUpdated.subscribe((item: CartItem) => {
      if (this.album && this.album.id === item.album.id) {
        this.quantity = item.quantity;
      }
    });
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
