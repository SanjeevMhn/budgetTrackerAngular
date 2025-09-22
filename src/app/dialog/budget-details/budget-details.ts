import {
  Component,
  computed,
  inject,
  signal,
  WritableSignal,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LucideAngularModule, X } from 'lucide-angular';
import { BudgetStore } from '../../store/budgets-store';
import { TransactionStore } from '../../store/transaction-store';
import { DatePipe } from '@angular/common';
import { TransactionsList } from '../../transactions-list/transactions-list';

@Component({
  selector: 'app-budget-details',
  imports: [LucideAngularModule, DatePipe, TransactionsList],
  templateUrl: './budget-details.html',
  styleUrl: './budget-details.scss',
})
export class BudgetDetails{
  closeIcon = X;

  dialogRef = inject(MatDialogRef<BudgetDetails>);
  public data: WritableSignal<{
    budget_id: number | string;
  }> = signal(inject(MAT_DIALOG_DATA));

  budgetStore = inject(BudgetStore);
  transactionStore = inject(TransactionStore);

  budgetDetail = computed(() => {
    return this.budgetStore
      .getBudgets()
      .find((budget) => budget.id == this.data().budget_id);
  });

  budgetTransactions = computed(() => {
    return this.transactionStore.getAllTransaction().filter(transaction => transaction.budget_id == this.data().budget_id)
  })

  close() {
    this.dialogRef.close();
  }

  getTotalPercentageUsed(
    spent: number | string,
    limit: number | string
  ): number {
    if (spent && limit) {
      return Number(((Number(spent) / Number(limit)) * 100).toFixed(0));
    }
    return 0;
  }

  getRemaining(spent: number | string, limit: number | string) {
    if (spent && limit) {
      return Number(limit) - Number(spent);
    }
    return limit;
  }
}
