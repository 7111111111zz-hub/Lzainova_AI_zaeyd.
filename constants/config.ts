// Lzainova AI — Runtime configuration
// Point AI_API_BASE at your private Lzainova backend when ready.

export const AppConfig = {
  brand: 'Lzainova AI',
  tagline: 'Private Intelligence Platform',
  version: '1.0.0',
  // Replace with your private API gateway when ready.
  apiBase: '',
  // Streaming supported by backend (SSE/WebSocket). When false, use text mode.
  streaming: true,
  // AIEngine implementation: 'local-mock' | 'private-http'
  aiEngine: 'local-mock',
};

export default AppConfig;
