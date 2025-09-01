import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private password = signal<number | null>(null) 

  authenticateUser(password:number){
    this.password.set(password)
  }
}
