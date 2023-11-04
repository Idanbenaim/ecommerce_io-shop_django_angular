import { Component, HostListener } from '@angular/core';
import { InactivityService } from './services/inactivity.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'myapp';

  constructor(private inactivityService: InactivityService) { }

  @HostListener('document:mousemove', ['$event'])
  @HostListener('document:keydown', ['$event'])
  onUserActivity() {
    this.inactivityService.resetInactivityTimer();
  }

}
