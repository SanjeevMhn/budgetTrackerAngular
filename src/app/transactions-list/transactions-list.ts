import { Component, inject, input } from '@angular/core';
import { Transaction, TransactionStore } from '../store/transaction-store';
import {
  Ellipsis,
  EllipsisVertical,
  LucideAngularModule,
} from 'lucide-angular';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { AddTransaction } from '../dialog/add-transaction/add-transaction';
import { AlertDialog } from '../dialog/alert-dialog/alert-dialog';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-transactions-list',
  imports: [MatMenuModule, LucideAngularModule,DatePipe],
  templateUrl: './transactions-list.html',
  styleUrl: './transactions-list.scss',
})
export class TransactionsList {
  transactions = input<Array<Transaction>>([]);
  ellipsesIcon = EllipsisVertical;

  dialog = inject(MatDialog);
  transactionsStore = inject(TransactionStore)

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
  
  onDelete(id:string | number){
    const dialogRef = this.dialog.open(AlertDialog,{
      panelClass: 'alert-dialog',
      data:{
        title: 'Delete Transaction?',
        description: 'Are you sure you want to delete this transaction?'
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.transactionsStore.deleteTransaction(id)
      }
    })

  }
}
