import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserStore } from './store/user-store';

export const registerGuard: CanActivateFn = (route, state) => {
  const userState = inject(UserStore);
  const router = inject(Router);

  if (userState.getUserDetail().name().length > 0) {
    router.navigate(['/']);
    return false;
  }
  return true;
};
