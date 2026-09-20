// AIEngine abstraction — swap this for a real inference server (vLLM/Ollama/LocalAI)
// without touching UI code. Import { aiEngine } and call methods.

export type ChatRole = 'user' | 'assistant' | 'system';
export interface AIMessage {
  role: ChatRole;
  content: string;
}

export interface StreamHandlers {
  onDelta: (delta: string) => void;
  onDone: (full: string) => void;
  onError?: (err: Error) => void;
}

export interface AIEngine {
  readonly name: string;
  chat(messages: AIMessage[], handlers: StreamHandlers): Promise<() => void>;
  analyzeCode(code: string, language: string): Promise<CodeAnalysis>;
}

export interface CodeAnalysis {
  language: string;
  summary: string;
  issues: Array<{ severity: 'info' | 'warning' | 'error'; message: string }>;
  suggestions: string[];
  runOutput: string;
}
