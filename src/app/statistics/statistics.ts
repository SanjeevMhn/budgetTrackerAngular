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
} from 'chart.js';
import { LineController } from 'chart.js';
import { TransactionStore } from '../store/transaction-store';
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
  RadialLinearScale
);

@Component({
  selector: 'app-statistics',
  imports: [LucideAngularModule],
  templateUrl: './statistics.html',
  styleUrl: './statistics.scss',
})
export class Statistics implements AfterViewInit {
  backButtonIcon = ChevronLeft;
  downloadIcon = Download;

  stateTransactions = inject(TransactionStore);
  selectedOption = signal<'exp' | 'inc'>('exp');

  @ViewChild('chart', { static: false })
  chartRef!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;

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

  constructor() {
    effect(() => {
      const labels = this.activeLabels();
      const data = this.activeData();
      const selected = this.activeDurationAndType();
      // const dura =

      if (this.chart) {
        this.chart.data.labels = labels;
        this.chart.data.datasets[0].data = data;
        this.chart.data.datasets[0].label = `${
          selected.type == 'exp' ? 'Spendings' : 'Earnings'
        } past ${
          selected.duration == '7 Days'
            ? 'week'
            : selected.duration == '15 Days'
            ? '15 days'
            : selected.duration == '30 Days'
            ? 'Month'
            : ''
        }`;
        this.chart.update();
      }
    });
  }

  activeTabName = computed(() => {
    return this.tabList().find((tab) => tab.active)?.name;
  });

  activeDurationAndType = computed(() => {
    return {
      duration: this.activeTabName(),
      type: this.selectedOption(),
    };
  });

  activeLabels = computed(() => {
    return this.activeDurationAndType().duration == '7 Days' &&
      this.activeDurationAndType().type == 'exp'
      ? this.stateTransactions.expensesByWeek().map((week) => week.date)
      : this.activeDurationAndType().duration == '7 Days' &&
        this.activeDurationAndType().type == 'inc'
      ? this.stateTransactions.incomeByWeek().map((week) => week.date)
      : this.activeDurationAndType().duration == '15 Days' &&
        this.activeDurationAndType().type == 'exp'
      ? this.stateTransactions.expensesByHalfMonth().map((hm) => hm.date)
      : this.activeDurationAndType().duration == '15 Days' &&
        this.activeDurationAndType().type == 'inc'
      ? this.stateTransactions.incomeByHalfMonth().map((hm) => hm.date)
      : this.activeDurationAndType().duration == '30 Days' &&
        this.activeDurationAndType().type == 'exp'
      ? this.stateTransactions.expensesByMonth().map((m) => m.date)
      : this.activeDurationAndType().duration == '30 Days' &&
        this.activeDurationAndType().type == 'inc'
      ? this.stateTransactions.incomeByMonth().map((m) => m.date)
      : [];
  });

  activeData = computed(() => {
    return this.activeDurationAndType().duration == '7 Days' &&
      this.activeDurationAndType().type == 'exp'
      ? this.stateTransactions
          .expensesByWeek()
          .map((week) => Number(week.amount))
      : this.activeDurationAndType().duration == '7 Days' &&
        this.activeDurationAndType().type == 'inc'
      ? this.stateTransactions.incomeByWeek().map((week) => Number(week.amount))
      : this.activeDurationAndType().duration == '15 Days' &&
        this.activeDurationAndType().type == 'exp'
      ? this.stateTransactions
          .expensesByHalfMonth()
          .map((hm) => Number(hm.amount))
      : this.activeDurationAndType().duration == '15 Days' &&
        this.activeDurationAndType().type == 'inc'
      ? this.stateTransactions
          .incomeByHalfMonth()
          .map((hm) => Number(hm.amount))
      : this.activeDurationAndType().duration == '30 Days' &&
        this.activeDurationAndType().type == 'exp'
      ? this.stateTransactions.expensesByMonth().map((m) => Number(m.amount))
      : this.activeDurationAndType().duration == '30 Days' &&
        this.activeDurationAndType().type == 'inc'
      ? this.stateTransactions.incomeByMonth().map((m) => Number(m.amount))
      : [];
  });

  activeTransactionType = computed(() => {
    return this.activeDurationAndType().duration == '7 Days' &&
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

  createChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'line',
      data: {
        labels: this.activeLabels(),
        datasets: [
          {
            label: `${
              this.activeDurationAndType().type == 'exp'
                ? 'Spendings'
                : 'Earnings'
            } past ${
              this.activeDurationAndType().duration == '7 Days'
                ? 'week'
                : this.activeDurationAndType().duration == '15 Days'
                ? '15 days'
                : this.activeDurationAndType().duration == '30 Days'
                ? 'Month'
                : ''
            }`,
            data: this.activeData(),
            fill: true,
            borderColor: '#438883',
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
      },
    });
  }

  ngAfterViewInit(): void {
    this.createChart();
  }

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
}
