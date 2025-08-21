import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LucideAngularModule,  House, Banknote, NotebookPen, User } from 'lucide-angular';

@Component({
  selector: 'app-base-layout',
  imports: [RouterOutlet, LucideAngularModule ],
  templateUrl: './base-layout.html',
  styleUrl: './base-layout.scss'
})
export class BaseLayout {

  homeIcon = House
  moneyIcon = Banknote
  notesIcon = NotebookPen
  userIcon = User
}
