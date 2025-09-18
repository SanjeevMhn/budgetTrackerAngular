import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LucideAngularModule, X } from 'lucide-angular';
import { AlertDialog } from '../alert-dialog/alert-dialog';
import { Transaction, TransactionStore } from '../../store/transaction-store';
import { Budget, BudgetStore } from '../../store/budgets-store';
import { UserStore } from '../../store/user-store';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { SnackBar } from '../../services/snack-bar';

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
  snackBar = inject(SnackBar);

  router = inject(Router);

  close() {
    this.dialogRef.close();
  }

  exportData() {
    let budgets = localStorage.getItem('budgets');
    let transactions = localStorage.getItem('transactions');
    let user = localStorage.getItem('user');

    const expenseTrackerData = JSON.stringify({
      budgets: JSON.parse(budgets!),
      transactions: JSON.parse(transactions!),
      user: JSON.parse(user!),
    });

    const blob = new Blob([expenseTrackerData], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'expenseTracker.json');

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  importedData(event: any) {
    const file = event.target.files[0];
    const fileReader = new FileReader();

    fileReader.onload = (e) => {
      const content = e.target?.result as string;
      try {
        const jsonData = JSON.parse(content);
        const { transactions, budgets, user } = jsonData;
        this.userStore.setUserData({
          ...user,
        });
        if (transactions.transactions.length > 0) {
          transactions.transactions.forEach((tran: Transaction) => {
            this.transactionsStore.addTransaction(tran);
          });
        }
        if (budgets.budgets.length > 0) {
          budgets.budgets.forEach((budget: Budget) => {
            this.budgetsStore.addBudget(budget);
          });
        }

        this.close()
        this.snackBar.open('Importing data successful');
        this.router.navigate(['/']);
      } catch (err: any) {
        console.error(err);
        this.snackBar.open('Error while reading contents of file.');
      }
    };

    fileReader.readAsText(file);
  }

  deleteReset() {
    let exportReq = this.dialog.open(AlertDialog, {
      panelClass: 'alert-dialog',
      data: {
        title: 'Export & Save',
        description:
          'Save and export current data before deleting and resetting?',
        actionBtnLabel: 'Export',
      },
    });

    exportReq.afterClosed().subscribe((res) => {
      if (res) {
        this.exportData();
        this.clearData();
      }else if (!res){
        this.clearData()
      }
    });

    // let ref = this.dialog.open(AlertDialog, {
    //   panelClass: 'alert-dialog',
    //   data: {
    //     title: 'Delete',
    //     description:
    //       'Are you sure you want to delete all user details and transactions records?',
    //   },
    // });

    // ref.afterClosed().subscribe((res) => {
    //   if (res) {
    //     this.clearData()
    //   }
    // });
  }

  clearData() {
    this.transactionsStore.reset();
    this.userStore.reset();
    this.budgetsStore.reset();
    this.router.navigate(['/']);

    location.href = environment.apiUrl;
  }
}
