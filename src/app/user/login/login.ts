import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Eye, EyeClosed, Lock, LucideAngularModule } from 'lucide-angular';
import { Auth } from '../../services/auth/auth';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [LucideAngularModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  lockIcon = Lock;
  authSerice = inject(Auth);
  userLoginForm = new FormGroup({
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(/^[0-9]+$/),
    ]),
  });

  loginErrorMessage = signal<string | null>(null);

  get password() {
    return this.userLoginForm.get('password');
  }

  passwordState = signal<'password' | 'text'>('password');
  eyeIcon = Eye
  eyeClosedIcon = EyeClosed

  togglePassword(event: any) {
    event.stopPropagation();
    this.passwordState.set(
      this.passwordState() == 'password' ? 'text' : 'password'
    );
  }

  onUserLogin() {
    if (this.userLoginForm.invalid) {
      this.userLoginForm.markAllAsTouched();
      return;
    }
    let message = this.authSerice.authenticateUser(
      Number(this.password?.value)
    );
    if (message) {
      this.loginErrorMessage.set(message);
    }
  }
}
