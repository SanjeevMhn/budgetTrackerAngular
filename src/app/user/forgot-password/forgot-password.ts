import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Eye, EyeClosed, Lock, LucideAngularModule } from 'lucide-angular';
import { UserStore } from '../../store/user-store';
import { Router, RouterLink } from '@angular/router';
import { SnackBar } from '../../services/snack-bar';

@Component({
  selector: 'app-forgot-password',
  imports: [LucideAngularModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword {
  eyeIcon = Eye;
  eyeClosedIcon = EyeClosed;
  lockIcon = Lock

  userStore = inject(UserStore);
  router = inject(Router);
  snackBar = inject(SnackBar);

  forgotPasswordForm = new FormGroup({
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(/^[0-9]+$/),
    ]),
  });

  passwordState = signal<'password' | 'text'>('password');

  get password() {
    return this.forgotPasswordForm.get('password');
  }

  togglePassword(event: any) {
    event.stopPropagation();
    this.passwordState.set(
      this.passwordState() == 'password' ? 'text' : 'password'
    );
  }

  onForgotPasswordSubmit() {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    this.userStore.setUserData({
      password: Number(this.password?.value),
    });

    this.router.navigate(['/']);
    this.snackBar.open('Password Reset Successful, Please login');
  }
}
