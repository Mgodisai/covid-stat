export class StatData {
   constructor(
      public country: string,
      public flag: string,
      public population: number,
      public confirmed: number,
      public recovered: number,
      public deaths: number,
      public administered: number,
      public people_vaccinated: number,
      public updated: Date
   ) {}

   get vaccinationRate(): number {
      return this.population > 0
         ? Math.round((this.people_vaccinated / this.population) * 10000) / 100
         : 0;
   }

   get infectionRate(): number {
      return this.population > 0
         ? Math.round((this.confirmed / this.population) * 10000) / 100
         : 0;
   }
}
