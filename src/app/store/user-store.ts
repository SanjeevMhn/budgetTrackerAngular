import { withStorageSync } from '@angular-architects/ngrx-toolkit';
import { computed } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';

export type User = {
  name: string;
  img: string;
  password: string;
  password_skipped: boolean; 
  authenticated: boolean;
};

type UserStoreState = User;

const initialState: UserStoreState = {
  name: '',
  img: '',
  password: '',
  password_skipped: false,
  authenticated: false
};

export const UserStore = signalStore(
  { providedIn: 'root' },
  withState<UserStoreState>(initialState),
  withComputed((user) => ({
    getUserDetail: computed(() => {
      return user;
    }),
    isAuthenticated: computed(() => {
        return user.password_skipped() ? true : user.authenticated()
    })
  })),
  withMethods((store) => ({
    setUserData(data: Partial<User>): void {
      patchState(store, (state) => ({
        ...state,
        ...data,
      }));
    },

  })),
  withStorageSync({
    key: 'user',
  })
);
