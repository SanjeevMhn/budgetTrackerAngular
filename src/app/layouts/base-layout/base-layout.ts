import { Component, effect, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BottomNav } from '../../bottom-nav/bottom-nav';
import { ChevronLeft, ChevronRight, LucideAngularModule } from 'lucide-angular';
import { GlobalDate } from '../../services/global-date/global-date';
import { DatePipe } from '@angular/common';
import { TransactionStore } from '../../store/transaction-store';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-base-layout',
  imports: [RouterOutlet, BottomNav, LucideAngularModule, DatePipe, MatDatepicker, MatDatepickerModule],
  templateUrl: './base-layout.html',
  styleUrl: './base-layout.scss',
  providers: [provideNativeDateAdapter()]
})
export class BaseLayout {
  chevronLeft = ChevronLeft;
  chevronRight = ChevronRight;

  stateTransactions = inject(TransactionStore);
  gDate = inject(GlobalDate);

  @ViewChild("picker") datePicker!:MatDatepicker<Date>

  openPicker(){
    if(this.datePicker){
      this.datePicker.open()
    }
  }


  monthSelected(event: any, picker: MatDatepicker<Date>){
    this.gDate.setMonth(event)
    picker.close()
  }

}
