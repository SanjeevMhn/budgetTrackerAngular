import {
  AfterViewInit,
  Component,
  inject,
  input,
  model,
  OnInit,
  output,
  signal,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  ChevronLeft,
  CircleCheckBig,
  Ellipsis,
  LucideAngularModule,
} from 'lucide-angular';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Transaction, TransactionStore } from '../../store/transaction-store';
import { DatePipe } from '@angular/common';
import { MatCalendar, MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-add-transaction',
  imports: [
    LucideAngularModule,
    ReactiveFormsModule,
    DatePipe,
    MatDatepickerModule,
  ],
  templateUrl: './add-transaction.html',
  styleUrl: './add-transaction.scss',
})
export class AddTransaction implements AfterViewInit {
  backButtonIcon = ChevronLeft;
  ellipsesHorIcon = Ellipsis;
  checkIcon = CircleCheckBig;

  transactionStore = inject(TransactionStore);
  dialogRef = inject(MatDialogRef<AddTransaction>);
  public data: {
    transaction?: Transaction;
  } = inject(MAT_DIALOG_DATA);

  transactionForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    amount: new FormControl('', [Validators.required, Validators.min(1)]),
    type: new FormControl('expense', [Validators.required]),
    date: new FormControl<Date | string>('', [Validators.required]),
  });

  editMode = signal<boolean>(false);

  ngAfterViewInit(): void {
    if (
      this.data &&
      this.data.transaction &&
      this.data.transaction !== null &&
      this.data.transaction !== undefined
    ) {
      let { date, ...propData } = this.data.transaction;
      console.log(date);
      this.transactionForm.patchValue(propData);
      this.transactionForm.get('date')?.reset();
      this.transactionForm.get('date')?.setValue(new Date(date));
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

  dialog = inject(MatDialog);
  selected = signal<Date>(new Date());

  showDateDialog() {
    const datepicker = this.dialog.open(DialogDatePicker, {
      data: {
        date: this.selected(),
      },
    });

    datepicker.afterClosed().subscribe((da) => {
      this.selected.set(da ?? new Date());
      this.transactionForm.get('date')?.setValue(da);
    });
  }

  get today() {
    return this.transactionForm.get('date')?.value !== ''
      ? this.transactionForm.get('date')?.value
      : this.selected();
  }

  onTransactionSubmit() {
    if (this.transactionForm.invalid) {
      this.transactionForm.markAllAsTouched();
      return;
    }

    if (this.editMode()) {
      console.log(this.transactionForm.value);
      let transaction = {
        ...this.data.transaction,
        ...this.transactionForm.value,
      } as Transaction;
      this.transactionStore.updateTransaction(transaction);
    } else {
      let transaction = {
        id: Date.now(),
        name: this.transactionForm.get('name')?.value,
        date: this.transactionForm.get('date')?.value?.toString(),
        amount: this.transactionForm.get('amount')?.value,
        type: this.transactionForm.get('type')?.value,
      } as Transaction;
      this.transactionStore.addTransaction(transaction);
    }

    this.closeDialog();
  }

  closeDialog() {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-dialog-datepicker',
  imports: [MatDatepickerModule],
  providers: [provideNativeDateAdapter()],
  template: `
    <mat-calendar
      [selected]="data.date!"
      (selectedChange)="selectData($event)"
    />
  `,
})
export class DialogDatePicker {
  dialogRef = inject(MatDialogRef<DialogDatePicker>);
  data: {
    date: Date;
  } = inject(MAT_DIALOG_DATA);

  selectData(event: any) {
    this.dialogRef.close(event);
  }
}
