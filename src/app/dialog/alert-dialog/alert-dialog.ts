import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-alert-dialog',
  imports: [],
  templateUrl: './alert-dialog.html',
  styleUrl: './alert-dialog.scss'
})
export class AlertDialog {

  public data:{
    title: string,
    description: string,
    cancelBtnLabel?: string,
    actionBtnLabel?: string
  } = inject(MAT_DIALOG_DATA)

  dialog = inject(MatDialogRef<AlertDialog>)

  closeDialog(state:boolean){
    this.dialog.close(state)
  }


}
