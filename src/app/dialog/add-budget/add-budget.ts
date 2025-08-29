import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ChevronLeft, Ellipsis, LucideAngularModule } from 'lucide-angular';
import { Budget, BudgetStore } from '../../store/budgets-store';

@Component({
  selector: 'app-add-budget',
  imports: [LucideAngularModule,ReactiveFormsModule],
  templateUrl: './add-budget.html',
  styleUrl: './add-budget.scss'
})
export class AddBudget {

  backButtonIcon = ChevronLeft
  ellipsesHorIcon = Ellipsis

  dialogRef = inject(MatDialogRef<AddBudget>)
  budgetStore = inject(BudgetStore)

  budgetForm = new FormGroup({
    month: new FormControl('',[Validators.required]),
    amount: new FormControl('',[Validators.required, Validators.min(100)])
  })

  get month(){
    return this.budgetForm.get('month')
  }

  get amount(){
    return this.budgetForm.get('amount')
  }

  closeDialog(){
    this.dialogRef.close()
  }

  onBudgetSubmit(){
    if(this.budgetForm.invalid){
      this.budgetForm.markAllAsTouched()
      return
    }

    let budget = {
      id: Date.now(),
      recurring: false,
      amount: this.budgetForm.get('amount')?.value,
      date: this.budgetForm.get('month')?.value,
      limitReached: false
    } as Budget

    this.budgetStore.addBudget(budget)
    this.closeDialog()
  }
}
