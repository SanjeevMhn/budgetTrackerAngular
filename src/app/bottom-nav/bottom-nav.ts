import { Component } from '@angular/core';
import {
  Banknote,
  House,
  LucideAngularModule,
  NotebookPen,
  User,
} from 'lucide-angular';

@Component({
  selector: 'app-bottom-nav',
  imports: [LucideAngularModule],
  templateUrl: './bottom-nav.html',
  styleUrl: './bottom-nav.scss',
})
export class BottomNav {
  homeIcon = House;
  moneyIcon = Banknote;
  notesIcon = NotebookPen;
  userIcon = User;
}
