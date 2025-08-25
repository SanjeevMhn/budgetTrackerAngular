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
  barIcon = ChartColumn
  walletIcon = Wallet

  showMenu = signal<boolean>(false)

  currentRoute = inject(Router)

  toggleShowMenu(){
    this.showMenu.set(!this.showMenu())
  }

}
