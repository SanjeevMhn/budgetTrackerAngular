import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { UserStore } from '../../store/user-store';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  userStore = inject(UserStore);
  router = inject(Router);
  ONE_DAY_TOKEN = 24 * 60 * 60 * 1000;

  authenticateUser(password: number): void | string {
    if (this.userStore.getUserDetail().password() === password) {
      this.userStore.setUserData({
        authenticated: true,
      });
      this.router.navigate(['/']);

      setTimeout(() => {
        this.logoutUser();
      }, this.ONE_DAY_TOKEN);
    }
    return 'Incorrect Passcode';
  }

  logoutUser() {
    this.userStore.setUserData({
      authenticated: false,
    });

    // this.router.navigate(['/login']);
    this.router.navigate([environment.apiUrl])
  }
}
