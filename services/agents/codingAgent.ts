import { aiEngine } from '@/services/aiEngine';
import { CodeAnalysis } from '@/services/aiEngine/types';

// Coding Agent — separates source, execution output, errors, and suggestions.
// In production this must call a real Sandbox service. Here we delegate to the
// AIEngine.analyzeCode() which returns a strict CodeAnalysis shape.

export interface CodeReview {
  source: string;
  language: string;
  analysis: CodeAnalysis;
}

export async function reviewCode(source: string, language = 'plaintext'): Promise<CodeReview> {
  const analysis = await aiEngine.analyzeCode(source, language);
  return { source, language, analysis };
}
