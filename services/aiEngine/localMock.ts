import { AIEngine, AIMessage, CodeAnalysis, StreamHandlers } from './types';

// LocalMockEngine — temporary implementation. Replace with `PrivateHttpEngine`
// pointing at your Lzainova AI Engine (vLLM/Ollama/LocalAI) via API Gateway.

const KNOWLEDGE: Array<{ match: RegExp; reply: (q: string) => string }> = [
  {
    match: /(السلام عليكم|مرحبا|أهلا|hello|hi|hey)/i,
    reply: () =>
      'وعليكم السلام ورحمة الله وبركاته. أنا Lzainova AI، مساعدك الخاص. كيف يمكنني خدمتك اليوم؟',
  },
  {
    match: /(كيف حالك|how are you)/i,
    reply: () =>
      'بخير الحمد لله. جاهز لتنفيذ مهامك — من محادثة سريعة إلى مشاريع متعددة الخطوات.',
  },
  {
    match: /(android|أندرويد)/i,
    reply: () =>
      'Android هو نظام تشغيل مفتوح المصدر تطوره Google، مبني على نواة Linux ويعمل على مليارات الأجهزة. يدعم تطوير التطبيقات بلغات Kotlin وJava وأدوات مثل Android Studio.',
  },
  {
    match: /(ما هو|اشرح|what is|explain)/i,
    reply: (q) =>
      `دعني أوضح لك بإيجاز: "${q.trim().slice(0, 80)}" — يتعلق هذا الموضوع بمفاهيم يمكن تفكيكها إلى: التعريف، السياق، المكونات الأساسية، وأمثلة تطبيقية. أخبرني إن أردت التعمق في جانب محدد.`,
  },
];

function craftReply(q: string): string {
  for (const k of KNOWLEDGE) {
    if (k.match.test(q)) return k.reply(q);
  }
  return `تم استلام طلبك. بصفتي Lzainova AI، سأعالج: "${q.trim().slice(0, 120)}". حاليًا أعمل بنموذج محلي مؤقت — يمكن استبداله بمحرك LLM الخاص بك عبر تعديل \`services/aiEngine\`.`;
}

async function tokenize(text: string): Promise<string[]> {
  // Simple word-level streaming simulation
  return text.split(/(\s+)/).filter((t) => t.length > 0);
}

export class LocalMockEngine implements AIEngine {
  readonly name = 'local-mock';

  async chat(messages: AIMessage[], handlers: StreamHandlers): Promise<() => void> {
    const last = messages[messages.length - 1]?.content ?? '';
    const reply = craftReply(last);
    const tokens = await tokenize(reply);

    let cancelled = false;
    let acc = '';

    (async () => {
      for (let i = 0; i < tokens.length; i++) {
        if (cancelled) return;
        acc += tokens[i];
        handlers.onDelta(tokens[i]);
        await new Promise((r) => setTimeout(r, 22));
      }
      if (!cancelled) handlers.onDone(acc);
    })();

    return () => {
      cancelled = true;
    };
  }

  async analyzeCode(code: string, language: string): Promise<CodeAnalysis> {
    await new Promise((r) => setTimeout(r, 350));
    const lines = code.split(/\r?\n/).length;
    const hasConsoleLog = /console\.log|print\(/.test(code);
    const hasTodo = /TODO|FIXME/i.test(code);
    return {
      language,
      summary: `تحليل مبدئي: ${lines} سطر، لغة ${language}. الكود يبدو منظمًا.`,
      issues: [
        ...(hasConsoleLog
          ? [{ severity: 'warning' as const, message: 'يوجد console/print — إن كان للتصحيح فقط، احذفه قبل الإنتاج.' }]
          : []),
        ...(hasTodo ? [{ severity: 'info' as const, message: 'يوجد TODO/FIXME غير معالج.' }] : []),
      ],
      suggestions: [
        'تحقق من معالجة الأخطاء (try/catch أو early return).',
        'وحّد التسميات ونمّط الملف قبل الرفع.',
      ],
      runOutput:
        '[sandbox-mock] لم يتم تشغيل الكود فعليًا. في الإنتاج سيُنفذ داخل Sandbox معزول ويُلتقط stdout/stderr.',
    };
  }
}
