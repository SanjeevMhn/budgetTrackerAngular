import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import {
  Banknote,
  ChartColumn,
  House,
  LucideAngularModule,
  NotebookPen,
  User,
  Wallet,
} from 'lucide-angular';
import { MatDialog } from '@angular/material/dialog';
import { AddTransaction } from '../dialog/add-transaction/add-transaction';
import { AddBudget } from '../dialog/add-budget/add-budget';

@Component({
  selector: 'app-bottom-nav',
  imports: [LucideAngularModule, RouterLink, RouterLinkActive],
  templateUrl: './bottom-nav.html',
  styleUrl: './bottom-nav.scss',
})
export class BottomNav {
  homeIcon = House;
  moneyIcon = Banknote;
  notesIcon = NotebookPen;
  userIcon = User;
  barIcon = ChartColumn;
  walletIcon = Wallet;

  showMenu = signal<boolean>(false);

  currentRoute = inject(Router);
  dialog = inject(MatDialog);

  toggleShowMenu() {
    this.showMenu.set(!this.showMenu());
  }

  // openDialog(type: 'expense' | 'income') {
  openDialog() {
    // this.toggleShowMenu();
    this.dialog.open(AddTransaction, {
      height: '100vh',
      width: '100vw',
      panelClass: 'transaction-dialog',
      // data: {
      //   type: type,
      // },
    });
  }

  openBudgetDialog() {
    this.toggleShowMenu();
    this.dialog.open(AddBudget, {
      height: '100vh',
      width: '100vw',
      panelClass: 'transaction-dialog',
    });
  }
}
