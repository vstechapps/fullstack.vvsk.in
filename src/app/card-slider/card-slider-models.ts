export type CardType = 'content' | 'mcq' | 'blank' | 'match' | 'order' | 'code';

export interface SliderCard {
  id: string | number;
  type: CardType;
  title: string;
  content: any; // Type-specific schema (options, code snippet, etc.)
  completed?: boolean; // Persists validation state if user tracks back
}
