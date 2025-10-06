'use client';
import { useEffect, useRef, useState } from 'react';
import { purchaseFlow } from '@/lib/purchaseFlow';

type Line = { who: 'bot' | 'user'; text: string };
type Msg  = { who: 'bot' | 'user'; text: string };

export default function ChatPane({ onIntent }:{ onIntent:(i:string)=>void }) {
  const [thread, setThread] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [scriptMode, setScriptMode] = useState(false);
  const [idx, setIdx] = useState(0);                // текущая позиция в purchaseFlow
  const [expectedUserOptions, setExpectedUserOptions] = useState<string[]>([]);
  const abortRef = useRef(false);
  const viewRef  = useRef<HTMLDivElement>(null);

  function add(text: string, who: 'bot'|'user'='bot') {
    setThread(t => [...t, { who, text }]);
  }
  function scroll() {
    viewRef.current?.scrollTo({ top: 99999, behavior: 'smooth' });
  }

  // ------- вспомогательное: подсвечивать правую колонку по словам в фразах бота ------
  function reflectIntentByText(text: string) {
    const t = text.toLowerCase();
    if (t.includes('затоп') || t.includes('залив') || t.includes('вода')) onIntent('fear_flood');
    else if (t.includes('пожар')) onIntent('fear_fire');
    else if (t.includes('краж') || t.includes('взлом')) onIntent('fear_theft');
    else if (t.includes('сосед') || t.includes('го') || t.includes('ответствен')) onIntent('liability');
    else if (t.includes('пример') || t.includes('выплат')) onIntent('cases');
    else if (t.includes('шаг') || t.includes('оформ')) onIntent('steps');
  }

  // ------- основной проигрыватель: бот говорит сам до момента, где сценарий ждёт пользователя ------
  async function playBotUntilUser(startAt: number) {
    let i = startAt;
    abortRef.current = false;
    setExpectedUserOptions([]);

    while (i < purchaseFlow.length && !abortRef.current) {
      const line = purchaseFlow[i];

      if (line.who === 'bot') {
        add(line.text, 'bot');
        reflectIntentByText(line.text);
        setIdx(i + 1);
        i++;
        scroll();
        await new Promise(r => setTimeout(r, 420)); // небольшая пауза между репликами бота
        continue;
      }

      // Дошли до очереди пользователя — собираем подряд все пользовательские варианты
      if (line.who === 'user') {
        const options: string[] = [];
        while (i < purchaseFlow.length && purchaseFlow[i].who === 'user') {
          options.push(purchaseFlow[i].text);
          i++;
        }
        setExpectedUserOptions(options); // показываем кнопки-варианты
        setIdx(i);                       // следующий индекс — после этих вариантов
        scroll();
        return; // Пауза: ждём ответа пользователя
      }
    }

    // Сценарий закончился — переведём в режим оформления (или оставим как есть)
    setScriptMode(false);
    onIntent('start_purchase');
  }

  // ------- обработка реального ответа пользователя (кнопка или ввод) ------
  async function handleUserReply(text: string) {
    if (!scriptMode) return; // в свободном режиме просто идём обычной отправкой
    add(text, 'user');
    scroll();
    setExpectedUserOptions([]);

    // Продолжаем с текущего idx (он указывает на первую фразу после пачки ожидаемых user-строк)
    await new Promise(r => setTimeout(r, 200));
    playBotUntilUser(idx);
  }

  function startScript() {
    setScriptMode(true);
    setThread([]);
    setIdx(0);
    setExpectedUserOptions([]);
    playBotUntilUser(0);
  }

  function stopScript() {
    abortRef.current = true;
    setScriptMode(false);
    setExpectedUserOptions([]);
  }

  // ------- свободный режим (без LLM: наш API вернёт intent по правилам) ------
  async function sendFree(text: string) {
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
    add('Я — виртуальный ассистент РГС. Подберу защиту и покажу примеры.');
  }, []);
  useEffect(() => { scroll(); }, [thread.length]);

  // Верхние быстрые чипы (топ-уровень)
  const chips: { label: string; onClick: () => void }[] = [
    {
      label: 'Оформить страховку',
      onClick: () => {
        add('Оформить страховку', 'user');
        startScript(); // запускаем режим воспроизведения по таблице
      }
    },
    { label: 'У меня своя квартира', onClick: () => { add('У меня своя квартира', 'user'); onIntent('owner'); } },
    { label: 'Я снимаю жильё',      onClick: () => { add('Я снимаю жильё', 'user'); onIntent('renter'); } },
    { label: 'Залив',                onClick: () => { add('Залив', 'user'); onIntent('fear_flood'); } },
    { label: 'Пожар',                onClick: () => { add('Пожар', 'user'); onIntent('fear_fire'); } },
    { label: 'Кража',                onClick: () => { add('Кража', 'user'); onIntent('fear_theft'); } },
    { label: 'Ответственность (ГО)', onClick: () => { add('Ответственность (ГО)', 'user'); onIntent('liability'); } },
    { label: 'Статистика',           onClick: () => { add('Статистика', 'user'); onIntent('stats_overall'); } },
    { label: 'Примеры выплат',       onClick: () => { add('Примеры выплат', 'user'); onIntent('cases'); } },
    { label: 'Шаги оформления',      onClick: () => { add('Шаги оформления', 'user'); onIntent('steps'); } },
  ];

  return (
    <div className="card">
      <div style={{display:'flex',alignItems:'center',gap:8, marginBottom:12}}>
        <div style={{width:32,height:32,borderRadius:16, background:'var(--rgs-primary)'}}/>
        <div style={{fontWeight:600}}>Виртуальный ассистент РГС</div>
        {scriptMode && (
          <button className="chip" style={{marginLeft:'auto'}} onClick={stopScript}>Стоп</button>
        )}
      </div>

      {/* Лента сообщений (бот слева, пользователь справа) */}
      <div ref={viewRef} style={{height:440, overflowY:'auto'}}>
        {thread.map((m, i) => (
          <div key={i} style={{display:'flex', justifyContent: m.who === 'user' ? 'flex-end' : 'flex-start', padding:'4px 0'}}>
            <div className={m.who === 'user' ? 'bubble bubble-user' : 'bubble bubble-bot'}>{m.text}</div>
          </div>
        ))}
      </div>

      {/* Подсказки-ответы из таблицы — появляются ТОЛЬКО когда сценарий ждёт пользователя */}
      {scriptMode && expectedUserOptions.length > 0 && (
        <div style={{display:'flex', gap:8, flexWrap:'wrap', marginTop:12}}>
          {expectedUserOptions.map((opt, i) => (
            <button key={i} className="chip" onClick={() => handleUserReply(opt)}>{opt}</button>
          ))}
        </div>
      )}

      {/* Чипы верхнего уровня (видны всегда) */}
      <div style={{display:'flex', gap:8, flexWrap:'wrap', marginTop:12}}>
        {chips.map((c, i) => (
          <button key={i} className="chip" onClick={c.onClick}>{c.label}</button>
        ))}
      </div>

      {/* Поле ввода:
          - В свободном режиме: всегда активно.
          - В сценарии: активно, но учитывается ТОЛЬКО когда сценарий ждёт ответ пользователя (показываются кнопки). */}
      <div style={{display:'flex', gap:8, marginTop:12}}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && input.trim()) {
              if (scriptMode && expectedUserOptions.length > 0) {
                handleUserReply(input.trim());      // ответ в рамке сценария
              } else if (!scriptMode) {
                sendFree(input.trim());             // обычный режим
              } else {
                // если сценарий идёт и не ждёт пользователя — игнорируем ввод
              }
              setInput('');
            }
          }}
          className="chip"
          style={{flex:1}}
          placeholder={scriptMode ? 'Введите ответ по сценарию…' : 'Введите сообщение...'}
        />
        <button
          className="btn btn-primary"
          onClick={() => {
            if (!input.trim()) return;
            if (scriptMode && expectedUserOptions.length > 0) {
              handleUserReply(input.trim());
            } else if (!scriptMode) {
              sendFree(input.trim());
            }
            setInput('');
          }}
        >
          Отправить
        </button>
      </div>
    </div>
  );
}
