import { Component, inject, signal } from '@angular/core';
import { BellDot, ChevronLeft, LucideAngularModule, Pen, PenTool, Plus } from 'lucide-angular';
import { UserStore } from '../store/user-store';
import { MatBottomSheet, MatBottomSheetModule, MatBottomSheetRef } from '@angular/material/bottom-sheet'
import { MatDialog } from '@angular/material/dialog';
import { AlertDialog } from '../dialog/alert-dialog/alert-dialog';
import { Router } from '@angular/router';
import { Auth } from '../services/auth/auth';

@Component({
  selector: 'app-profile',
  imports: [LucideAngularModule, MatBottomSheetModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile {

  backButtonIcon = ChevronLeft;
  bellIcon = BellDot;
  plusIcon = Plus;
  editIcon = Pen

  userStore = inject(UserStore)
  bottomSheet = inject(MatBottomSheet)
  dialog = inject(MatDialog)
  router = inject(Router)
  authService = inject(Auth)


  openBottomSheet(){
    this.bottomSheet.open(UserImgAction)
  }

  onLogout(){
    const dialogRef = this.dialog.open(AlertDialog,{
      panelClass: 'alert-dialog',
      data:{
        title: 'Logout?',
        description: 'Are you sure you want to logout?',
        actionBtnLabel: 'Logout'
      }
    })

    dialogRef.afterClosed().subscribe(res => {
      if(res){
        this.authService.logoutUser()
      }
    })
  }

}

@Component({
  selector: 'app-user-img-action',
  template: `
    <ul class="selection-list p-[2rem_0] bg-white">
      <li class="item text-[1.8rem] p-[2rem] hover:bg-neutral-300 cursor-pointer rounded-[1.2rem]" (click)="removeCurrentUserImg()">Remove Current Image</li>
      <li class="item text-[1.8rem] p-[2rem] hover:bg-neutral-300 cursor-pointer rounded-[1.2rem]">
        <label for="img">Change Current Image</label>
        <input type="file" id="img" name="img" class="hidden" (change)="changeCurrentImg($event)" />
      </li>
    </ul>
  `,
})
export class UserImgAction{

  bottomSheetRef = inject(MatBottomSheetRef<UserImgAction>)
  userStore = inject(UserStore)
  removeCurrentUserImg(){
    this.userStore.setUserData({
      img: ''
    })
    this.bottomSheetRef.dismiss()
  }

  changeCurrentImg(event:any){
    const file = event.target.files[0]
    const reader = new FileReader()

    reader.onload = () => {
      const result = reader.result as string
      this.userStore.setUserData({
        img: result
      })
    }
    reader.readAsDataURL(file)
    this.bottomSheetRef.dismiss()
  }
}
