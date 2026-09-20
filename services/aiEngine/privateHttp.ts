import { AIEngine, AIMessage, CodeAnalysis, StreamHandlers } from './types';

// PrivateHttpEngine — connects to your Lzainova Private API Gateway.
// Enable by setting AppConfig.aiEngine = 'private-http' and AppConfig.apiBase.
// Endpoints expected:
//   POST /api/chat        -> SSE stream of tokens
//   POST /api/code/analyze -> JSON CodeAnalysis

export class PrivateHttpEngine implements AIEngine {
  readonly name = 'private-http';

  constructor(private baseUrl: string, private authToken?: string) {}

  private headers(): Record<string, string> {
    const h: Record<string, string> = { 'Content-Type': 'application/json' };
    if (this.authToken) h.Authorization = `Bearer ${this.authToken}`;
    return h;
  }

  async chat(messages: AIMessage[], handlers: StreamHandlers): Promise<() => void> {
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch(`${this.baseUrl}/api/chat`, {
          method: 'POST',
          headers: this.headers(),
          body: JSON.stringify({ messages, stream: true }),
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const reader = (res.body as any)?.getReader?.();
        let acc = '';
        if (reader) {
          const decoder = new TextDecoder();
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value);
            for (const line of chunk.split(/\r?\n/)) {
              const trimmed = line.replace(/^data:\s?/, '').trim();
              if (!trimmed || trimmed === '[DONE]') continue;
              try {
                const j = JSON.parse(trimmed);
                const delta = j?.delta ?? j?.choices?.[0]?.delta?.content ?? '';
                if (delta) {
                  acc += delta;
                  handlers.onDelta(delta);
                }
              } catch {
                acc += trimmed;
                handlers.onDelta(trimmed);
              }
            }
          }
        } else {
          const text = await res.text();
          acc = text;
          handlers.onDelta(text);
        }
        handlers.onDone(acc);
      } catch (e: any) {
        handlers.onError?.(e);
      }
    })();
    return () => controller.abort();
  }

  async analyzeCode(code: string, language: string): Promise<CodeAnalysis> {
    const res = await fetch(`${this.baseUrl}/api/code/analyze`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({ code, language }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as CodeAnalysis;
  }
}
