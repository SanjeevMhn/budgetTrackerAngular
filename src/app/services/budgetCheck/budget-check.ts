import { computed, effect, inject, Injectable } from '@angular/core';
import { BudgetStore } from '../../store/budgets-store';
import { Transaction, TransactionStore } from '../../store/transaction-store';
import { SnackBar } from '../snack-bar';

@Injectable({
  providedIn: 'root',
})
export class BudgetCheck {
  budgetStore = inject(BudgetStore);
  transactionStore = inject(TransactionStore);

  snackBar = inject(SnackBar);

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
            Number(budget.total_spent) + Number(transaction.amount) >=
            Number(budget.limit)
              ? true
              : false,
        };
        this.budgetStore.updateBudget(budget);
        if (this.checkIfBudgetExpired(budget.id)) {
          this.snackBar.open(`${budget.name} budget's limit reached`);
        }
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
            Number(budget.total_spent) + Number(transaction.amount) >=
            Number(budget.limit)
              ? true
              : false,
        };
        this.budgetStore.updateBudget(budget);
        if (this.checkIfBudgetExpired(budget.id)) {
          this.snackBar.open(`${budget.name} budget's limit reached`);
        }
      }
    } else {
      this.budgetStore.getBudgets().forEach((budget) => {
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
            Number(budget.total_spent) + Number(transaction.amount) >=
            Number(budget.limit)
              ? true
              : false,
        };
        this.budgetStore.updateBudget(budget);
        if (this.checkIfBudgetExpired(budget.id)) {
          this.snackBar.open(`${budget.name} budget's limit reached`);
        }
      });
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
        if (this.checkIfBudgetExpired(budget.id)) {
          this.snackBar.open(`${budget.name} budget's limit reached`);
        }
      }

      this.transactionStore.deleteTransaction(transaction.id);
    } else {
      this.transactionStore.deleteTransaction(transaction!.id);
    }
  }

  budgetDelete(budget_id: string) {
    let transactions = this.transactionStore
      .getAllTransaction()
      .filter((transaction) => transaction.budget_id === budget_id);
    if (transactions.length > 0) {
      transactions = transactions.map((transaction) => {
        let { budget_id, ...newTransaction } = transaction;
        return newTransaction;
      });

      transactions.forEach((transaction) => {
        this.transactionStore.updateTransaction(transaction);
      });

    }
  }

  checkIfBudgetExpired(id: number | string): boolean | undefined {
    return this.budgetStore.getBudgets().find((budget) => budget.id == id)
      ?.limitReached;
  }
}
