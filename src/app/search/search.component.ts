import { MatSpinner } from '@angular/material/progress-spinner';
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  Subject,
  switchMap,
} from 'rxjs';
import { ApiService } from '../shared/services/api/api.service';
import { SearchTableComponent } from './search-table/search-table.component';
import { SearchCardComponent } from './search-card/search-card.component';
import { FilterSortService } from '../shared/services/utills/filter-sort.service';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
    HttpClientModule,
    MatSpinner,
    MatOption,
    MatSelect,
    SearchTableComponent,
    SearchCardComponent,
    InfiniteScrollModule,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  providers: [ApiService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SearchComponent implements OnInit {
  searchQuery: string = '';
  displayedResults: any[] = [];
  results: any[] = [];

  isLoading = false;
  errorMessage: string | null = null;
  viewMode: 'table' | 'card' = 'table';
  filterForm!: FormGroup;
  pageSize = 5;

  pageIndex = 0;

  private searchSubject = new Subject<string>();

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private filterSortService: FilterSortService
  ) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      genre: [''],
      rating: [''],
      year: [''],
      sort: [''],
    });

    this.filterForm.valueChanges.subscribe(() => {
      this.applyFiltersAndSort();
    });

    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => {
          this.isLoading = true;
          return this.apiService.get('search/shows', query);
        }),
        catchError((error) => {
          this.errorMessage =
            'Failed to fetch search results. Please try again.';
          this.isLoading = false;
          return [];
        })
      )
      .subscribe(
        (results: any) => {
          this.results = results;
          this.isLoading = false;
          this.pageIndex = 0;
          this.applyFiltersAndSort();
        },
        (error) => {
          this.errorMessage =
            'Failed to fetch search results. Please try again.';
          this.isLoading = false;
        }
      );
  }
  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.searchSubject.next(this.searchQuery);
    }
  }

  switchView(view: 'table' | 'card'): void {
    this.viewMode = view;
  }

  applyFiltersAndSort() {
    const { genre, rating, year, sort } = this.filterForm.value;

    let filteredResults = this.filterSortService.filterResults(
      this.results,
      genre,
      rating ? +rating : 0,
      year ? +year : 0
    );

    if (sort) {
      filteredResults = this.filterSortService.sortResults(
        filteredResults,
        sort
      );
    }

    this.displayedResults = [];
    this.pageIndex = 0;
    this.loadMoreResults(filteredResults);
  }

  loadMoreResults(filteredResults: any[]) {
    const nextResults = filteredResults.slice(
      this.pageIndex * this.pageSize,
      (this.pageIndex + 1) * this.pageSize
    );
    this.displayedResults = [...this.displayedResults, ...nextResults];
    this.pageIndex++;
  }

  onScroll() {
    this.loadMoreResults(this.results);
  }
}
