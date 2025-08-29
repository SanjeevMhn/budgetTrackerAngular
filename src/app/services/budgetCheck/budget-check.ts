import { computed, inject, Injectable } from '@angular/core';
import { BudgetStore } from '../../store/budgets-store';
import { TransactionStore } from '../../store/transaction-store';

@Injectable({
  providedIn: 'root',
})
export class BudgetCheck {
  budgetStore = inject(BudgetStore);
  transactionsStore = inject(TransactionStore);

  getCurrentMonthTotalExpenses = computed(() => {
    return this.transactionsStore.expensesByMonth().reduce((acc, curr) => {
      acc += Number(curr.amount);
      return acc;
    }, 0);
  });

  getCurrentBudgetState = computed(() => {
    return (
      (this.getCurrentMonthTotalExpenses() /
        Number(this.budgetStore.budgetOfCurrentMonth().amount)) *
      100
    )
      .toFixed(0)
      .toString();
  });
}
