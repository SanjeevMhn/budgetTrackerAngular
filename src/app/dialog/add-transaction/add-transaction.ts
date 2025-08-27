import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChevronLeft, Ellipsis, LucideAngularModule } from 'lucide-angular';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Transaction, TransactionStore } from '../../store/transaction-store';

@Component({
  selector: 'app-add-transaction',
  imports: [LucideAngularModule, ReactiveFormsModule],
  templateUrl: './add-transaction.html',
  styleUrl: './add-transaction.scss',
})
export class AddTransaction {
  backButtonIcon = ChevronLeft;
  ellipsesHorIcon = Ellipsis;

  transactionStore = inject(TransactionStore)
  dialogRef = inject(MatDialogRef<AddTransaction>);
  public data: {
    type: 'expense' | 'income';
  } = inject(MAT_DIALOG_DATA);

  transactionForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    amount: new FormControl('', [Validators.required, Validators.min(1)]),
    date: new FormControl('', [Validators.required]),
  });

  get name() {
    return this.transactionForm.get('name');
  }

  get amount() {
    return this.transactionForm.get('amount');
  }

  get date() {
    return this.transactionForm.get('date');
  }

  onTransactionSubmit() {
    if (this.transactionForm.invalid) {
      this.transactionForm.markAllAsTouched();
      return;
    }

    let transaction = {
      id: Date.now(),
      ...this.transactionForm.value,
      type: this.data.type,
    } as Transaction;

    this.transactionStore.addTransaction(transaction)
    this.closeDialog()
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
