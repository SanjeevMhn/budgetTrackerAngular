import {
  AfterViewInit,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import {
  Chart,
  LineController,
  LineElement,
  LinearScale,
  Title,
  CategoryScale,
  PointElement,
  Legend,
  PieController,
  ArcElement,
  Tooltip,
  RadialLinearScale,
} from 'chart.js';
import {
  BellDot,
  ChevronLeft,
  EllipsisVertical,
  LucideAngularModule,
  NotebookText,
  Plus,
} from 'lucide-angular';
import { BudgetStore } from '../store/budgets-store';
import { AddBudget } from '../dialog/add-budget/add-budget';
import { MatDialog } from '@angular/material/dialog';
import { BudgetCheck } from '../services/budgetCheck/budget-check';
import { MatMenuModule } from '@angular/material/menu';
import { TransactionsList } from "../transactions-list/transactions-list";
import { TransactionStore } from '../store/transaction-store';

Chart.register(
  LineController,
  LineElement,
  LinearScale,
  Title,
  CategoryScale,
  PointElement,
  Legend,
  PieController,
  ArcElement,
  Tooltip,
  RadialLinearScale
);

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
  ellipsesIcon = EllipsisVertical

  budgets = inject(BudgetStore);
  dialog = inject(MatDialog);
  budgetCheck = inject(BudgetCheck)
  transactions = inject(TransactionStore)

  onOpenBudgetDialog() {
    this.dialog.open(AddBudget, {
      width: '100vw',
      height: '100vh',
      panelClass: 'transaction-dialog',
    });
  }
}
