import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class InactivityService {
  private inactivityTimer: any;
  private inactivityTimeout = 1 * 60 * 1000; // 15 minutes in milliseconds

  constructor(private authService: AuthService) { }

  resetInactivityTimer() {
    clearTimeout(this.inactivityTimer);
    this.inactivityTimer = setTimeout(() => {
      this.authService.logout();
    }, this.inactivityTimeout);
  }
}
