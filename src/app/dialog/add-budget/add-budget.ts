import { AfterViewInit, Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChevronLeft, Ellipsis, LucideAngularModule } from 'lucide-angular';
import { Budget, BudgetStore } from '../../store/budgets-store';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-budget',
  imports: [LucideAngularModule, ReactiveFormsModule, DatePipe],
  templateUrl: './add-budget.html',
  styleUrl: './add-budget.scss',
})
export class AddBudget implements AfterViewInit {
  backButtonIcon = ChevronLeft;
  ellipsesHorIcon = Ellipsis;

  dialogRef = inject(MatDialogRef<AddBudget>);
  budgetStore = inject(BudgetStore);
  public data: {
    budget: Budget;
  } = inject(MAT_DIALOG_DATA);

  editMode = signal<boolean>(false);

  budgetForm = new FormGroup({
    name: new FormControl(''),
    limit: new FormControl('', [Validators.required, Validators.min(100)]),
  });

  get date() {
    return new Date();
  }

  get limit() {
    return this.budgetForm.get('limit');
  }


  ngAfterViewInit(): void {
    if (
      this.data &&
      this.data.budget &&
      this.data.budget !== null &&
      this.data.budget !== undefined
    ) {
      // this.budgetForm.get('month')!.setValue(this.data.budget.date);
      // this.budgetForm
      //   .get('amount')!
      //   .setValue(this.data.budget.amount.toString());
      this.budgetForm.get('limit')?.setValue(this.data.budget.limit.toString())
      this.budgetForm.get('name')?.setValue(this.data.budget.name)
      this.editMode.set(true);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  onBudgetSubmit() {
    if (this.budgetForm.invalid) {
      this.budgetForm.markAllAsTouched();
      return;
    }

    if (this.editMode()) {
      let budget = {
        ...this.data.budget,
        ...this.budgetForm.value,
      } as Budget;
      this.budgetStore.updateBudget(budget);
    } else {
      let budget:Budget = {
        id: Date.now(),
        name: this.budgetForm.get('name')?.value!,
        date: new Date().toString(),
        limit: this.budgetForm.get('limit')?.value!,
        limitReached: false,
        total_spent: 0,
      };
      this.budgetStore.addBudget(budget);
    }
    this.closeDialog();
  }
}
