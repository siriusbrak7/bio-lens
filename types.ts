export interface Topic {
  id: string;
  title: string;
}

export interface Unit {
  id: string;
  title: string;
  topics: Topic[];
}

// Data structure returned by Gemini
export interface NotebookContent {
  topicTitle: string;
  sectionA: {
    hook: string;
    keyConcept: string;
    narrativeMarkdown: string; // The main text
    realWorldRelevance: string;
    crossUnitConnections: string[];
    importantTerms: string[];
  };
  sectionB: {
    checkpoints: CheckpointQuestion[];
  };
  sectionC: {
    flashcards: Flashcard[];
  };
  sectionD: {
    researchQuestion: string;
    methodOverview: string;
    hypothesisPrompt: string;
    dataInterpretationQuestion: string;
    conclusionFramework: string;
  };
}

export interface CheckpointQuestion {
  id: number;
  type: 'Recall' | 'Application' | 'Analysis' | 'Critical Thinking';
  question: string;
  answer: string;
  explanation: string;
}

export interface Flashcard {
  id: number;
  type: string;
  front: string;
  back: string;
}

export enum AppState {
  SELECTING = 'SELECTING',
  LOADING = 'LOADING',
  VIEWING = 'VIEWING',
  ERROR = 'ERROR'
}
