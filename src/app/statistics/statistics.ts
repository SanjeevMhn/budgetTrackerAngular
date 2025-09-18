import {
  AfterViewInit,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import {
  ChevronLeft,
  Computer,
  Download,
  LucideAngularModule,
  Search,
  X,
} from 'lucide-angular';
import {
  ArcElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  LineElement,
  PieController,
  Point,
  PointElement,
  RadialLinearScale,
  Title,
  Tooltip,
  PluginChartOptions,
  plugins,
} from 'chart.js';
import { LineController } from 'chart.js';
import { TransactionStore } from '../store/transaction-store';
import { TransactionsList } from '../transactions-list/transactions-list';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { debounceTime, distinctUntilChanged, map, Subject } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

Chart.register(
  LineController,
  LineElement,
  LinearScale,
  Title,
  CategoryScale,
  PointElement,
  Legend,
  PieController,
  ArcElement,
  Tooltip,
  RadialLinearScale,
  plugins,
  DatalabelsPlugin
);

@Component({
  selector: 'app-statistics',
  imports: [LucideAngularModule, TransactionsList],
  templateUrl: './statistics.html',
  styleUrl: './statistics.scss',
})
export class Statistics {
  searchIcon = Search;
  clearIcon = X

  stateTransactions = inject(TransactionStore);
  selectedOption = signal<'exp' | 'inc'>('exp');

  @ViewChild('chart', { static: false })
  chartRef!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;

  @ViewChild('searchInput', {static: false})
  searchInputRef!: ElementRef<HTMLInputElement>

  searchSubject = new Subject<string>();
  searchTerm = this.searchSubject.pipe(
    debounceTime(500),
    distinctUntilChanged(),
    map((term: string) => term)
  );


  searchSignal = toSignal(this.searchTerm);

  constructor(){
    effect(() => {
      if(this.searchSignal()){
        this.searchInputRef.nativeElement.blur()
      }
    })
  }

  tabList = signal([
    {
      id: 1,
      name: '7 Days',
      active: true,
    },
    {
      id: 2,
      name: '15 Days',
      active: false,
    },
    {
      id: 3,
      name: '30 Days',
      active: false,
    },
  ]);

  activeTabName = computed(() => {
    return this.tabList().find((tab) => tab.active)?.name;
  });

  activeDurationAndType = computed(() => {
    return {
      duration: this.activeTabName(),
      type: this.selectedOption(),
    };
  });

  activeTransactionType = computed(() => {
    return this.searchSignal() !== '' &&
      this.searchSignal() !== undefined &&
      this.searchSignal()
      ? this.stateTransactions
          .getAllTransaction()
          .filter((transaction) =>
            transaction.name
              .toLowerCase()
              .includes(this.searchSignal()!.toLowerCase())
          )
      : this.activeDurationAndType().duration == '7 Days' &&
        this.activeDurationAndType().type == 'exp'
      ? this.stateTransactions.expensesByWeek()
      : this.activeDurationAndType().duration == '7 Days' &&
        this.activeDurationAndType().type == 'inc'
      ? this.stateTransactions.incomeByWeek()
      : this.activeDurationAndType().duration == '15 Days' &&
        this.activeDurationAndType().type == 'exp'
      ? this.stateTransactions.expensesByHalfMonth()
      : this.activeDurationAndType().duration == '15 Days' &&
        this.activeDurationAndType().type == 'inc'
      ? this.stateTransactions.incomeByHalfMonth()
      : this.activeDurationAndType().duration == '30 Days' &&
        this.activeDurationAndType().type == 'exp'
      ? this.stateTransactions.expensesByMonth()
      : this.activeDurationAndType().duration == '30 Days' &&
        this.activeDurationAndType().type == 'inc'
      ? this.stateTransactions.incomeByMonth()
      : [];
  });

  toggleActiveTab(tabId: number) {
    const updatedTab = this.tabList().map((tab) => {
      if (tab.id == tabId) {
        return {
          ...tab,
          active: true,
        };
      }
      return {
        ...tab,
        active: false,
      };
    });
    this.tabList.set(updatedTab);
  }

  handleOptionChange(event: any) {
    let option = event.target.value;
    this.selectedOption.set(option);
  }

  searchTransactions(event: any) {
    this.searchSubject.next(event.target.value);
  }

  get searchInputHasValue():boolean{
    return this.searchInputRef ? this.searchInputRef.nativeElement.value.length > 0 : false
  }

  clearSearchInput(){
    if(this.searchInputRef){
      this.searchInputRef.nativeElement.value = ''
      this.searchSubject.next('')
    }
  }

  getRandomColor(): string {
    const randomInt = (min: number, max: number) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    let h = randomInt(0, 360);
    let s = randomInt(50, 80);
    let l = randomInt(40, 90);
    return `hsl(${h},${s}%,${l}%)`;
  }

  getNamesWithSpace(names: string): string {
    const words = names.split(' ');
    let lines = '';
    words.forEach((word) => {
      if ((lines + ' ' + word).split(' ').length <= 3) {
        if (
          lines == '' ||
          (word.length <= 6 && lines.trim().split(' ').length < 2)
        ) {
          lines += (lines.length > 0 ? ' ' : '') + word;
        } else {
          debugger;
          lines += '\n' + word;
        }
      } else {
        lines += '\n' + word;
      }
    });

    return lines;
  }
}
