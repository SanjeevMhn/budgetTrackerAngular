import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChevronLeft, Ellipsis, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-add-transaction',
  imports: [LucideAngularModule],
  templateUrl: './add-transaction.html',
  styleUrl: './add-transaction.scss',
})
export class AddTransaction {
  backButtonIcon = ChevronLeft;
  ellipsesHorIcon = Ellipsis;

  dialogRef = inject(MatDialogRef<AddTransaction>);
  public data: {
    type: 'expense' | 'income';
  } = inject(MAT_DIALOG_DATA);

  closeDialog() {
    this.dialogRef.close();
  }
}
