export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isAudio?: boolean;
}

export interface TranscriptionEntry {
  text: string;
  timestamp: number;
}

