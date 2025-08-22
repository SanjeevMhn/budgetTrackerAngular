import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BottomNav } from "../../bottom-nav/bottom-nav";

@Component({
  selector: 'app-base-layout',
  imports: [RouterOutlet, BottomNav],
  templateUrl: './base-layout.html',
  styleUrl: './base-layout.scss'
})
export class BaseLayout {
}
