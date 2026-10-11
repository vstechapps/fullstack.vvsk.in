type MDXMode = 'pdf' | 'ppt';

interface MDXExportOptions {
  mode?: MDXMode;
  scope?: 'all' | 'current';
}

export interface MDX {
  renderPreview(markdown: string, mode?: MDXMode, theme?: string): string;
  exportPreview(options?: MDXExportOptions): void;
}
