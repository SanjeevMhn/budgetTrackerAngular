import { computed } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';

type Budget = {
  id: string | number;
  duration: 'day' | 'week' | 'month';
  recurring: boolean;
  amount: number | string;
  startDate: string;
  limitReached: boolean;
};

type BudgetStoreState = {
  budgets: Array<Budget>;
};

const initialState: BudgetStoreState = {
  budgets: [],
};

export const BudgetStore = signalStore(
  { providedIn: 'root' },
  withState<BudgetStoreState>(initialState),
  withComputed(({ budgets }) => ({
    budgetOfCurrentMonth: () => {
      const date = new Date();
      const currentMonth = date.getMonth() + 1;
      return budgets().filter(
        (budget) => new Date(budget.startDate).getMonth() + 1 == currentMonth
      );
    },
  })),
  withMethods((store) => ({
    addBudget(budget: Budget): void {
      patchState(store, (state) => ({
        budgets: [...state.budgets, budget],
      }));
    },
  }))
);
