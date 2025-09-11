import { Component, computed, effect, inject } from '@angular/core';
import {
  Bell,
  CircleArrowDown,
  CircleArrowUp,
  EllipsisVertical,
  History,
  LucideAngularModule,
  Plus,
  Search,
  Wallet,
} from 'lucide-angular';
import { TransactionStore } from '../store/transaction-store';
import { RouterLink } from '@angular/router';
import { TransactionsList } from '../transactions-list/transactions-list';
import { UserStore } from '../store/user-store';

@Component({
  selector: 'app-dashboard',
  imports: [LucideAngularModule, RouterLink, TransactionsList],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  searchIcon = Search;
  bellIcon = Bell;
  dotsIcon = EllipsisVertical;
  addIcon = Plus;
  walletIcon = Wallet;
  refreshIcon = History;
  circleArrowDownIcon = CircleArrowDown;
  circleArrowUpIcon = CircleArrowUp;

  stateTransactions = inject(TransactionStore);
  userStore = inject(UserStore);

  getUserInitials(name: string) {
    let nameArr = name.split(' ');
    return nameArr.length > 2
      ? nameArr[0].charAt(0) + ' ' + nameArr[2].charAt(0)
      : nameArr.length == 2 ? nameArr[0].charAt(0) + ' ' + nameArr[1].charAt(0):
      nameArr[0].charAt(0);
  }
}
