import { withStorageSync } from '@angular-architects/ngrx-toolkit';
import { computed } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';

export type Budget = {
  id: string | number;
  name: string;
  limit: number | string;
  date: string;
  total_spent: number | string;
  limitReached: boolean;
};

type BudgetStoreState = {
  budgets: Array<Budget>;
  currentDate: Date;
};

const initialState: BudgetStoreState = {
  budgets: [],
  currentDate: new Date(),
};

export const BudgetStore = signalStore(
  { providedIn: 'root' },
  withState<BudgetStoreState>(initialState),
  withComputed(({ budgets, currentDate }) => ({
    getBudgets: computed(() => {
      return budgets().filter(
        (budget) =>
          new Date(budget.date).getFullYear() ==
            new Date(currentDate()).getFullYear() &&
          new Date(budget.date).getMonth() == new Date(currentDate()).getMonth()
      );
    }),
  })),
  withMethods((store) => ({
    setDate(date: Date): void {
      patchState(store, (state) => ({
        currentDate: date,
      }));
    },
    addBudget(budget: Budget): void {
      patchState(store, (state) => ({
        budgets: [...state.budgets, budget],
      }));
    },
    updateBudget(budget: Budget): void {
      patchState(store, (state) => ({
        budgets: state.budgets.map((bud) => {
          if (bud.id == budget.id) {
            return {
              ...bud,
              ...budget,
            };
          }
          return bud;
        }),
      }));
    },
    deleteBudget(id: string | number): void {
      patchState(store, (state) => ({
        budgets: state.budgets.filter((bud) => bud.id !== id),
      }));
    },
  })),
  withStorageSync({
    key: 'budgets',
  })
);
