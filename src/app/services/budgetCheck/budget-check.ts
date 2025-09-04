import { computed, inject, Injectable } from '@angular/core';
import { BudgetStore } from '../../store/budgets-store';
import { Transaction, TransactionStore } from '../../store/transaction-store';

@Injectable({
  providedIn: 'root',
})
export class BudgetCheck {
  budgetStore = inject(BudgetStore);
  transactionStore = inject(TransactionStore);

  addTransaction(transaction: Transaction) {
    if (transaction.budget_id) {
      let budget = this.budgetStore
        .getBudgets()
        .find((bud) => bud.id == transaction.budget_id);
      if (budget) {
        budget = {
          ...budget,
          total_spent: Number(budget.total_spent) + Number(transaction.amount),
          limitReached:
            Number(budget.total_spent) + Number(transaction.amount) >
            Number(budget.limit)
              ? true
              : false,
        };
        this.budgetStore.updateBudget(budget);
      }
    }
    this.transactionStore.addTransaction(transaction);
  }

  updateTransaction(transaction: Transaction) {

    this.transactionStore.updateTransaction(transaction);
    if (transaction.budget_id) {
      let budget = this.budgetStore
        .getBudgets()
        .find((bud) => bud.id == transaction.budget_id);
      if (budget) {
        budget = {
          ...budget,
          total_spent: this.transactionStore
            .getAllTransaction()
            .reduce((acc, curr) => {
              if (curr.budget_id == budget!.id) {
                acc += Number(curr.amount);
              }
              return acc;
            }, 0),
          limitReached:
            Number(budget.total_spent) + Number(transaction.amount) >
            Number(budget.limit)
              ? true
              : false,
        };
        this.budgetStore.updateBudget(budget);
      }
    }
  }

  deleteTransaction(id: number | string) {
    let transaction = this.transactionStore
      .transactions()
      .find((ts) => ts.id == id);
    if (transaction && transaction.budget_id) {
      let budget = this.budgetStore
        .getBudgets()
        .find((bud) => bud.id == transaction.budget_id);
      if (budget) {
        budget = {
          ...budget,
          total_spent: Number(budget.total_spent) - Number(transaction.amount),
          limitReached:
            Number(budget.total_spent) - Number(transaction.amount) >
            Number(budget.limit)
              ? true
              : false,
        };
        this.budgetStore.updateBudget(budget);
      }

      this.transactionStore.deleteTransaction(transaction.id);
    }
  }
}
