# Lzainova AI

منصة ذكاء اصطناعي خاصة ومستقلة. تطبيق React Native/Expo هو الواجهة الأمامية،
مصمَّم للاتصال بـ **Lzainova Private API Gateway** الذي تديره بنفسك.

## المعمارية

```
Android/iOS/Web (Expo)
    ↓  services/aiEngine (abstraction)
Lzainova Private API Gateway (خارج هذا الـ repo)
    ↓
Agent Orchestrator → Router / Chat / Task / Coding / Vision / Memory / Verification
    ↓
AI Engine (vLLM / Ollama / LocalAI / نموذج Open-Weight)
    ↓
PostgreSQL · Redis · Object Storage · Sandbox
```

## طبقة AI Engine

الملف `services/aiEngine/index.ts` هو نقطة الاستبدال. تغيير القيمة في
`constants/config.ts`:

```ts
aiEngine: 'private-http', // بدلاً من 'local-mock'
apiBase: 'https://your-lzainova-api.example.com',
```

سيوجّه كل المحادثات إلى خادمك مباشرة بدون تعديل أي كود UI.

## هيكل المجلدات

- `app/` — شاشات Expo Router
- `components/` — واجهة المستخدم (chat, tasks, ui, layout)
- `contexts/` — Providers للحالة العامة
- `hooks/` — استهلاك Contexts
- `services/` — منطق البيانات (aiEngine, agents, storage)
- `constants/` — theme, styles, config

## المبدأ الأساسي

- **لا** يعتمد النظام على OpenAI/Gemini/Anthropic.
- **لا** توجد مفاتيح سرية داخل التطبيق.
- كل نداء AI يمر عبر واجهة `AIEngine` قابلة للاستبدال.
