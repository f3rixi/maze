import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { HtmlToTextPipe } from '../../shared/pipes/html-to-text.pipe';

@Component({
  selector: 'app-search-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, HtmlToTextPipe],
  templateUrl: './search-card.component.html',
  styleUrl: './search-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchCardComponent {
  @Input() searchResults: any[] = [];
}
