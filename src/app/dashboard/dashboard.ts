import { Component } from '@angular/core';
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

  transactions: Array<any> = [
    {
      id: 101,
      name: 'Groceries',
      type: 'expense',
      amount: 2500,
      date: '2025-05-12',
    },
    {
      id: 102,
      name: 'Tire Change',
      type: 'expense',
      amount: 4500,
      date: '2025-05-20',
    },
    {
      id: 103,
      name: 'Freelance Payment',
      type: 'income',
      amount: 30000,
      date: '2025-06-12',
    },
    {
      id: 104,
      name: 'Sold Artwork',
      type: 'income',
      amount: 8000,
      date: '2025-06-25',
    },
  ];
}
