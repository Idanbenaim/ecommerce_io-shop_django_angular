import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Login } from '../../models/login';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: Login = new Login();

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.authService.login(this.user)
      .subscribe({
        next: res => {
          console.log(res);
          // handle response here. Possibly redirecting to another page
          this.router.navigate(['/albums']);  // navigate to home page
        },
        error: err => {
          console.log(err);
          // handle error here. Showing error message to user
        }
      });
  }
}



// // login.component.ts
// import { Component } from '@angular/core';
// import { AuthService } from '../../services/auth.service';

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css']
// })
// export class LoginComponent {
//   email: string = '';
//   password: string = '';

//   constructor(private AuthService: AuthService) { }

//   login(): void {
//     this.AuthService.auth(this.email, this.password).subscribe(token => {
//       localStorage.setItem('token', token);
//       // Navigate to home page or wherever you want to redirect the user after login
//     });
//   }
// }
