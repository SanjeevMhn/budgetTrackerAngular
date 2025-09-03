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
  duration: 'day' | 'week' | 'month';
  amount: number | string;
  date: string;
  active: boolean;
  recurring: boolean;
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
    // budgetOfCurrentMonth: () => {
    //   const date = new Date();
    //   const currentMonth = date.getMonth() + 1;
    //   return budgets().filter(
    //     (budget) => new Date(budget.date).getMonth() + 1 == currentMonth
    //   )[0];
    // },
    getActiveBudgets: () => {
      return budgets().filter(budget => budget.active)
    }
  })),
  withMethods((store) => ({
    addBudget(budget: Budget): void {
      patchState(store, (state) => ({
        budgets: [...state.budgets, budget],
      }));
    },
    updateBudget(budget: Budget):void{
      patchState(store, (state) => ({
        budgets: state.budgets.map(bud => {
          if(bud.id == budget.id){
            return {
              ...bud,
              ...budget
            }
          }
          return bud
        })
      }))
    },
    deleteBudget(id:string | number):void{
      patchState(store,(state) => ({
        budgets: state.budgets.filter(bud => bud.id !== id)
      }))
    }
  })),
  withStorageSync({
    key: 'budgets'
  })
);
