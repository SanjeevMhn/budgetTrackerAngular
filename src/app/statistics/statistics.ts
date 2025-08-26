import {
  AfterViewInit,
  Component,
  ElementRef,
  signal,
  ViewChild,
} from '@angular/core';
import { ChevronLeft, Download, LucideAngularModule } from 'lucide-angular';
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

  @ViewChild('chart', { static: false })
  chartRef!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;

  tabList = signal([
    {
      id: 1,
      name: 'Day',
      active: true,
    },
    {
      id: 2,
      name: 'Week',
      active: false,
    },
    {
      id: 3,
      name: 'Month',
      active: false,
    },
    {
      id: 4,
      name: 'Year',
      active: false,
    },
  ]);

  transactions: Array<any> = [
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

  private chartData: Point[] = [
    { x: 1, y: 5 },
    { x: 2, y: 10 },
    { x: 3, y: 6 },
    { x: 4, y: 2 },
    { x: 4.1, y: 6 },
    { x: 1, y: 6 },
    { x: 2.2, y: 8 },
  ];

  ngAfterViewInit(): void {
    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'line',
      data: {
        labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
        datasets: [
          {
            label: 'Spendings per day',
            data: this.chartData,
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
}
