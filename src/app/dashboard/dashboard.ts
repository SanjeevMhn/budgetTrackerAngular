import { Component } from '@angular/core';
import { Bell, EllipsisVertical, LucideAngularModule, Plus, Search } from 'lucide-angular';

@Component({
  selector: 'app-dashboard',
  imports: [LucideAngularModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {

  searchIcon = Search
  bellIcon = Bell
  dotsIcon = EllipsisVertical
  addIcon = Plus
}
