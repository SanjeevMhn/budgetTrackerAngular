import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';

import { withStorageSync } from '@angular-architects/ngrx-toolkit';

export type Transaction = {
  id: string | number;
  date: string;
  amount: string;
  type: 'income' | 'expense';
  name: string;
  budget_id?: string;
};

type TransactionStoreState = {
  transactions: Array<Transaction>;
  currentDate: Date;
};

const initialState: TransactionStoreState = {
  transactions: [],
  currentDate: new Date(),
};

export const TransactionStore = signalStore(
  { providedIn: 'root' },
  withState<TransactionStoreState>(initialState),
  withComputed(({ transactions, currentDate }) => ({
    totalBalance: () => {
      return transactions()
        .filter(
          (transaction) =>
            new Date(transaction.date).getFullYear() ==
              currentDate().getFullYear() &&
            new Date(transaction.date).getMonth() ==
              new Date(currentDate()).getMonth()
        )
        .reduce((acc, curr) => {
          if (curr.type == 'expense') {
            acc -= Number(curr.amount);
          }
          if (curr.type == 'income') {
            acc += Number(curr.amount);
          }
          return acc;
        }, 0);
    },
    totalIncome: computed(() => {
      return transactions()
        .filter(
          (transaction) =>
            new Date(transaction.date).getFullYear() ==
              new Date(currentDate()).getFullYear() &&
            new Date(transaction.date).getMonth() ==
              new Date(currentDate()).getMonth()
        )
        .reduce((acc, curr) => {
          if (curr.type == 'income') {
            acc += Number(curr.amount);
          }
          return acc;
        }, 0);
    }),
    totalExpenses: computed(() => {
      return transactions()
        .filter(
          (transaction) =>
            new Date(transaction.date).getFullYear() ==
              currentDate().getFullYear() &&
            new Date(transaction.date).getMonth() ==
              new Date(currentDate()).getMonth()
        )
        .reduce((acc, curr) => {
          if (curr.type == 'expense') {
            acc += Number(curr.amount);
          }

          return acc;
        }, 0);
    }),

    incomeByWeek: computed(() => {
      const date = new Date(currentDate());
      date.setDate(date.getDate() - 7);

      return transactions().filter(
        (tran) =>
          tran.type == 'income' &&
          new Date(tran.date).getFullYear() == new Date(currentDate()).getFullYear() &&
          new Date(tran.date).getMonth() == new Date(currentDate()).getMonth() &&
          new Date(tran.date) >= date
      );
    }),
    incomeByHalfMonth: computed(() => {
      const date = new Date(currentDate());
      date.setDate(date.getDate() - 15);

      return transactions().filter(
        (tran) =>
          tran.type == 'income' &&
          new Date(tran.date).getFullYear() == new Date(currentDate()).getFullYear() &&
          new Date(tran.date).getMonth() == new Date(currentDate()).getMonth() &&
          new Date(tran.date) >= date
      );
    }),
    incomeByMonth: computed(() => {
      const date = new Date(currentDate());
      date.setDate(date.getDate() - 30);

      return transactions().filter(
        (tran) =>
          tran.type == 'income' &&
          new Date(tran.date).getFullYear() == new Date(currentDate()).getFullYear() &&
          new Date(tran.date).getMonth() == new Date(currentDate()).getMonth() &&
          new Date(tran.date) >= date
      );
    }),

    expensesByWeek: computed(() => {
      const date = new Date(currentDate());
      date.setDate(date.getDate() - 7);

      return transactions().filter(
        (tran) =>
          tran.type == 'expense' &&
          new Date(tran.date).getFullYear() == new Date(currentDate()).getFullYear() &&
          new Date(tran.date).getMonth() == new Date(currentDate()).getMonth() &&
          new Date(tran.date) >= date
      );
    }),
    expensesByHalfMonth: computed(() => {
      const date = new Date(currentDate());
      date.setDate(date.getDate() - 15);

      return transactions().filter(
        (tran) =>
          tran.type == 'expense' &&
          new Date(tran.date).getFullYear() == new Date(currentDate()).getFullYear() &&
          new Date(tran.date).getMonth() == new Date(currentDate()).getMonth() &&
          new Date(tran.date) >= date
      );
    }),
    expensesByMonth: computed(() => {
      const date = new Date(currentDate());
      date.setDate(date.getDate() - 30);

      return transactions().filter(
        (tran) =>
          tran.type == 'expense' &&
          new Date(tran.date).getFullYear() == new Date(currentDate()).getFullYear() &&
          new Date(tran.date).getMonth() == new Date(currentDate()).getMonth() &&
          new Date(tran.date) >= date
      );
    }),

    getAllTransaction: computed(() => {
      return transactions().filter(
        (transaction) =>
          new Date(transaction.date).getFullYear() ==
            currentDate().getFullYear() &&
          new Date(transaction.date).getMonth() ==
            new Date(currentDate()).getMonth()
      );
    }),
  })),
  withMethods((store) => ({
    setDate(date: Date): void {
      patchState(store, (state) => ({
        currentDate: date,
      }));
    },
    addTransaction(transaction: Transaction): void {
      patchState(store, (state) => ({
        transactions: [transaction, ...state.transactions],
      }));
    },
    updateTransaction(transaction: Transaction): void {
      patchState(store, (state) => ({
        transactions: state.transactions.map((t) => {
          if (t.id == transaction.id) {
            return {
              ...t,
              ...transaction,
            };
          }
          return t;
        }),
      }));
    },

    deleteTransaction(id: string | number) {
      patchState(store, (state) => ({
        transactions: state.transactions.filter((t) => t.id !== id),
      }));
    },

    reset(){
      patchState(store, (state) => ({
        transactions: [],
      }))
    }
  })),
  withStorageSync({
    key: 'transactions',
  })
);
