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
    description: string
  } = inject(MAT_DIALOG_DATA)

  dialog = inject(MatDialogRef<AlertDialog>)

  closeDialog(state:'cancel' | 'delete'){
    this.dialog.close(state)
  }


}
