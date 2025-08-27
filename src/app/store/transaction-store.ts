import { computed } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';

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
  })),
  withMethods((store) => ({
    addTransaction(transaction: Transaction): void {
      patchState(store, (state) => ({
        transactions: [...state.transactions, transaction],
      }));
    },
  }))
);
