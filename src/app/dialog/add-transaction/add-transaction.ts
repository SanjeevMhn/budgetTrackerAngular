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
  X,
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
import { BudgetStore } from '../../store/budgets-store';
import { BudgetCheck } from '../../services/budgetCheck/budget-check';
import { SnackBar } from '../../services/snack-bar';

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
  closeIcon = X

  transactionStore = inject(TransactionStore);
  budgetStore = inject(BudgetStore);
  budgetCheck = inject(BudgetCheck);
  dialogRef = inject(MatDialogRef<AddTransaction>);
  snackBar = inject(SnackBar);
  public data: {
    transaction?: Transaction;
  } = inject(MAT_DIALOG_DATA);

  transactionForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    amount: new FormControl('', [Validators.required, Validators.min(1)]),
    type: new FormControl('expense', [Validators.required]),
    date: new FormControl(''),
    budget_id: new FormControl(''),
  });

  editMode = signal<boolean>(false);

  formError = signal<string | null>(null);

  ngAfterViewInit(): void {
    if (
      this.data &&
      this.data.transaction &&
      this.data.transaction !== null &&
      this.data.transaction !== undefined
    ) {
      let { date, ...propData } = this.data.transaction;
      this.transactionForm.patchValue(propData);
      this.transactionForm.get('date')?.reset();
      this.transactionForm.get('date')?.setValue(new Date(date).toString());
      this.selected.set(new Date(date));
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
    return this.selected();
  }

  onTransactionSubmit() {
    if (!this.transactionForm.get('date')?.value) {
      this.transactionForm.get('date')?.setValue(this.selected().toString());
    }
    if (this.transactionForm.invalid) {
      this.transactionForm.markAllAsTouched();
      return;
    }

    if (this.editMode()) {
      let transaction = {
        ...this.data.transaction,
        ...this.transactionForm.value,
      } as Transaction;
      if (
        this.checkIfBudgetExpired(
          Number(this.transactionForm.get('budget_id')?.value)
        )
      ) {
        this.formError.set(
          "Selected Budget's limit reached, Please choose another budget or create new budget or increase the limit of this budget"
        );
        return;
      } else {
        this.budgetCheck.updateTransaction(transaction);
        this.closeDialog();
      }
    } else {
      let transaction = {
        id: Date.now(),
        name: this.transactionForm.get('name')?.value,
        date: this.transactionForm.get('date')?.value?.toString(),
        amount: this.transactionForm.get('amount')?.value,
        type: this.transactionForm.get('type')?.value,
        budget_id: this.transactionForm.get('budget_id')?.value,
      } as Transaction;

      const budgetExpired = this.checkIfBudgetExpired(
        Number(this.transactionForm.get('budget_id')?.value)
      );
      if (budgetExpired) {
        this.formError.set(
          "Selected Budget's limit reached, Please choose another budget or create new budget or increase the limit of this budget"
        );
        return;
      } else {
        this.budgetCheck.addTransaction(transaction);
        this.closeDialog();
      }
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  checkIfBudgetExpired(id: number): boolean | undefined {
    return this.budgetStore.getBudgets().find((budget) => budget.id == id)
      ?.limitReached;
  }
}

@Component({
  selector: 'app-dialog-datepicker',
  imports: [MatDatepickerModule],
  providers: [provideNativeDateAdapter()],
  template: `
    <div class="dialog-container bg-[#fff] rounded-[2.8rem]">
      <mat-calendar
        [selected]="data.date!"
        (selectedChange)="selectData($event)"
      />
    </div>
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
