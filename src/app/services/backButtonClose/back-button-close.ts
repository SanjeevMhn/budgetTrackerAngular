import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BackButtonClose{
  router = inject(Router);
  dialogs = inject(MatDialog);

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationStart)
    ).subscribe((e: NavigationStart) => {
      if(e.navigationTrigger == 'popstate'){
        this.router.navigate([this.router.url])
        if(this.dialogs.openDialogs.length > 0){
          this.dialogs.closeAll()
          return
        } 
        return
      }
    }) 
  }
}
