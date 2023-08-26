// register.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Login } from '../../models/login';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  user: Login = new Login();

  constructor(private authService: AuthService, private snackBar: MatSnackBar, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.authService.register(this.user)
      .subscribe({
        next: res => {
          this.snackBar.open(res.message, 'Close', {
            duration: 10000,
            verticalPosition: 'top',
            panelClass: ['mat-toolbar', 'mat-primary']
          });
          this.router.navigate(['/auth']);
        },
        error: err => {
          this.snackBar.open(err.error.message, 'Close', {
            duration: 10000,
            verticalPosition: 'top',
            panelClass: ['mat-toolbar', 'mat-warn']
          });
        }
      });
  }
}
