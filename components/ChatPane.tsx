'use client';
import { useEffect, useRef, useState } from 'react';
import { flow, type Node, type Reply } from '@/lib/dialogFlow';

type Msg = { who:'bot'|'user'; text:string };

export default function ChatPane({ onIntent }:{ onIntent:(i:string)=>void }){
  const [thread, setThread] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [current, setCurrent] = useState<Node|undefined>();
  const [mode, setMode] = useState<'free'|'demo'>('free'); // новый режим
  const viewRef = useRef<HTMLDivElement>(null);

  function add(text:string, who:'bot'|'user'='bot'){ setThread(t=>[...t,{who,text}]); }
  function scroll(){ viewRef.current?.scrollTo({top:99999, behavior:'smooth'}); }

  // Проигрывает бот-сообщения узла последовательно
  async function playBot(node: Node){
    const parts = Array.isArray(node.bot) ? node.bot : [node.bot];
    for(const p of parts){
      await new Promise(r=>setTimeout(r, 400));
      add(p,'bot'); scroll();
    }
    if(node.intent) onIntent(node.intent);
  }

  function goto(id: string){
    const n = flow[id]; setCurrent(n);
    if(!n) return;
    playBot(n);
    // если это handoff в оформление — дергаем intent start_purchase
    if(n.intent === 'start_purchase') onIntent('start_purchase');
  }

  // Старт демо
  function startDemo(){
    setMode('demo');
    setThread([]); // очистим
    goto('start');
  }

  // Пользователь выбирает быстрый ответ (в демо)
  function pick(reply: Reply){
    add(reply.label,'user'); scroll();
    if(reply.intent) onIntent(reply.intent);
    goto(reply.next);
  }

  // Обычная отправка (режим free)
  async function send(text:string){
    add(text,'user'); setInput('');
    const res = await fetch('/api/chat', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ messages: [ {role:'user', content:text} ] })
    });
    const data = await res.json().catch(()=>({message:'Не удалось разобрать ответ', intent:'faq_common'}));
    add(data.message||'');
    if(data.intent) onIntent(data.intent);
    scroll();
  }

  useEffect(()=>{ add('Я — виртуальный ассистент РГС. Подберу защиту и покажу примеры.'); },[]);
  useEffect(()=>{ scroll(); },[thread.length]);

  const chips = [
    {label:'Демо-диалог', action: startDemo},
    {label:'Оформить страховку', action: ()=>onIntent('start_purchase')},
    {label:'У меня своя квартира', action: ()=>onIntent('owner')},
    {label:'Я снимаю жильё', action: ()=>onIntent('renter')},
    {label:'Залив', action: ()=>onIntent('fear_flood')},
    {label:'Пожар', action: ()=>onIntent('fear_fire')},
    {label:'Кража', action: ()=>onIntent('fear_theft')},
    {label:'Ответственность (ГО)', action: ()=>onIntent('liability')},
    {label:'Статистика', action: ()=>onIntent('stats_overall')},
    {label:'Примеры выплат', action: ()=>onIntent('cases')},
    {label:'Шаги оформления', action: ()=>onIntent('steps')},
  ];

  // Кнопки-ответы демо для текущего узла
  const replies = mode==='demo' && current?.replies ? current.replies : [];

  return (
    <div className="card">
      <div style={{display:'flex',alignItems:'center',gap:8, marginBottom:12}}>
        <div style={{width:32,height:32,borderRadius:16, background:'var(--rgs-primary)'}}/>
        <div style={{fontWeight:600}}>Виртуальный ассистент РГС</div>
      </div>

      <div ref={viewRef} style={{height:440, overflowY:'auto'}}>
        {thread.map((m,i)=> (
          <div key={i} style={{display:'flex', justifyContent: m.who==='user'?'flex-end':'flex-start', padding:'4px 0'}}>
            <div className={m.who==='user'?'bubble bubble-user':'bubble bubble-bot'}>{m.text}</div>
          </div>
        ))}
      </div>

      {/* Быстрые ответы демо-режима */}
      {replies.length>0 && (
        <div style={{display:'flex', gap:8, flexWrap:'wrap', marginTop:12}}>
          {replies.map((r,i)=>(
            <button key={i} className="chip" onClick={()=>pick(r)}>{r.label}</button>
          ))}
        </div>
      )}

      {/* Чипы верхнего уровня */}
      <div style={{display:'flex', gap:8, flexWrap:'wrap', marginTop:12}}>
        {chips.map((c,i)=>(
          <button key={i} className="chip" onClick={()=>{
            add(c.label,'user');
            c.action();
          }}>{c.label}</button>
        ))}
      </div>

      {/* Поле ввода скрываем во время демо, чтобы не мешало */}
      {mode==='free' && (
        <div style={{display:'flex', gap:8, marginTop:12}}>
          <input value={input} onChange={e=>setInput(e.target.value)}
                 onKeyDown={e=> e.key==='Enter' && input.trim() && send(input)}
                 className="chip" style={{flex:1}} placeholder="Введите сообщение..." />
          <button onClick={()=> input.trim() && send(input)} className="btn btn-primary">Отправить</button>
        </div>
      )}
    </div>
  );
}
