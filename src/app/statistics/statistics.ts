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
  PluginChartOptions,
  plugins,
} from 'chart.js';
import { LineController } from 'chart.js';
import { TransactionStore } from '../store/transaction-store';
import { TransactionsList } from '../transactions-list/transactions-list';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
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
      const labels = this.activeLabelsNames();
      const data = this.activeData();
      const selected = this.activeDurationAndType();
      const colors = this.chartBgColors();

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
        this.chart.data.datasets[0].backgroundColor = colors;
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
      ? this.stateTransactions.expensesByWeek().map((week) => {
          return {
            name: week.name,
            date: week.date,
            amount: week.amount,
          };
        })
      : this.activeDurationAndType().duration == '7 Days' &&
        this.activeDurationAndType().type == 'inc'
      ? this.stateTransactions.incomeByWeek().map((week) => {
          return {
            name: week.name,
            date: week.date,
            amount: week.amount,
          };
        })
      : this.activeDurationAndType().duration == '15 Days' &&
        this.activeDurationAndType().type == 'exp'
      ? this.stateTransactions.expensesByHalfMonth().map((hm) => {
          return {
            name: hm.name,
            date: hm.date,
            amount: hm.amount,
          };
        })
      : this.activeDurationAndType().duration == '15 Days' &&
        this.activeDurationAndType().type == 'inc'
      ? this.stateTransactions.incomeByHalfMonth().map((hm) => {
          return {
            name: hm.name,
            date: hm.date,
            amount: hm.amount,
          };
        })
      : this.activeDurationAndType().duration == '30 Days' &&
        this.activeDurationAndType().type == 'exp'
      ? this.stateTransactions.expensesByMonth().map((m) => {
          return {
            name: m.name,
            date: m.date,
            amount: m.amount,
          };
        })
      : this.activeDurationAndType().duration == '30 Days' &&
        this.activeDurationAndType().type == 'inc'
      ? this.stateTransactions.incomeByMonth().map((m) => {
          return {
            name: m.name,
            date: m.date,
            amount: m.amount,
          };
        })
      : [];
  });

  activeLabelsDateConversion = computed(() => {
    return this.activeLabels().length > 0
      ? this.activeLabels().map((lab) =>
          new Date(lab.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        )
      : [];
  });

  activeLabelsNames = computed(() => {
    return this.activeLabels().map((lab) => lab.name);
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

  chartBgColors = computed(() => {
    console.log(
      this.activeLabelsDateConversion().map((_) => this.getRandomColor())
    );
    return this.activeLabelsDateConversion().map((_) => this.getRandomColor());
  });

  createChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'pie',
      data: {
        labels: this.activeLabelsNames(),
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
            datalabels: {
              anchor: 'end',
              color: '#000',
              font: {
                size: 11.5,
                weight: 500,
                lineHeight: 1.25
              },
              backgroundColor: '#fff',
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#000',
              formatter: (value) => {
                return `${this.getNamesWithSpace(
                  this.activeLabels().filter((da) => da.amount == value)[0].name
                )}\nRs.${value}`;
              },
            },
            backgroundColor: this.chartBgColors(),
          },
        ],
      },
      options: {
        responsive: true,
        layout: {
          padding: 25,
        },
        plugins: {
          legend: {
            display: false,
            position: 'top',
            align: 'start',
            labels: {
              // padding: 20,
            },
          },
        },
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

  getRandomColor(): string {
    const randomInt = (min: number, max: number) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    let h = randomInt(0, 360);
    let s = randomInt(42, 98);
    let l = randomInt(40, 90);
    return `hsl(${h},${s}%,${l}%)`;
  }

  getNamesWithSpace(names: string): string {
    const words = names.split(' ');
    let lines = '';
    words.forEach((word) => {
      if ((lines + ' '+ word).split(' ').length == 2) {
        lines += (lines.length > 0 ? ' ' : '') + word;
      } else {
        lines += '\n' + word
      }
    });

    return lines;
  }
}
