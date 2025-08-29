import { computed } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';

import { withStorageSync } from '@angular-architects/ngrx-toolkit'

export type Transaction = {
  id: string | number;
  date: string;
  amount: string;
  type: 'income' | 'expense';
  name: string;
};

type TransactionStoreState = {
  transactions: Array<Transaction>;
};

const initialState: TransactionStoreState = {
  transactions: [],
};

export const TransactionStore = signalStore(
  { providedIn: 'root' },
  withState<TransactionStoreState>(initialState),
  withComputed(({ transactions }) => ({
    totalBalance: computed(() => {
      return transactions().reduce((acc, curr) => {
        if (curr.type == 'expense') {
          acc -= Number(curr.amount);
        }
        if (curr.type == 'income') {
          acc += Number(curr.amount);
        }
        return acc;
      }, 0);
    }),
    totalIncome: computed(() => {
      return transactions().reduce((acc, curr) => {
        if (curr.type == 'income') {
          acc += Number(curr.amount);
        }
        return acc;
      }, 0);
    }),
    totalExpenses: computed(() => {
      return transactions().reduce((acc, curr) => {
        if (curr.type == 'expense') {
          acc += Number(curr.amount);
        }

        return acc;
      }, 0);
    }),

    incomeByWeek: () => {
      const date = new Date();
      date.setDate(date.getDate() - 7);

      return transactions().filter(
        (tran) => tran.type == 'income' && new Date(tran.date) >= date
      );
    },
    incomeByHalfMonth: () => {
      const date = new Date();
      date.setDate(date.getDate() - 15);

      return transactions().filter(
        (tran) => tran.type == 'income' && new Date(tran.date) >= date
      );
    },
    incomeByMonth: () => {
      const date = new Date();
      date.setDate(date.getDate() - 30);

      return transactions().filter(
        (tran) => tran.type == 'income' && new Date(tran.date) >= date
      );
    },

    expensesByWeek: () => {
      const date = new Date();
      date.setDate(date.getDate() - 7);

      return transactions().filter(
        (tran) => tran.type == 'expense' && new Date(tran.date) >= date
      );
    },
    expensesByHalfMonth: () => {
      const date = new Date();
      date.setDate(date.getDate() - 15);

      return transactions().filter(
        (tran) => tran.type == 'expense' && new Date(tran.date) >= date
      );
    },
    expensesByMonth: () => {
      const date = new Date();
      date.setDate(date.getDate() - 30);

      return transactions().filter(
        (tran) => tran.type == 'expense' && new Date(tran.date) >= date
      );
    },
  })),
  withMethods((store) => ({
    addTransaction(transaction: Transaction): void {
      patchState(store, (state) => ({
        transactions: [ transaction, ...state.transactions],
      }));
    },
    updateTransaction(transaction: Transaction): void {
      patchState(store, (state) => ({
        transactions: state.transactions.map((t) => {
          if(t.id == transaction.id){
            return {
              ...t,
              ...transaction
            }
          }
          return t
        })
      }));
    },

    deleteTransaction(id:string | number){
      patchState(store,(state) => ({
        transactions: state.transactions.filter(t => t.id !== id)
      }))
    }
  })),
  withStorageSync({
    key: 'transactions'
  })
);
