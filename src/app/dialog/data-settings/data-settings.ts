import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LucideAngularModule, X } from 'lucide-angular';
import { AlertDialog } from '../alert-dialog/alert-dialog';
import { TransactionStore } from '../../store/transaction-store';
import { BudgetStore } from '../../store/budgets-store';
import { UserStore } from '../../store/user-store';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-data-settings',
  imports: [LucideAngularModule],
  templateUrl: './data-settings.html',
  styleUrl: './data-settings.scss',
})
export class DataSettings {
  dialogRef = inject(MatDialogRef);
  dialog = inject(MatDialog);
  closeIcon = X;
  transactionsStore = inject(TransactionStore);
  budgetsStore = inject(BudgetStore);
  userStore = inject(UserStore);

  router = inject(Router);

  close() {
    this.dialogRef.close();
  }

  deleteReset() {
    let ref = this.dialog.open(AlertDialog, {
      panelClass: 'alert-dialog',
      data: {
        title: 'Delete',
        description:
          'Are you sure you want to delete all user details and transactions records?',
      },
    });

    ref.afterClosed().subscribe((res) => {
      if (res) {
        this.transactionsStore.reset();
        this.userStore.reset();
        this.budgetsStore.reset();
        this.router.navigate(['/']);

        location.href = environment.apiUrl;
      }
    });
  }
}
