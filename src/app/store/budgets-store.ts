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

