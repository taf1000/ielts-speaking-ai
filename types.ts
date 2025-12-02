export enum AppMode {
  LANDING = 'LANDING',
  MODE_SELECT = 'MODE_SELECT',
  MOCK_TEST = 'MOCK_TEST',
  COACH = 'COACH',
  RESULTS = 'RESULTS'
}

export interface Message {
  role: 'user' | 'assistant';
  text: string;
}

export interface IELTSScore {
  fc: number;
  lr: number;
  gra: number;
  p: number;
  overall: number;
  feedback: string;
}

export interface AudioStreamConfig {
  sampleRate: number;
}