import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  LockKeyhole,
  LucideAngularModule,
  Trash,
  Wallet,
} from 'lucide-angular';
import { UserStore } from '../../store/user-store';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, LucideAngularModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  walletIcon = Wallet;
  deleteIcon = Trash;
  lockIcon = LockKeyhole;

  route = inject(ActivatedRoute);
  router = inject(Router);

  constructor() {
    this.route.paramMap.subscribe((params) => {
      const step: 'name' | 'img' | 'password' = params.get('step')! as
        | 'name'
        | 'img'
        | 'password';
      if (step) {
        this.userRegisterState.set(step);
      }
    });
  }

  userStore = inject(UserStore);

  userRegisterState = signal<'name' | 'img' | 'password'>('name');

  userNameForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });

  onUserNameSubmit() {
    if (this.userNameForm.invalid) {
      this.userNameForm.markAllAsTouched();
      return;
    }
    this.userStore.setUserData({
      name: this.userNameForm.get('name')?.value!,
    });
    this.userRegisterState.set('img');
  }

  get name() {
    return this.userNameForm.get('name');
  }

  get img() {
    return this.userImgForm.get('img');
  }

  userImg = signal<string>('');

  userImgForm = new FormGroup({
    img: new FormControl(''),
  });

  onUserImgSubmit() {
    if (this.img && this.img.value) {
      this.userStore.setUserData({
        img: this.img.value,
      });
    }
    this.userRegisterState.set('password');
  }

  userPasswordForm = new FormGroup({
    password: new FormControl('', [Validators.minLength(6)]),
  });

  get password() {
    return this.userPasswordForm.get('password');
  }

  onPasswordSubmit() {
    if (this.userPasswordForm.invalid) {
      this.userPasswordForm.markAllAsTouched();
      return;
    }
    if (this.password && this.password.value) {
      this.userStore.setUserData({
        password: this.password.value,
      });
      this.router.navigate(['/']);
    }
  }

  onPasswordSkip() {
    this.userStore.setUserData({
      password_skipped: true,
    });

    this.router.navigate(['/']);
  }

  onImgUpload(event: any) {
    let file = event.target.files[0] as Blob;
    const reader = new FileReader();
    reader.onload = () => {
      let res = reader.result as string;
      this.userImgForm.get('img')?.setValue(res);
      this.userImg.set(res);
    };
    reader.readAsDataURL(file);
  }
}
