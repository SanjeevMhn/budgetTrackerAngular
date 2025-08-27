import { Component, inject } from '@angular/core';
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

@Component({
  selector: 'app-dashboard',
  imports: [LucideAngularModule],
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
  
  stateTransactions = inject(TransactionStore)
}
