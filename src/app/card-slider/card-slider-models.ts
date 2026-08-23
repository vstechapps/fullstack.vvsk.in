export type CardType = 'content' | 'mcq' | 'blank' | 'match' | 'order' | 'code';

export interface McqOption {
  id: string | number;
  text: string;
}

export interface McqContent {
  options: McqOption[];
  correctId: string | number;
}

export interface BlankContent {
  prompt: string;
  answer: string;
  caseSensitive?: boolean;
}

export interface MatchPair {
  left: string;
  right: string;
}

export interface MatchContent {
  pairs: MatchPair[];
}

export interface OrderContent {
  prompt?: string;
  correctOrder: string[];
}

export interface CodeContent {
  prompt: string;
  starterCode: string;
  language: string;
  expectedOutput: string;
}

export interface SliderCard {
  id: string | number;
  type: CardType;
  title: string;
  content: string | McqContent | BlankContent | MatchContent | OrderContent | CodeContent;
  completed?: boolean;
  duration?: string | number; // Optional duration for content cards
}
