import { Component } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';
import { SnackbarService } from '../../../core/services/snackbar.service';


@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackbar: SnackbarService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ]
    });
  }

  onSubmit(): void {

    if (this.loginForm.invalid) {
      return;
    }

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    this.authService
      .login(email)
      .subscribe({
        next: (users: User[]) => {

          const user = users[0];

          if (!user) {
            this.snackbar.error(
              'User not found'
            );
            return;
          }

          if (user.password !== password) {
            this.snackbar.error(
              'Invalid password'
            );
            return;
          }

          this.authService.setCurrentUser(user);
          this.snackbar.info(
            `Welcome ${user.name}`
          );

          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Login failed', error);
        }
      });
  }
}