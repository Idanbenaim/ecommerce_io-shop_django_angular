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



  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  handleVoteChanged(vote: number): void {
    console.log('Vote changed:', vote);
    // You can add your logic here to handle the vote change event
  }

}
  // ngOnInit(): void {
  //   this.subscription = this.orderService.getAllOrders().subscribe({
  //     next: (orders: Order[]) => {
  //       this.orders = orders;
  //     },
  //     error: (error) => {
  //       console.error('Error fetching orders:', error);
  //     }
  //   });
  // }
  // ngOnInit(): void {
  //   this.subscription = this.orderService.getAllOrders().subscribe({
  //     next: (orders: Order[]) => {
  //       this.orders = orders;
  //       console.log("this.orders: ", this.orders);

  //       this.orders.forEach(order => {
  //         order.orderItems.forEach(item => {
  //           const albumId = item.album;
  //           console.log("line 48 my-orders albumId: ", albumId)
  //           this.albumPageService.getAlbum(this.albumId).subscribe({
  //             next: (album: Album) => {
  //               // Update the album property in each order item
  //               item.album = album;
  //               console.log("line 53 my-orders item.album: ", item.album)
  //             }
  //           })
  //         })
  //       })

  //     },
  //     error: (error) => {
  //       console.error('Error fetching orders:', error);
  //     }
  //   });
  // }


  // ngOnInit(): void {
  //   this.subscription = this.orderService.getAllOrders().subscribe({
  //     next: (orders: Order[]) => {
  //       this.orders = orders;
  //       console.log("this.orders: ", this.orders);

  //       // Fetch album details for each order item
  //       this.orders.forEach(order => {
  //         order.orderItems.forEach((item: OrderItem) => {
  //           item.album = this.albumPageService.getAlbum(item.album);
  //         });
  //       });
  //     },
  //     error: (error) => {
  //       console.error('Error fetching orders:', error);
  //     }
  //   });
  // }



  //   // Get order items
  //   this.orderService.getOrderItems(orderId).subscribe({
  //     next: (orderItems: OrderItem[]) => {
  //       this.orderItems = orderItems;
  //     },
  //     error: (error) => {
  //       console.error(error);
  //     }
  //   });
  // }
// }

