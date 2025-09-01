import { inject } from '@angular/core';
import { CanActivateFn, Router} from '@angular/router';
import { UserStore } from './store/user-store';

export const authGuard: CanActivateFn = (route, state) => {
  const userState = inject(UserStore)
  const router = inject(Router)

  if(userState.getUserDetail().name().length > 0){
    if(userState.isAuthenticated()){
      return true
    }else{
      router.navigate(['/register/password'])
      return false
    }
  }
  router.navigate(['/register'])
  return false;
};
