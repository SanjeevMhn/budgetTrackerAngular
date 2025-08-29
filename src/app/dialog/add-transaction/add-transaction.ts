import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
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
export class AddTransaction implements AfterViewInit {
  backButtonIcon = ChevronLeft;
  ellipsesHorIcon = Ellipsis;

  transactionStore = inject(TransactionStore);
  dialogRef = inject(MatDialogRef<AddTransaction>);
  public data: {
    transaction?: Transaction;
  } = inject(MAT_DIALOG_DATA);

  transactionForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    amount: new FormControl('', [Validators.required, Validators.min(1)]),
    type: new FormControl('', [Validators.required]),
    date: new FormControl('', [Validators.required]),
  });

  editMode = signal<boolean>(false);

  ngAfterViewInit(): void {
    if (
      this.data &&
      this.data.transaction &&
      this.data.transaction !== null &&
      this.data.transaction !== undefined
    ) {
      this.transactionForm.patchValue(this.data.transaction);
      this.editMode.set(true);
    }
  }

  get name() {
    return this.transactionForm.get('name');
  }

  get amount() {
    return this.transactionForm.get('amount');
  }

  get type() {
    return this.transactionForm.get('type');
  }

  get date() {
    return this.transactionForm.get('date');
  }

  onTransactionSubmit() {
    if (this.transactionForm.invalid) {
      this.transactionForm.markAllAsTouched();
      return;
    }

    if (this.editMode()) {
      let transaction = {
        ...this.data.transaction,
        ...this.transactionForm.value,
      } as Transaction;
      this.transactionStore.updateTransaction(transaction);
    } else {
      let transaction = {
        id: Date.now(),
        ...this.transactionForm.value,
      } as Transaction;
      this.transactionStore.addTransaction(transaction);
    }

    this.closeDialog();
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
