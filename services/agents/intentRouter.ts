// Intent Router — classifies user requests into a downstream agent.
// Quick chat routes bypass task-progress UI entirely.

export type Intent = 'chat' | 'task' | 'code' | 'file';

const TASK_KEYWORDS = [
  'أنشئ تطبيق',
  'ابن',
  'ابنِ',
  'ابني',
  'بناء تطبيق',
  'أنشئ مشروع',
  'اكتب مشروع',
  'شغّل',
  'شغل',
  'صمم',
  'نفذ خطوات',
  'خطوة بخطوة',
  'build app',
  'create project',
  'scaffold',
  'generate project',
  'run pipeline',
  'multi-step',
  'orchestrate',
];

const CODE_KEYWORDS = [
  'debug',
  'error',
  'exception',
  'stack trace',
  'compile',
  'أصلح الكود',
  'حلل الكود',
  'شغل الكود',
  'راجع الكود',
  '```',
];

const FILE_KEYWORDS = [
  'حلل الملف',
  'اقرأ الملف',
  'استخرج',
  'ملف مرفق',
  'analyze file',
  'summarize document',
];

export function routeIntent(input: string, hasAttachment = false): Intent {
  const text = input.toLowerCase();
  if (hasAttachment) return 'file';
  if (FILE_KEYWORDS.some((k) => text.includes(k.toLowerCase()))) return 'file';
  if (CODE_KEYWORDS.some((k) => text.includes(k.toLowerCase()))) return 'code';
  if (TASK_KEYWORDS.some((k) => text.includes(k.toLowerCase()))) return 'task';
  return 'chat';
}

export function isQuickChat(input: string): boolean {
  const t = input.trim();
  if (t.length < 80) return true;
  return routeIntent(t) === 'chat';
}
