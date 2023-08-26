// navigation.component.ts
import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  isTagOpen: boolean = false;

  itemCount = 0;

  constructor(
    private cartService: CartService,
    public authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.cartService.itemCount.subscribe((count: number) => {
      this.itemCount = count;
    });
  }

  toggleTag() {
    this.isTagOpen = !this.isTagOpen;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}

