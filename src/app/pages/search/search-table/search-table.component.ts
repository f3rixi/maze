import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { HtmlToTextPipe } from '../../../shared/pipes/html-to-text.pipe';

@Component({
  selector: 'app-search-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, HtmlToTextPipe],
  templateUrl: './search-table.component.html',
  styleUrl: './search-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchTableComponent {
  @Input() searchResults: any[] = [];

  displayedColumns: string[] = [
    'name',
    'image',
    'genres',
    'premiered',
    'ended',
    'rating',
    'summary',
  ];
}
