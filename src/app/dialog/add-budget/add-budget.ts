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

@Component({
  selector: 'app-add-budget',
  imports: [LucideAngularModule, ReactiveFormsModule],
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
    month: new FormControl('', [Validators.required]),
    amount: new FormControl('', [Validators.required, Validators.min(100)]),
  });

  get month() {
    return this.budgetForm.get('month');
  }

  get amount() {
    return this.budgetForm.get('amount');
  }

  ngAfterViewInit(): void {
    if (
      this.data &&
      this.data.budget &&
      this.data.budget !== null &&
      this.data.budget !== undefined
    ) {
      this.budgetForm.get('month')!.setValue(this.data.budget.date);
      this.budgetForm
        .get('amount')!
        .setValue(this.data.budget.amount.toString());
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
      } as Budget
      this.budgetStore.updateBudget(budget)
    } else {
      let budget = {
        id: Date.now(),
        recurring: false,
        amount: this.budgetForm.get('amount')?.value,
        date: this.budgetForm.get('month')?.value,
        limitReached: false,
      } as Budget;
      this.budgetStore.addBudget(budget);
    }
    this.closeDialog();
  }
}
