'use client';
import { useEffect, useRef, useState } from 'react';

export default function ChatPane({ onIntent }:{ onIntent:(i:string)=>void }){
  const [thread, setThread] = useState<{who:'bot'|'user'; text:string}[]>([]);
  const [input, setInput] = useState('');
  const viewRef = useRef<HTMLDivElement>(null);

  function add(text:string, who:'bot'|'user'='bot'){ setThread(t=>[...t,{who,text}]); }

  async function send(text:string){
    add(text,'user'); setInput('');
    const res = await fetch('/api/chat', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ messages: [ {role:'user', content:text} ] }) });
    const data = await res.json().catch(()=>({message:'Не удалось разобрать ответ', ui:{cards:[]}, intent:'faq_common'}));
    add(data.message||'');
    if(data.intent) onIntent(data.intent);
  }

  useEffect(()=>{ add('Я — виртуальный ассистент РГС. Подберу защиту и покажу примеры.'); },[]);
  useEffect(()=>{ viewRef.current?.scrollTo({top:99999, behavior:'smooth'}); },[thread]);

  const chips = [
    {label:'Оформить страховку', intent:'start_purchase'},
    {label:'У меня своя квартира', intent:'owner'},
    {label:'Я снимаю жильё', intent:'renter'},
    {label:'Залив', intent:'fear_flood'},
    {label:'Пожар', intent:'fear_fire'},
    {label:'Кража', intent:'fear_theft'},
    {label:'Ответственность (ГО)', intent:'liability'},
    {label:'Статистика', intent:'stats_overall'},
    {label:'Примеры выплат', intent:'cases'},
    {label:'Шаги оформления', intent:'steps'}
  ];

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
      <div style={{display:'flex', gap:8, flexWrap:'wrap', marginTop:12}}>
        {chips.map((c,i)=>(
          <button key={i} className="chip" onClick={()=>{ add(c.label,'user'); onIntent(c.intent); }}>{c.label}</button>
        ))}
      </div>
      <div style={{display:'flex', gap:8, marginTop:12}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=> e.key==='Enter' && input.trim() && send(input)} className="chip" style={{flex:1}} placeholder="Введите сообщение..." />
        <button onClick={()=> input.trim() && send(input)} className="btn btn-primary">Отправить</button>
      </div>
    </div>
  );
}
