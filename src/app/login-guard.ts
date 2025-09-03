import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserStore } from './store/user-store';

export const loginGuard: CanActivateFn = (route, state) => {
  const userState = inject(UserStore)
  const router = inject(Router)

  if(userState.getUserDetail().name().length > 0){
    if(userState.getUserDetail().authenticated()){
      router.navigate(['/'])
      return false
    }else{
      return true
    }
  }
  router.navigate(['/register'])
  return false;
};
