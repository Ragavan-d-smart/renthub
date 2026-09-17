import { Component } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {

  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['RENTER', Validators.required]
    });
  }

  onSubmit(): void {

    if (this.registerForm.invalid) {
      return;
    }

    const user: User = {
      id: crypto.randomUUID(),
      name: this.registerForm.value.name,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      role: this.registerForm.value.role,
      createdAt: new Date().toISOString()
    };

    this.authService.register(user).subscribe({
      next: (response) => {
        console.log('User registered successfully', response);

        this.registerForm.reset({
          role: 'RENTER'
        });
      },
      error: (error) => {
        console.error('Registration failed', error);
      }
    });
  }
}
``