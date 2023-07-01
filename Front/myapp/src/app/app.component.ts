import { Component } from '@angular/core';
import { AlbumsService } from './services/albums.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'myapp';
  // ar=[]


  // constructor(private albums: AlbumsService) {
  //   albums.getAllData().subscribe(res => this.ar=res)
  // }

}
