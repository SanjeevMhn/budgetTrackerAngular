import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BottomNav } from '../../bottom-nav/bottom-nav';
import { ChevronLeft, ChevronRight, LucideAngularModule } from 'lucide-angular';
import { GlobalDate } from '../../services/global-date/global-date';
import { DatePipe } from '@angular/common';
import { TransactionStore } from '../../store/transaction-store';

@Component({
  selector: 'app-base-layout',
  imports: [RouterOutlet, BottomNav, LucideAngularModule, DatePipe],
  templateUrl: './base-layout.html',
  styleUrl: './base-layout.scss',
})
export class BaseLayout {
  chevronLeft = ChevronLeft;
  chevronRight = ChevronRight;

  stateTransactions = inject(TransactionStore);
  gDate = inject(GlobalDate);
}
