import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CodeContent } from './card-slider-models';

@Component({
  selector: 'app-code-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <p class="code-prompt">{{ data.prompt }}</p>

    <div class="code-layout">
      <!-- Editor pane -->
      <div class="code-pane editor-pane">
        <div class="pane-header">
          <span class="pane-tab active">{{ data.language || 'javascript' }}</span>
        </div>
        <textarea
          class="code-editor"
          [(ngModel)]="userCode"
          [disabled]="isSubmitted()"
          spellcheck="false"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"></textarea>
      </div>

      <!-- Console pane -->
      <div class="code-pane console-pane">
        <div class="pane-header">
          <span class="pane-tab">Console</span>
          @if (consoleOutput()) {
            <button class="clear-btn" [disabled]="isSubmitted()" (click)="clearConsole()">Clear</button>
          }
        </div>
        <pre class="console-output" [class.has-error]="hasError()">{{ consoleOutput() || '// output will appear here' }}</pre>
      </div>
    </div>

    <div class="code-actions">
      @if (!isSubmitted()) {
        <button class="run-btn" (click)="runCode()">▶ Run</button>
        <button class="submit-btn" [disabled]="!hasRun()" (click)="submitCode()">Submit</button>
      } @else {
        <div class="feedback" [class.correct]="isCorrect()" [class.incorrect]="!isCorrect()">
          @if (isCorrect()) {
            <span>✓ Output matches! Well done.</span>
          } @else {
            <span>✗ Expected: <code>{{ data.expectedOutput }}</code></span>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .code-prompt {
      color: #dfe7f3;
      margin-bottom: 16px;
      line-height: 1.5;
    }
    .code-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1px;
      border: 1px solid rgba(148,163,184,0.2);
      border-radius: 10px;
      overflow: hidden;
      margin-bottom: 14px;
      background: rgba(148,163,184,0.1);
    }
    .code-pane {
      display: flex;
      flex-direction: column;
      min-height: 200px;
    }
    .pane-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 14px;
      background: rgba(15,23,42,0.85);
      border-bottom: 1px solid rgba(148,163,184,0.12);
    }
    .pane-tab {
      font-size: 0.78rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #94a3b8;
    }
    .pane-tab.active { color: #a78bfa; }
    .clear-btn {
      padding: 2px 8px;
      border: 1px solid rgba(148,163,184,0.2);
      border-radius: 4px;
      background: transparent;
      color: #94a3b8;
      font-size: 0.72rem;
      cursor: pointer;
      transition: color 0.15s;
    }
    .clear-btn:hover { color: #e2e8f0; }

    .code-editor {
      flex: 1;
      width: 100%;
      padding: 14px;
      border: none;
      outline: none;
      resize: none;
      background: rgba(10,15,30,0.95);
      color: #e2e8f0;
      font-family: 'Fira Code', 'Courier New', monospace;
      font-size: 0.88rem;
      line-height: 1.6;
      tab-size: 2;
      box-sizing: border-box;
    }
    .code-editor:disabled { opacity: 0.55; }

    .console-output {
      flex: 1;
      margin: 0;
      padding: 14px;
      background: rgba(5,10,20,0.95);
      color: #4ade80;
      font-family: 'Fira Code', 'Courier New', monospace;
      font-size: 0.85rem;
      line-height: 1.6;
      overflow: auto;
      white-space: pre-wrap;
      word-break: break-word;
    }
    .console-output.has-error { color: #f87171; }

    .code-actions {
      display: flex;
      gap: 10px;
      align-items: stretch;
    }
    .run-btn {
      flex: 0 0 auto;
      padding: 10px 20px;
      border: 1px solid rgba(34,197,94,0.35);
      border-radius: 8px;
      background: rgba(34,197,94,0.12);
      color: #4ade80;
      font-weight: 700;
      font-size: 0.88rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .run-btn:hover {
      background: rgba(34,197,94,0.22);
      border-color: rgba(34,197,94,0.5);
    }
    .submit-btn {
      flex: 1;
      padding: 10px;
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.92rem;
      transition: opacity 0.2s;
    }
    .submit-btn:disabled {
      background: rgba(148,163,184,0.2);
      color: rgba(255,255,255,0.45);
      cursor: not-allowed;
    }
    .submit-btn:hover:not(:disabled) { opacity: 0.88; }

    .feedback {
      flex: 1;
      padding: 10px 16px;
      border-radius: 8px;
      font-weight: 600;
      display: flex;
      align-items: center;
    }
    .feedback.correct {
      background: rgba(34,197,94,0.14);
      border: 1px solid rgba(34,197,94,0.3);
      color: #4ade80;
    }
    .feedback.incorrect {
      background: rgba(239,68,68,0.14);
      border: 1px solid rgba(239,68,68,0.3);
      color: #f87171;
    }
    .feedback code {
      background: rgba(148,163,184,0.15);
      padding: 2px 6px;
      border-radius: 4px;
      margin-left: 4px;
      color: #a78bfa;
      font-family: 'Fira Code', 'Courier New', monospace;
    }

    @media (max-width: 640px) {
      .code-layout { grid-template-columns: 1fr; }
      .code-pane { min-height: 150px; }
    }
  `]
})
export class CodeViewComponent {
  @Input({ required: true }) data!: CodeContent;
  @Output() validated = new EventEmitter<boolean>();

  userCode = '';
  consoleOutput = signal('');
  hasError = signal(false);
  hasRun = signal(false);
  isSubmitted = signal(false);
  isCorrect = signal(false);

  ngOnInit(): void {
    this.userCode = this.data.starterCode || '';
  }

  runCode(): void {
    this.hasError.set(false);
    const logs: string[] = [];

    // Capture console.log output via a sandboxed Function
    const fakeConsole = {
      log: (...args: any[]) => logs.push(args.map(a => String(a)).join(' ')),
      error: (...args: any[]) => { logs.push('Error: ' + args.map(a => String(a)).join(' ')); },
      warn: (...args: any[]) => logs.push('Warn: ' + args.map(a => String(a)).join(' '))
    };

    try {
      const fn = new Function('console', this.userCode);
      fn(fakeConsole);
    } catch (err: any) {
      logs.push('Error: ' + (err.message || String(err)));
      this.hasError.set(true);
    }

    this.consoleOutput.set(logs.join('\n'));
    this.hasRun.set(true);
  }

  submitCode(): void {
    // Run one more time to get fresh output
    this.runCode();
    this.isSubmitted.set(true);

    const actual = this.consoleOutput().trim();
    const expected = this.data.expectedOutput.trim();
    const correct = actual === expected;
    this.isCorrect.set(correct);
    this.validated.emit(correct);
  }

  clearConsole(): void {
    this.consoleOutput.set('');
    this.hasRun.set(false);
  }
}
