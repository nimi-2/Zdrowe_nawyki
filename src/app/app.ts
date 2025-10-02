import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class AppComponent implements OnInit {
  // Wartości pasków postępu
  stepsValue: number = 8543;
  caloriesValue: number = 2247;
  sleepMinutes: number = 454;
  sleepHour: number = parseFloat((this.sleepMinutes / 60).toFixed(1));

  getSleepHours(): number {
    return parseFloat((this.sleepMinutes / 60).toFixed(1));
  }

  //Cele do pasków progresu
  stepsGoal: number = 10000;
  caloriesGoal: number = 3000;
  sleepGoal: number = 480;

  //Długośc wyświetlanych pasków progresu
  currentStepsPercent: number = Math.round((this.stepsValue / this.stepsGoal) * 100);
  currentCaloriesPercent: number = Math.round((this.caloriesValue / this.caloriesGoal) * 100);
  currentSleepPercent: number = Math.round((this.sleepMinutes / this.sleepGoal) * 100);

  //Data do kalendarza
  currentDate: Date = new Date();
  viewYear: number = new Date().getFullYear();
  viewMonth: number = new Date().getMonth();
  calendarDays: any[] = [];
  currentMonth: string = '';

  monthNames: string[] = [
    'Styczeń',
    'Luty',
    'Marzec',
    'Kwiecień',
    'Maj',
    'Czerwiec',
    'Lipiec',
    'Sierpień',
    'Wrzesień',
    'Październik',
    'Listopad',
    'Grudzień',
  ];

  chartData = {
    steps: [0, 0, 0, 0, 0, 0, 0, 30, 65, 72, 68, 20, 10, 2, 5, 2, 30, 48, 45, 20, 15, 10, 8, 5],
    fire: [5, 0, 2, 3, 5, 2, 8, 5, 70, 80, 75, 50, 45, 48, 40, 45, 35, 62, 80, 25, 20, 15, 12, 8],
    sleep: [30, 55, 68, 75, 48, 45, 52, 58, 0, 0, 0, 0, 0, 0, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  };

  //Etykiety osi X
  hours: number[] = Array.from({ length: 24 }, (_, i) => i);
  currentChartType: string = 'steps';
  currentChartData: number[] = this.chartData.steps;

  ngOnInit(): void {
    this.generateCalendar();
  }

  getFormattedSteps(): string {
    return this.stepsValue.toLocaleString('pl-PL');
  }

  getFormattedCalories(): string {
    return this.caloriesValue.toLocaleString('pl-PL');
  }

  getFormattedSleep(): string {
    const hours = Math.floor(this.sleepMinutes / 60);
    const minutes = this.sleepMinutes % 60;
    return `${hours}h ${minutes}m`;
  }

  //Funcja genrerująca kalendarz
  //Wyświetla dni z poprzedniego i następnego miesiąca
  //Losowo generuje wskaźniki aktywności dla dni przeszłych i bieżącego
  generateCalendar(): void {
    this.calendarDays = [];
    this.currentMonth = `${this.monthNames[this.viewMonth]} ${this.viewYear}`;

    let year = this.viewYear;
    let month = this.viewMonth;
    let firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDay = (firstDay.getDay() + 6) % 7;
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    for (let i = startDay - 1; i >= 0; i--) {
      this.calendarDays.push({
        day: prevMonthLastDay - i,
        isInactive: true,
        isToday: false,
        isCompleted: false,
        indicators: [],
      });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const indicators = [];

      const isPastMonth =
        year < this.currentDate.getFullYear() ||
        (year === this.currentDate.getFullYear() && month < this.currentDate.getMonth());

      const isBeforeOrToday = date <= this.currentDate;

      if (isPastMonth || isBeforeOrToday) {
        if (Math.random() > 0.3) indicators.push('steps');
        if (Math.random() > 0.3) indicators.push('fire');
        if (Math.random() > 0.3) indicators.push('sleep');
      }

      this.calendarDays.push({
        day: day,
        isInactive: false,
        isToday: this.isToday(date),
        isCompleted: false,
        date: date,
        indicators: indicators,
      });
    }

    const remainingDays = 42 - this.calendarDays.length;
    for (let day = 1; day <= remainingDays; day++) {
      this.calendarDays.push({
        day: day,
        isInactive: true,
        isToday: false,
        isCompleted: false,
        indicators: [],
      });
    }
  }

  isToday(date: Date): boolean {
    const today = this.currentDate;
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  previousMonth(): void {
    if (this.viewMonth === 0) {
      this.viewMonth = 11;
      this.viewYear--;
    } else {
      this.viewMonth--;
    }
    this.generateCalendar();
  }

  nextMonth(): void {
    if (this.viewMonth === 11) {
      this.viewMonth = 0;
      this.viewYear++;
    } else {
      this.viewMonth++;
    }
    this.generateCalendar();
  }

  //Funkcja zmieniająca typ wykresu i animująca przejście
  changeChart(type: string) {
    this.currentChartType = type;

    const bars = document.querySelectorAll('.chart-bar');
    bars.forEach((bar) => {
      const el = bar as HTMLElement;
      el.classList.remove('animate');
    });

    setTimeout(() => {
      this.currentChartData = this.chartData[type as keyof typeof this.chartData];

      setTimeout(() => {
        const newBars = document.querySelectorAll('.chart-bar');
        newBars.forEach((bar) => {
          const el = bar as HTMLElement;
          void el.offsetWidth;
          el.classList.add('animate');
        });
      }, 10);
    }, 10);
  }

  getChartBarColor(): string {
    const colors = {
      steps: 'linear-gradient(to top, #10b981, #34d399)',
      fire: 'linear-gradient(to top, #f59e0b, #fbbf24)',
      sleep: 'linear-gradient(to top, #8b5cf6, #a78bfa)',
    };
    return colors[this.currentChartType as keyof typeof colors];
  }

  //Funkcje generujące etykiety osi Y w zależności od typu wykresu
  getYAxisLabels(): any[] {
    const ranges = {
      steps: [2500, 2000, 1500, 1000, 500, 0],
      fire: [3000, 2400, 1800, 1200, 600, 0],
      sleep: ['Głęboki', 'REM', 'Lekki'],
    };

    return ranges[this.currentChartType as keyof typeof ranges];
  }

  formatYAxisLabel(value: number): string {
    switch (this.currentChartType) {
      case 'steps':
        return value.toLocaleString();
      case 'fire':
        return `${value} ml`;
      case 'sleep':
        return `${value} `;
      default:
        return value.toString();
    }
  }
}
