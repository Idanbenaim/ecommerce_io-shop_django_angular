// login.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Login } from '../../models/login';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: Login = new Login();

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.authService.login(this.user)
      .subscribe({
        next: res => {
          if (res.error) {
            this.snackBar.open(res.error, 'Close', {
              duration: 10000,
              verticalPosition: 'top',
              panelClass: ['mat-toolbar', 'mat-warn']
            });
          } else {
            console.log(res);
            this.router.navigate(['/albums']);
          }
        },
        error: err => {
          this.snackBar.open(err, 'Close', {
            duration: 10000,
            verticalPosition: 'top',
            panelClass: ['mat-toolbar', 'mat-warn']
          });
        }
      });
  }


  // onSubmit(): void {
  //   this.authService.login(this.user)
  //     .subscribe({
  //       next: res => {
  //         console.log(res);
  //         // handle response here. Possibly redirecting to another page
  //         this.router.navigate(['/albums']);  // navigate to home page
  //       },
  //       error: err => {
  //         console.log(err);
  //         // handle error here. Showing error message to user
  //       }
  //     });
  // }
}
