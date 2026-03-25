export type Language = 'en' | 'zh-TW';
export type Theme = 'light' | 'dark';

export interface PantoneStyle {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  bg: string;
  text: string;
}

export interface Artifact {
  id: string;
  content: string;
  type: 'note' | 'organized' | 'report' | 'questions';
  timestamp: number;
}

export interface AppState {
  language: Language;
  theme: Theme;
  styleId: string;
  reviewNote: string;
  organizedDoc: string;
  instructions: string;
  sampleReport: string;
  finalReport: string;
  followUpQuestions: string[];
  isGenerating: boolean;
  currentStep: number;
}
