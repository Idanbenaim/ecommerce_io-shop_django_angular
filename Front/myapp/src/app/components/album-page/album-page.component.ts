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
      });
    } else {
      // id is null or undefined, handle this case here. For example, you could redirect to a 404 page.
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


