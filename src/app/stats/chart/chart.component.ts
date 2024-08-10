import { Component, DestroyRef, Input, signal } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { StatData } from '../models/stat-data.model';
import { AVAILABLE_COUNTRIES } from '../countries.constants';
import { StatService } from '../stat.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { CommonModule } from '@angular/common';

@Component({
   selector: 'app-chart',
   standalone: true,
   imports: [HighchartsChartModule, CommonModule],
   templateUrl: './chart.component.html',
   styleUrl: './chart.component.scss',
})
export class ChartComponent {
   statData: StatData[] = [];

   Highcharts: typeof Highcharts = Highcharts;
   coConfirmedAndRecovered: Highcharts.Options = {};
   coVaccinationData: Highcharts.Options = {};
   coRates: Highcharts.Options = {};

   isLoading = signal(true);
   activeTab = 'confirmed-recovered';

   constructor(
      private readonly statService: StatService,
      private readonly destroyRef: DestroyRef
   ) {
      this.loadData();
   }

   loadData(): void {
      const requests = AVAILABLE_COUNTRIES.map((country) =>
         this.statService
            .getStatData(country.name)
            .pipe(takeUntilDestroyed(this.destroyRef))
      );

      forkJoin(requests).subscribe({
         next: (results) => {
            this.statData = results;
            this.createCharts();
            this.isLoading.set(false);
         },
         error: (error) => {
            console.error('Failed to load data:', error);
            this.isLoading.set(false);
         },
      });
   }

   createCharts(): void {
      this.coConfirmedAndRecovered = {
         chart: {
            type: 'line',
         },
         title: {
            text: 'COVID-19 Confirmed and Recovered Cases by Country',
         },
         xAxis: {
            categories: this.statData.map((data) => data.country),
         },
         yAxis: {
            title: {
               text: 'Number of Cases',
            },
            min: 0,
         },
         series: [
            {
               name: 'Confirmed',
               type: 'line',
               data: this.statData.map((data) => data.confirmed),
               visible: false,
            },
            {
               name: 'Recovered',
               type: 'line',
               data: this.statData.map((data) => data.recovered),
            },
            {
               name: 'Deaths',
               type: 'line',
               data: this.statData.map((data) => data.deaths),
            },
         ],
      };

      this.coVaccinationData = {
         chart: {
            type: 'line',
         },
         title: {
            text: 'COVID-19 Vaccination Data by Country',
         },
         xAxis: {
            categories: this.statData.map((data) => data.country),
         },
         yAxis: {
            title: {
               text: 'Number of Vaccinations',
            },
            min: 0,
         },
         series: [
            {
               name: 'People Vaccinated',
               type: 'line',
               data: this.statData.map((data) => data.people_vaccinated),
            },
            {
               name: 'Population',
               type: 'line',
               data: this.statData.map((data) => data.population),
            },
         ],
      };

      this.coRates = {
         chart: {
            type: 'line',
         },
         title: {
            text: 'COVID-19 Vaccination and Infection Rates by Country',
         },
         xAxis: {
            categories: this.statData.map((data) => data.country),
         },
         yAxis: {
            title: {
               text: 'Percentage',
            },
            min: 0,
         },
         series: [
            {
               name: 'Vaccination Rate (%)',
               type: 'line',
               data: this.statData.map((data) => data.vaccinationRate),
            },
            {
               name: 'Infection Rate (%)',
               type: 'line',
               data: this.statData.map((data) => data.infectionRate),
            },
         ],
      };
   }
   setActiveTab(tab: string) {
      this.activeTab = tab;
   }
}
