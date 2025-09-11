import { Component, inject, signal } from '@angular/core';
import { BellDot, ChevronLeft, LucideAngularModule, Pen, PenTool, Plus } from 'lucide-angular';
import { UserStore } from '../store/user-store';
import { MatBottomSheet, MatBottomSheetModule, MatBottomSheetRef } from '@angular/material/bottom-sheet'
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AlertDialog } from '../dialog/alert-dialog/alert-dialog';
import { Router } from '@angular/router';
import { Auth } from '../services/auth/auth';
//@ts-ignore
import Compress from 'compress.js'
import { ProfileDetails } from '../dialog/profile-details/profile-details';

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
    this.bottomSheet.open(UserImgAction,{
      panelClass: 'alert-dialog'
    })
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

  getUserInitials(name: string){
    let nameArr = name.split(' ')
    return nameArr.length > 2 ? 
      nameArr[0].charAt(0) +' '+nameArr[2].charAt(0) : 
      nameArr.length == 2 ? nameArr[0].charAt(0) + ' ' + nameArr[1].charAt(0) :
      nameArr[0].charAt(0)
  }

  openDialog(dialog: 'profile-details' | string){
    this.dialog.open(ProfileDetails,{
      width: '100vw',
      height: '100vh',
      panelClass: 'transaction-dialog'
    })
  }

}

@Component({
  selector: 'app-user-img-action',
  template: `
  <div class="dialog-container p-[2rem] bg-[#fff] rounded-tr-[2.8rem] rounded-tl-[2.8rem]">
    <ul class="selection-list">
      @if(userStore.getUserDetail().img() !== ''){
        <li class="item text-[1.8rem] p-[2rem] hover:bg-neutral-300 cursor-pointer rounded-[1.2rem]" (click)="removeCurrentUserImg()">Remove Current Image</li>
      }
      <li class="item text-[1.8rem] p-[2rem] hover:bg-neutral-300 cursor-pointer rounded-[1.2rem]">
        <label for="img">
        @if(userStore.getUserDetail().img() !== ''){
          Change Current Image
        }@else {
          Add Image
        }</label>
        <input type="file" id="img" name="img" class="hidden" (change)="changeCurrentImg($event)" />
      </li>
    </ul>
  </div>
  `,
})
export class UserImgAction{

  bottomSheetRef = inject(MatBottomSheetRef<UserImgAction>)
  // dialogRef = inject(MatDialogRef<UserImgAction>)
  userStore = inject(UserStore)
  removeCurrentUserImg(){
    this.userStore.setUserData({
      img: ''
    })
    // this.dialogRef.close()
    this.bottomSheetRef.dismiss()
  }

  async changeCurrentImg(event:any){
    const file = event.target.files[0]
    const reader = new FileReader()
    const compress = new Compress()

    const imgFile = await compress.compress(file,{
      quality: 0.95,
      crop: true,
      maxWidth: 320,
      maxHeight: 320
    })
    reader.onload = () => {
      const result = reader.result as string
      this.userStore.setUserData({
        img: result
      })
    }
    reader.readAsDataURL(imgFile)
    // this.dialogRef.close()
    this.bottomSheetRef.dismiss()
  }
}
