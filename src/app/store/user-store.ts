import { withStorageSync } from '@angular-architects/ngrx-toolkit';
import { computed, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Auth } from '../services/auth/auth';

export type User = {
  name: string;
  img: string;
  password: number | null;
  password_skipped: boolean;
  authenticated: boolean;
};

type UserStoreState = User;

const initialState: UserStoreState = {
  name: '',
  img: '',
  password: null,
  password_skipped: false,
  authenticated: false,
};

export const UserStore = signalStore(
  { providedIn: 'root' },
  withState<UserStoreState>(initialState),
  withComputed((user) => ({
    getUserDetail: computed(() => {
      return user;
    }),
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
