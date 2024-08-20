import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FilterSortService {
  constructor() {}

  filterResults(
    results: any[],
    genre: string,
    rating: number,
    year: number
  ): any[] {
    let filteredResults = [...results];

    if (genre) {
      const genreLower = genre.toLowerCase();
      filteredResults = filteredResults.filter((show) =>
        show.show.genres.some((g: any) => g.toLowerCase().includes(genreLower))
      );
    }

    if (rating) {
      filteredResults = filteredResults.filter(
        (show) => show.show.rating.average >= rating
      );
    }

    // Filter by year
    if (year) {
      filteredResults = filteredResults.filter(
        (show) => new Date(show.show.premiered).getFullYear() === year
      );
    }

    return filteredResults;
  }

  sortResults(results: any[], sortBy: string): any[] {
    return results.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.show.name.localeCompare(b.show.name);
        case 'rating':
          return b.show.rating.average - a.show.rating.average;
        case 'year':
          return (
            new Date(b.show.premiered).getFullYear() -
            new Date(a.show.premiered).getFullYear()
          );
        default:
          return 0;
      }
    });
  }
}
