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
  Ellipsis,
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
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-wallet',
  imports: [LucideAngularModule, MatMenuModule, DatePipe],
  templateUrl: './wallet.html',
  styleUrl: './wallet.scss',
})
export class Wallet {
  backButtonIcon = ChevronLeft;
  bellIcon = BellDot;
  plusIcon = Plus;
  notebook = NotebookText;
  ellipsesIcon = Ellipsis;

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
      panelClass: 'alert-dialog',
      data: {
        title: 'Delete Budget?',
        description: 'Are you sure you want to delete this budget?',
      },
    });

    ref.afterClosed().subscribe((res) => {
      if (res) {
        this.budgets.deleteBudget(id);
      }
    });
  }

  getTotalPercentageUsed(
    spent: number | string,
    limit: number | string
  ): string {
    if (spent && limit) {
      return ((Number(spent) / Number(limit)) * 100).toPrecision(0);
    }
    return '0';
  }
}
