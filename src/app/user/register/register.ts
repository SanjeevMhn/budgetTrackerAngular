import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Eye,
  EyeClosed,
  LockKeyhole,
  LucideAngularModule,
  Trash,
  Wallet,
} from 'lucide-angular';
import { UserStore } from '../../store/user-store';
//@ts-ignore
import Compress from 'compress.js';

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
    password: new FormControl('', [
      Validators.minLength(6),
      Validators.pattern(/^[0-9]+$/),
    ]),
  });

  get password() {
    return this.userPasswordForm.get('password');
  }

  passwordState = signal<'password' | 'text'>('password');

  eyeIcon = Eye;
  eyeClosedIcon = EyeClosed;

  togglePassword(event: any) {
    event.stopPropagation();
    this.passwordState.set(
      this.passwordState() == 'password' ? 'text' : 'password'
    );
  }

  onPasswordSubmit() {
    if (this.userPasswordForm.invalid) {
      this.userPasswordForm.markAllAsTouched();
      return;
    }
    if (this.password && this.password.value) {
      this.userStore.setUserData({
        password: Number(this.password.value),
        password_skipped: false,
        authenticated: true,
      });
      this.router.navigate(['/']);
    }
  }

  onPasswordSkip() {
    this.userStore.setUserData({
      password_skipped: true,
      authenticated: true,
    });

    this.router.navigate(['/']);
  }

  async onImgUpload(event: any) {
    let file = event.target.files[0] as Blob;
    const compress = new Compress();

    const imgFile = await compress.compress(file, {
      quality: 0.95,
      crop: true,
      maxWidth: 320,
      maxHeight: 320,
    });
    const reader = new FileReader();
    reader.onload = () => {
      let res = reader.result as string;
      this.userImgForm.get('img')?.setValue(res);
      this.userImg.set(res);
    };
    reader.readAsDataURL(imgFile);
  }
}
