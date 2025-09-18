import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { Transaction, TransactionStore } from '../store/transaction-store';
import {
  ChevronLeft,
  ChevronRight,
  Ellipsis,
  EllipsisVertical,
  LucideAngularModule,
} from 'lucide-angular';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { AddTransaction } from '../dialog/add-transaction/add-transaction';
import { AlertDialog } from '../dialog/alert-dialog/alert-dialog';
import { DatePipe } from '@angular/common';
import { BudgetCheck } from '../services/budgetCheck/budget-check';

@Component({
  selector: 'app-transactions-list',
  imports: [MatMenuModule, LucideAngularModule, DatePipe],
  templateUrl: './transactions-list.html',
  styleUrl: './transactions-list.scss',
})
export class TransactionsList {
  transactions = input<Array<Transaction | any>>([]);

  constructor(){
    effect(() => {
      if(this.transactions()){
        this.page.set(1)
      }
    })
  }

  page = signal<number>(1);
  pageLimit = 4;
  totalPages = computed(() => {
    return Math.ceil(this.transactions().length / this.pageLimit);
  });

  getPaginatedData = computed(() => {
    const startIndex = (this.page() - 1) * this.pageLimit;
    const endIndex = Math.min(
      startIndex + this.pageLimit,
      this.transactions().length
    );
    const items = this.transactions();
    return items.slice(startIndex, endIndex);
  });

  ellipsesIcon = EllipsisVertical;
  chevronLeft = ChevronLeft;
  chevronRight = ChevronRight;

  dialog = inject(MatDialog);
  budgetCheck = inject(BudgetCheck);

  onTransactionEdit(transaction: Transaction) {
    this.dialog.open(AddTransaction, {
      height: '100vh',
      width: '100vw',
      panelClass: 'transaction-dialog',
      data: {
        transaction: transaction,
      },
    });
  }

  onDelete(id: string | number) {
    const dialogRef = this.dialog.open(AlertDialog, {
      panelClass: 'alert-dialog',
      data: {
        title: 'Delete Transaction?',
        description: 'Are you sure you want to delete this transaction?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.budgetCheck.deleteTransaction(id);
      }
    });
  }

  prevPage() {
    if (this.page() > 1) {
      this.page.set(this.page() - 1);
    }
  }

  nextPage() {
    if (this.page() < this.totalPages()) {
      this.page.set(this.page() + 1);
    }
  }
}
