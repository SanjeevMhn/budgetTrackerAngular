import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ChevronLeft, Ellipsis, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-add-budget',
  imports: [LucideAngularModule],
  templateUrl: './add-budget.html',
  styleUrl: './add-budget.scss'
})
export class AddBudget {

  backButtonIcon = ChevronLeft
  ellipsesHorIcon = Ellipsis

  dialogRef = inject(MatDialogRef)

  closeDialog(){
    this.dialogRef.close()
  }
}
