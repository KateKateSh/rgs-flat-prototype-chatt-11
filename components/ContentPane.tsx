'use client';
import { useEffect, useState } from 'react';
import { contentLibrary, type Card } from '@/lib/contentLibrary';

function Doughnut({ legend, title }:{ legend?:{name:string;value:number}[]; title:string }){
  const total = (legend||[]).reduce((s,i)=>s+i.value,0)||1; const C = 2*Math.PI*40;
  let offset = 0;
  return (
    <div className="card">
      <div style={{fontWeight:600, marginBottom:8}}>{title}</div>
      <svg viewBox="0 0 120 120" style={{width:160, height:160, display:'block', margin:'0 auto'}}>
        {(legend||[]).map((seg,i)=>{
          const len = C*(seg.value/total); const dash = `${len} ${C-len}`; const off = -offset; offset+=len;
          const colors = ['#00EEF5','#94a3b8','#e5e7eb','#0ea5e9','#10b981'];
          return <circle key={i} cx="60" cy="60" r="40" fill="none" strokeWidth="16" strokeDasharray={dash} strokeDashoffset={off} stroke={colors[i%colors.length]} />;
        })}
      </svg>
      <div className="text-muted" style={{fontSize:12, marginTop:8}}>
        {(legend||[]).map((l,i)=> <div key={i}>• {l.name} — {l.value}%</div>)}
      </div>
    </div>
  );
}

export default function ContentPane({ slot }:{ slot:string }){
  const [cards, setCards] = useState<Card[]>([]);
  useEffect(()=>{ setCards(contentLibrary[slot]||[]); },[slot]);

  return (
    <aside>
      <div className="text-muted" style={{fontSize:12, marginBottom:8}}>Релевантный контент</div>
      {(cards||[]).map((card, idx)=>{
        if(card.type==='stat') return (
          <div key={idx} className="card">
            <div style={{fontWeight:600, marginBottom:8}}>{card.title}</div>
            {/* @ts-ignore */}
            <div style={{fontSize:48, fontWeight:800, color:'var(--danger)'}}>{(card as any).value}</div>
          </div>
        );
        if(card.type==='kpi') return (
          <div key={idx} className="card">
            <div style={{fontWeight:600, marginBottom:2}}>{card.title}</div>
            {/* @ts-ignore */}
            <div style={{fontSize:22, fontWeight:800}}>{(card as any).value}</div>
            {/* @ts-ignore */}
            {(card as any).note && <div className="text-muted" style={{fontSize:12}}>{(card as any).note}</div>}
          </div>
        );
        if(card.type==='list' || card.type==='faq') return (
          <div key={idx} className="card">
            <div style={{fontWeight:600, marginBottom:8}}>{card.title}</div>
            {/* @ts-ignore */}
            <ul style={{paddingLeft:18, margin:0}} className="text-muted">{(card as any).items.map((x:string,i:number)=>(<li key={i} style={{margin:'4px 0'}}>{x}</li>))}</ul>
          </div>
        );
        if(card.type==='bar') return (
          <div key={idx} className="card">
            <div style={{fontWeight:600, marginBottom:8}}>{card.title}</div>
            <div style={{height:160, display:'flex', alignItems:'flex-end', gap:12}}>
              <div style={{flex:1, background:'rgba(255,90,82,0.9)', borderRadius:6, height:'80%'}} />
              <div style={{flex:1, background:'rgba(255,90,82,0.7)', borderRadius:6, height:'60%'}} />
              <div style={{flex:1, background:'rgba(255,90,82,0.5)', borderRadius:6, height:'40%'}} />
            </div>
          </div>
        );
        if(card.type==='doughnut') return <Doughnut key={idx} title={card.title} legend={'legend' in card ? card.legend: []} />;
        if(card.type==='cta') return (
          <div key={idx} className="card">
            <div style={{fontWeight:600, marginBottom:8}}>{card.title}</div>
            {/* @ts-ignore */}
            <button className="btn btn-primary" onClick={()=>window.location.hash='#chat'}>{(card as any).cta||'Оформить'}</button>
            {/* @ts-ignore */}
            {(card as any).note && <div className="text-muted" style={{fontSize:12, marginTop:4}}>{(card as any).note}</div>}
          </div>
        );
        if(card.type==='cross') return (
          <div key={idx} className="card">
            <div style={{fontWeight:600, marginBottom:8}}>{card.title}</div>
            {/* @ts-ignore */}
            <div style={{display:'grid', gridTemplateColumns:'repeat(3, minmax(0,1fr))', gap:12}}>{(card as any).items.map((i:any,k:number)=>(<a key={k} href={i.url||'#'} className="card" style={{padding:12}}><div style={{fontWeight:600, marginBottom:4}}>{i.name}</div><div className="text-muted" style={{fontSize:12}}>{i.desc||''}</div></a>))}</div>
          </div>
        );
        return null;
      })}
    </aside>
  );
}
