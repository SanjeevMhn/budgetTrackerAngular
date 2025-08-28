import { Component, signal } from '@angular/core';
import { BellDot, ChevronLeft, LucideAngularModule, Plus } from 'lucide-angular';

@Component({
  selector: 'app-profile',
  imports: [LucideAngularModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile {

  backButtonIcon = ChevronLeft;
  bellIcon = BellDot;
  plusIcon = Plus;

  userImg = signal<any| null>('https://avatar.iran.liara.run/public')
}
