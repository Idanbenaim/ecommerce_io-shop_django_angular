import { Component } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {
  isTagOpen: boolean = false;

  constructor() { }

  toggleTag() {
    this.isTagOpen = !this.isTagOpen;
  }
}



// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-navigation',
//   templateUrl: './navigation.component.html',
//   styleUrls: ['./navigation.component.css']
// })
// export class NavigationComponent {
//   showCartPanel: boolean = false;

//   constructor() { }

//   ngOnInit() { }

//   toggleCartPanel() {
//     this.showCartPanel = !this.showCartPanel;
//   }
// }
  // isTagOpen: boolean = false;

  // toggleTag() {
  //   this.isTagOpen = !this.isTagOpen;
  // }


  // openTag() {
  //   this.isTagOpen = true;
  // }

  // closeTag() {
  //   this.isTagOpen = false;
  // }
// }
