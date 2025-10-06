# RGS.Квартира — прототип (Next.js, App Router)

Готов для деплоя на **Vercel (Hobby)**. Включает:
- чат слева (`components/ChatPane.tsx`),
- релевантный контент справа (`components/ContentPane.tsx`),
- локальная библиотека карточек (`lib/contentLibrary.ts`),
- API-роут `/app/api/chat/route.ts` с флагом `USE_LLM=false` (без DeepSeek).

## Локальный запуск
```bash
npm i
npm run dev
# открыть http://localhost:3000
```

## Включить DeepSeek позже
- Поставьте `USE_LLM = true` в `app/api/chat/route.ts`.
- Добавьте переменную окружения `DEEPSEEK_API_KEY` в Vercel Project Settings → Environment Variables.
