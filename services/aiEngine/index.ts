import AppConfig from '@/constants/config';
import { LocalMockEngine } from './localMock';
import { PrivateHttpEngine } from './privateHttp';
import { AIEngine } from './types';

// Central factory — swap implementation without touching UI code.
export function createAIEngine(): AIEngine {
  if (AppConfig.aiEngine === 'private-http' && AppConfig.apiBase) {
    return new PrivateHttpEngine(AppConfig.apiBase);
  }
  return new LocalMockEngine();
}

export const aiEngine: AIEngine = createAIEngine();
export * from './types';
