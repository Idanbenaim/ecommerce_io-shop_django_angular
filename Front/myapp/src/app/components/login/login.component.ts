// login.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Login } from '../../models/login';
import { Router, ActivatedRoute } from '@angular/router'; // Import ActivatedRoute here
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: Login = new Login();
  returnUrl: string = ""; // Declare returnUrl here

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute, // Inject ActivatedRoute here
    private location: Location
  ) { }

  ngOnInit(): void {
    // Get returnUrl from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/albums';
  }

  onSubmit(): void {
    this.authService.login(this.user)
      .subscribe({
        next: res => {
          if (res.error) {
            this.snackBar.open(res.error, 'Close', {
              duration: 5000,
              verticalPosition: 'top',
              panelClass: ['mat-toolbar', 'mat-warn']
            });
          } else {

            // console.log(res);
            // Navigate to returnUrl here instead of always to '/albums'
            this.router.navigate([this.returnUrl]);
            // window.location.reload();
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
}
