import {
   Component,
   computed,
   DestroyRef,
   Directive,
   EventEmitter,
   Input,
   Output,
   QueryList,
   Signal,
   signal,
   ViewChildren,
} from '@angular/core';

import { StatData } from '../models/stat-data.model';
import { StatService } from '../stat.service';
import { AVAILABLE_COUNTRIES } from '../countries.constants';
import { CommonModule, DecimalPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChartComponent } from '../chart/chart.component';
import { Country } from '../models/country.model';
import { CountryComponent } from '../single-country-stat/country/country.component';
import { environment } from '../../../environments/environment.development';

export type SortColumn = keyof StatData | '';
export type SortDirection = 'asc' | 'desc' | '';

const rotate: { [key: string]: SortDirection } = {
   asc: 'desc',
   desc: '',
   '': 'asc',
};

const compare = (v1: string | number | Date, v2: string | number | Date) =>
   v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

export interface SortEvent {
   column: SortColumn;
   direction: SortDirection;
}

@Directive({
   selector: 'th[sortable]',
   standalone: true,
   host: {
      '[class.asc]': 'direction === "asc"',
      '[class.desc]': 'direction === "desc"',
      '(click)': 'rotate()',
   },
})
export class NgbdSortableHeader {
   @Input() sortable: SortColumn = '';
   @Input() direction: SortDirection = '';
   @Output() sort = new EventEmitter<SortEvent>();

   rotate() {
      this.direction = rotate[this.direction];
      this.sort.emit({ column: this.sortable, direction: this.direction });
   }
}

@Component({
   selector: 'app-stat',
   standalone: true,
   imports: [CommonModule, DecimalPipe, NgbdSortableHeader, CountryComponent],
   templateUrl: './stat.component.html',
   styleUrl: './stat.component.scss',
})
export class StatComponent {
   FLAG_BASEURL = `${environment.flagPicturesBaseUrl}`;
   data: StatData[] = [];
   statData: StatData[] = [];
   @ViewChildren(NgbdSortableHeader)
   headers: QueryList<NgbdSortableHeader> = new QueryList<NgbdSortableHeader>();
   selectedCountryName = signal<string | undefined>(undefined);
   selectedCountryData = signal<Country | undefined>(undefined);

   constructor(
      private readonly statService: StatService,
      private readonly destroyRef: DestroyRef
   ) {
      this.loadData();
   }

   ngOnInit() {
      this.statData = this.data;
   }

   onRowClick(stat: StatData): void {
      if (stat.country === this.selectedCountryName()) {
         this.selectedCountryName.set(undefined);
         this.selectedCountryData.set(undefined);
      } else {
         this.selectedCountryName.set(stat.country);
         if (this.selectedCountryName()) {
            this.statService
               .getCovidStatistics(this.selectedCountryName() ?? '')
               .subscribe({
                  next: (covidData) =>
                     this.selectedCountryData.set(covidData.country_data),
                  error: (err) =>
                     console.error('Error loading country data', err),
               });
         }
      }
   }

   onSort({ column, direction }: SortEvent) {
      this.headers.forEach((header) => {
         if (header.sortable !== column) {
            header.direction = '';
         }
      });

      if (direction === '' || column === '') {
         this.statData = this.data;
      } else {
         this.statData = [...this.data].sort((a, b) => {
            const res = compare(a[column], b[column]);
            return direction === 'asc' ? res : -res;
         });
      }
   }

   loadData(): void {
      AVAILABLE_COUNTRIES.forEach((country) => {
         this.statService
            .getStatData(country.name)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
               next: (countryStat) => {
                  this.data.push(countryStat);
               },
               error: (error) => {
                  console.error(`Failed to load data for ${country}:`, error);
               },
            });
      });
   }
}
