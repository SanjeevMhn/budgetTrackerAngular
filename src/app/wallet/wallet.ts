import {
  AfterViewInit,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import {
  BellDot,
  ChevronLeft,
  EllipsisVertical,
  LucideAngularModule,
  NotebookText,
  Plus,
} from 'lucide-angular';
import { Budget, BudgetStore } from '../store/budgets-store';
import { AddBudget } from '../dialog/add-budget/add-budget';
import { MatDialog } from '@angular/material/dialog';
import { BudgetCheck } from '../services/budgetCheck/budget-check';
import { MatMenuModule } from '@angular/material/menu';
import { TransactionsList } from '../transactions-list/transactions-list';
import { TransactionStore } from '../store/transaction-store';
import { AlertDialog } from '../dialog/alert-dialog/alert-dialog';

@Component({
  selector: 'app-wallet',
  imports: [LucideAngularModule, MatMenuModule, TransactionsList],
  templateUrl: './wallet.html',
  styleUrl: './wallet.scss',
})
export class Wallet {
  backButtonIcon = ChevronLeft;
  bellIcon = BellDot;
  plusIcon = Plus;
  notebook = NotebookText;
  ellipsesIcon = EllipsisVertical;

  budgets = inject(BudgetStore);
  dialog = inject(MatDialog);
  budgetCheck = inject(BudgetCheck);
  transactions = inject(TransactionStore);

  onOpenBudgetDialog() {
    this.dialog.open(AddBudget, {
      width: '100vw',
      height: '100vh',
      panelClass: 'transaction-dialog',
    });
  }

  onEdit(budget: Budget) {
    this.dialog.open(AddBudget, {
      width: '100vw',
      height: '100vh',
      panelClass: 'transaction-dialog',
      data: {
        budget: budget,
      },
    });
  }

  onDelete(id: string | number) {
    const ref = this.dialog.open(AlertDialog, {
      data: {
        title: 'Delete Budget?',
        description: 'Are you sure you want to delete this budget?',
      },
    });

    ref.afterClosed().subscribe((res) => {
      if (res == 'delete') {
        this.budgets.deleteBudget(id);
      }
    });
  }
}
