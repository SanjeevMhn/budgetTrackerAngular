import { effect, inject, Injectable, signal } from '@angular/core';
import { TransactionStore } from '../../store/transaction-store';
import { BudgetStore } from '../../store/budgets-store';

@Injectable({
  providedIn: 'root',
})
export class GlobalDate {
  public date = signal<Date>(new Date());
  stateTransactions = inject(TransactionStore);
  stateBudgets = inject(BudgetStore)

  constructor() {
    effect(() => {
      let currentDate = this.date();
      this.stateTransactions.setDate(currentDate);
      this.stateBudgets.setDate(currentDate)
    });
  }

  getPrevMonth() {
    let prevMonth = new Date(this.date());
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    prevMonth.setDate(1);
    this.date.set(prevMonth);
  }

  getNextMonth() {
    let newMonth = new Date(this.date());
    newMonth.setMonth(newMonth.getMonth() + 1);
    newMonth.setDate(1);
    this.date.set(newMonth);
  }

  setMonth(date: Date){
    let newDate = new Date(date)
    newDate.setMonth(newDate.getMonth());
    newDate.setDate(1)
    this.date.set(newDate)
  }
}
