import {
  AfterViewInit,
  Component,
  computed,
  effect,
  ElementRef,
  signal,
  ViewChild,
} from '@angular/core';
import {
  Chart,
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
} from 'chart.js';
import {
  BellDot,
  ChevronLeft,
  LucideAngularModule,
  Plus,
} from 'lucide-angular';

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
  selector: 'app-wallet',
  imports: [LucideAngularModule],
  templateUrl: './wallet.html',
  styleUrl: './wallet.scss',
})
export class Wallet implements AfterViewInit {
  backButtonIcon = ChevronLeft;
  bellIcon = BellDot;
  plusIcon = Plus;

  transactions: Array<{
    id: number;
    name: string;
    type: string;
    amount: number;
    date: string;
  }> = [
    {
      id: 101,
      name: 'Groceries',
      type: 'expense',
      amount: 2500,
      date: '2025-05-12',
    },
    {
      id: 102,
      name: 'Tire Change',
      type: 'expense',
      amount: 4500,
      date: '2025-05-20',
    },
    {
      id: 103,
      name: 'Freelance Payment',
      type: 'income',
      amount: 30000,
      date: '2025-06-12',
    },
    {
      id: 104,
      name: 'Sold Artwork',
      type: 'income',
      amount: 8000,
      date: '2025-06-25',
    },
  ];

  colors = ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51'];

  // data = this.transactions().map((tran) => tran.amount);

  tabs = signal<
    Array<{ id: number; name: string; type: string; active: boolean }>
  >([
    {
      id: 1,
      name: 'Expenses',
      type: 'expense',
      active: true,
    },
    {
      id: 2,
      name: 'Income',
      type: 'income',
      active: false,
    },
  ]);

  activeTabType = computed(() => {
    return this.tabs().filter((tab) => tab.active)[0].type;
  });

  transactionsLabels = computed(() => {
    return this.transactions
      .filter((lb) => lb.type == this.activeTabType())
      .map((lb) => lb.name);
  });

  activeChartData = computed(() => {
    return this.transactions
      .filter((da) => da.type == this.activeTabType())
      .map((am) => am.amount);
  });

  chart!: Chart;
  @ViewChild('chart') chartRef!: ElementRef<HTMLCanvasElement>;

  constructor() {
    effect(() => {
      const data = this.activeChartData();
      const labels = this.transactionsLabels();
      if (this.chart) {
        this.chart.data.labels = labels;
        this.chart.data.datasets[0].data = data;
        this.chart.update();
      }
    });
  }

  ngAfterViewInit(): void {
    this.createChart();
  }

 
  createChart() {
    if(this.chart){
      this.chart.destroy()
    }
    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: this.transactionsLabels(),
        datasets: [
          {
            label: 'Transactions',
            data: this.activeChartData(),
            backgroundColor: this.colors,
          },
        ],
      },
    });
  }

  toggleActiveTabs(activeTab: number) {
    const updated = this.tabs().map((tab) => {
      if (tab.id == activeTab) {
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

    this.tabs.set(updated);
  }
}
