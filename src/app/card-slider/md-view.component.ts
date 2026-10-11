  import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import type { MDX } from '../../types/mdx';

@Component({
  selector: 'app-md-view',
  standalone: true,
  template: `<div class="md-content" [innerHTML]="renderedContent"></div>`,
  styles: [`
    :host {
      height: 100%;
      min-height: 0;
    }

    .md-content {
      height: 100%;
      max-height: 100%;
      overflow: auto;
      overscroll-behavior: contain;
      -webkit-overflow-scrolling: touch;
    }
  `]
})
export class MdViewComponent implements OnChanges {
  @Input({ required: true }) data!: string;

  renderedContent = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      const mdx: MDX = window.MDX;
      this.renderedContent = mdx.renderPreview(this.data, 'pdf', 'dark');
    }
  }
}
