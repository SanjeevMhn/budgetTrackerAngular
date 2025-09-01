import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserStore } from './store/user-store';

export const authGuard: CanActivateFn = (route, state) => {
  const userState = inject(UserStore);
  const router = inject(Router);

  if (userState.getUserDetail().name().length > 0) {
    if (!userState.getUserDetail().password_skipped()) {
      if (!userState.getUserDetail().authenticated()) {
        userState.setUserData({
          authenticated: false,
        });
        router.navigate(['/login']);
        return false;
      } else  {
        return true;
      } 
    } else {
      return true;
    }
  }
  router.navigate(['/register']);
  return false;
};
