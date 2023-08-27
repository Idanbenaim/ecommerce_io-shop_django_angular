// my-orders.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, firstValueFrom } from 'rxjs';
import { Order } from 'src/app/models/order';
import { OrderItem } from 'src/app/models/order-item';
import { AlbumPageService } from 'src/app/services/album-page.service';
import { Album } from 'src/app/models/album';
import { OrderService } from 'src/app/services/order.service';
import { BASE_API_URL } from 'src/app/api.config';
import { AlbumRating } from 'src/app/models/album-rating';


@Component({
  selector: 'app-order-details',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit, OnDestroy {
  BASE_API_URL = BASE_API_URL;
  orders: Order[] = [];
  order_items: OrderItem[] | null = null;
  subscription: Subscription | undefined;
  album_id: number = 0;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private albumPageService: AlbumPageService,

  ) { }

ngOnInit(): void {
  this.subscription = this.orderService.getAllOrders().subscribe({
    next: async (orders: Order[]) => {
      this.orders = orders;
      console.log("this.orders: ", this.orders);

      for (const order of this.orders) {
        // console.log("line 74 my-orders order: ", order)
        for (const item of order.order_items) {
          // console.log("line 76 my-orders item: ", item)
          try {
            // console.log("line 81 my-orders item.album: ", item.album)
            const album = await firstValueFrom(this.albumPageService.getAlbum(item.album)); //this.albumId
            // console.log("line 82 my-orders item.album: ", album)
            item.album = album;
            console.log("line 84 my-orders item.album: ", item.album);
          } catch (error) {
            console.error('Error fetching album:', error);
          }
        }
      }
    },
    error: (error) => {
      console.error('Error fetching orders:', error);
    }
  });
}


  refreshPage(): void {
    window.location.reload();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.refreshPage(); 
    }
  }


  // ngOnDestroy(): void {
  //   if (this.subscription) {
  //     this.subscription.unsubscribe();
  //   }
  // }

  handleVoteChanged(vote: number): void {
    // console.log('Vote changed:', vote);
  }
}

