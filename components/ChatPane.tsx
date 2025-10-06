'use client';
import { useEffect, useRef, useState } from 'react';
import { purchaseFlow } from '@/lib/purchaseFlow'; // ← сценарий, сгенерированный из Excel
type ScriptLine = { who: 'bot' | 'user'; text: string };

type Msg = { who: 'bot' | 'user'; text: string };

export default function ChatPane({ onIntent }:{ onIntent:(i:string)=>void }) {
  const [thread, setThread] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [scriptMode, setScriptMode] = useState(false);
  const [scriptIdx, setScriptIdx] = useState(0);
  const abortRef = useRef<{stop: boolean}>({ stop: false });
  const viewRef = useRef<HTMLDivElement>(null);

  function add(text: string, who: 'bot' | 'user' = 'bot') {
    setThread(t => [...t, { who, text }]);
  }
  function scroll() {
    viewRef.current?.scrollTo({ top: 99999, behavior: 'smooth' });
  }

  // ——— Автопроигрывание сценария «Оформление» из Excel ———
  async function playPurchaseScript(lines: ScriptLine[]) {
    setScriptMode(true);
    setThread([]);            // очищаем чат
    setScriptIdx(0);
    abortRef.current.stop = false;

    for (let i = 0; i < lines.length; i++) {
      if (abortRef.current.stop) break;
      const m = lines[i];
      // Небольшая задержка между фразами для реалистичности
      await new Promise(r => setTimeout(r, 420));
      add(m.text, m.who);
      setScriptIdx(i + 1);
      scroll();

      // (Опционально) подстраиваем правую колонку по ключевым словам
      const t = m.text.toLowerCase();
      if (m.who === 'bot') {
        if (t.includes('затоп') || t.includes('залив') || t.includes('вода')) onIntent('fear_flood');
        else if (t.includes('пожар')) onIntent('fear_fire');
        else if (t.includes('краж') || t.includes('взлом')) onIntent('fear_theft');
        else if (t.includes('сосед') || t.includes('го') || t.includes('ответствен')) onIntent('liability');
        else if (t.includes('пример') || t.includes('выплат')) onIntent('cases');
        else if (t.includes('шаг') || t.includes('оформ')) onIntent('steps');
      }
    }

    setScriptMode(false);
    // По завершении сценария переключаемся в режим реального оформления
    onIntent('start_purchase');
  }

  function stopScript() {
    abortRef.current.stop = true;
    setScriptMode(false);
  }

  // ——— Обычная отправка в «без LLM» режим (наш /api/chat возвращает intent по правилам) ———
  async function send(text: string) {
    add(text, 'user');
    setInput('');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: text }] })
      });
      const data = await res.json().catch(() => ({ message: 'Не удалось разобрать ответ', intent: 'faq_common' }));
      add(data.message || '');
      if (data.intent) onIntent(data.intent);
    } catch {
      add('Не получилось ответить. Попробуйте ещё раз.', 'bot');
    }
    scroll();
  }

  useEffect(() => {
    // Приветствие
    add('Я — виртуальный ассистент РГС. Подберу защиту и покажу примеры.');
  }, []);
  useEffect(() => { scroll(); }, [thread.length]);

  // Быстрые чипы
  const chips: { label: string; onClick: () => void }[] = [
    {
      label: 'Оформить страховку',
      onClick: () => {
        add('Оформить страховку', 'user');
        // запускаем сценарий из Excel:
        playPurchaseScript(purchaseFlow);
      }
    },
    { label: 'У меня своя квартира', onClick: () => { add('У меня своя квартира', 'user'); onIntent('owner'); } },
    { label: 'Я снимаю жильё', onClick: () => { add('Я снимаю жильё', 'user'); onIntent('renter'); } },
    { label: 'Залив', onClick: () => { add('Залив', 'user'); onIntent('fear_flood'); } },
    { label: 'Пожар', onClick: () => { add('Пожар', 'user'); onIntent('fear_fire'); } },
    { label: 'Кража', onClick: () => { add('Кража', 'user'); onIntent('fear_theft'); } },
    { label: 'Ответственность (ГО)', onClick: () => { add('Ответственность (ГО)', 'user'); onIntent('liability'); } },
    { label: 'Статистика', onClick: () => { add('Статистика', 'user'); onIntent('stats_overall'); } },
    { label: 'Примеры выплат', onClick: () => { add('Примеры выплат', 'user'); onIntent('cases'); } },
    { label: 'Шаги оформления', onClick: () => { add('Шаги оформления', 'user'); onIntent('steps'); } },
  ];

  const progress = scriptMode && purchaseFlow.length > 0
    ? Math.round((scriptIdx / purchaseFlow.length) * 100)
    : 0;

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 16, background: 'var(--rgs-primary)' }} />
        <div style={{ fontWeight: 600 }}>Виртуальный ассистент РГС</div>
      </div>

      {/* Статус-бар демо-сценария */}
      {scriptMode && (
        <div className="text-muted" style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <div>Воспроизвожу сценарий оформления… {scriptIdx}/{purchaseFlow.length}</div>
          <div style={{ flex: 1, height: 6, background: '#e5e7eb', borderRadius: 999 }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'var(--rgs-primary)', borderRadius: 999 }} />
          </div>
          <button className="chip" onClick={stopScript}>Стоп</button>
        </div>
      )}

      {/* Лента сообщений */}
      <div ref={viewRef} style={{ height: 440, overflowY: 'auto' }}>
        {thread.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.who === 'user' ? 'flex-end' : 'flex-start', padding: '4px 0' }}>
            <div className={m.who === 'user' ? 'bubble bubble-user' : 'bubble bubble-bot'}>{m.text}</div>
          </div>
        ))}
      </div>

      {/* Быстрые чипы */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
        {chips.map((c, i) => (
          <button key={i} className="chip" onClick={c.onClick}>{c.label}</button>
        ))}
      </div>

      {/* Поле ввода скрываем, когда идёт автосценарий */}
      {!scriptMode && (
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && input.trim() && send(input)}
            className="chip"
            style={{ flex: 1 }}
            placeholder="Введите сообщение..."
          />
          <button onClick={() => input.trim() && send(input)} className="btn btn-primary">Отправить</button>
        </div>
      )}
    </div>
  );
}
