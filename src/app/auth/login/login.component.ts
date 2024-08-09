import { Component, DestroyRef } from '@angular/core';
import {
   FormBuilder,
   FormGroup,
   FormsModule,
   ReactiveFormsModule,
   Validators,
} from '@angular/forms';
import { AuthService } from '../auth.service';
import { NgClass } from '@angular/common';
import { tap } from 'rxjs/internal/operators/tap';

@Component({
   selector: 'app-login',
   standalone: true,
   imports: [FormsModule, NgClass, ReactiveFormsModule],
   templateUrl: './login.component.html',
   styleUrl: './login.component.scss',
})
export class LoginComponent {
   loginForm: FormGroup;
   submitted = false;

   constructor(
      private readonly authService: AuthService,
      private readonly formBuilder: FormBuilder
   ) {
      this.loginForm = this.formBuilder.group({
         username: ['', Validators.required],
         password: ['', Validators.required],
      });
   }

   get formControls() {
      return this.loginForm.controls;
   }

   login() {
      this.submitted = true;
      if (this.loginForm.invalid) {
         return;
      }
      const username = this.loginForm.value.username;
      const password = this.loginForm.value.password;
      if (username && password) {
         this.authService
            .login(username, password)
            .pipe(tap(() => console.log('User logged in: ', username)))
            .subscribe();
      }
   }
}
