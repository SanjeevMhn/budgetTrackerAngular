import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Eye, EyeClosed, LucideAngularModule, X } from 'lucide-angular';
import { UserStore } from '../../store/user-store';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AlertDialog } from '../alert-dialog/alert-dialog';
import { SnackBar } from '../../services/snack-bar';

@Component({
  selector: 'app-profile-details',
  imports: [LucideAngularModule, ReactiveFormsModule],
  templateUrl: './profile-details.html',
  styleUrl: './profile-details.scss',
})
export class ProfileDetails implements AfterViewInit {
  closeIcon = X;
  eyeIcon = Eye;
  eyeClosedIcon = EyeClosed;

  dialogRef = inject(MatDialogRef);
  dialog = inject(MatDialog);
  userStore = inject(UserStore);

  snackBar = inject(SnackBar)

  passwordState = signal<'password' | 'text'>('password');

  userForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    password: new FormControl('', [
      Validators.minLength(6),
      Validators.pattern(/^[0-9]+$/),
    ]),
  });

  togglePassword(event:any) {
    event.stopPropagation()
    if (this.passwordState() == 'password') {
      this.passwordState.set('text');
    } else {
      this.passwordState.set('password');
    }
  }

  close() {
    this.dialogRef.close();
  }

  ngAfterViewInit(): void {
    this.userForm.get('name')?.setValue(this.userStore.getUserDetail().name());
    if (!this.userStore.password_skipped()) {
      this.userForm
        .get('password')
        ?.setValue(this.userStore.getUserDetail().password()!.toString());
    }
  }

  get name(){
    return this.userForm.get('name')
  }

  get password() {
    return this.userForm.get('password');
  }

  handleNameForm(){
    if(this.name?.invalid){
      this.name.markAllAsTouched()
      return
    }

    this.userStore.setUserData({
      name: this.name?.value!
    })

    this.snackBar.open('Username Updated!')
  }

  handlePasswordForm() {
    if (this.password?.invalid) {
      this.password.markAsTouched();
      return;
    }

    this.userStore.setUserData({
      password: Number(this.password?.value),
      password_skipped: false,
    });
    this.passwordState.set('password')
    this.snackBar.open('Password Updated!')
  }

  handleRemoveUserPassword() {
    const ref = this.dialog.open(AlertDialog, {
      data: {
        title: 'Remove Password',
        description: 'Are you sure you want to remove password?',
        actionBtnLabel: 'Remove',
      },
    });

    ref.afterClosed().subscribe((res) => {
      if (res) {
        this.userStore.setUserData({
          password: null,
          password_skipped: true,
        });
        this.password?.setValue('');
        this.snackBar.open('Password Removed!')
      }
    });
  }
}
