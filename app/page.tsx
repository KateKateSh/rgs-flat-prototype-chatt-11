'use client';
import { useState } from 'react';
import ChatPane from '@/components/ChatPane';
import ContentPane from '@/components/ContentPane';

export default function Page(){
  const [slot, setSlot] = useState('owner_intro');
  const onIntent = (intent: string)=>{
    const map: Record<string,string> = {
      owner: 'owner_intro', renter: 'renter_intro', fear_flood:'fear_flood', fear_fire:'fear_fire',
      fear_theft:'fear_theft', liability:'liability_guide', steps:'steps', cases:'cases',
      checkout:'checkout', faq_common:'faq_common', stats_overall:'stats_overall', start_purchase:'steps'
    };
    setSlot(map[intent] || 'faq_common');
  };

  return (
    <div>
      <header className="header">
        <div className="container header-row">
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <div style={{width:32,height:32,background:'var(--rgs-primary)',borderRadius:6}}/>
            <div className="text-muted" style={{fontSize:14}}>RGS.Квартира · Страхование по подписке</div>
          </div>
          <a href="#chat" className="btn btn-primary">Страховой случай</a>
        </div>
      </header>

      <section className="container" style={{paddingTop:32,paddingBottom:16}}>
        <div className="grid grid-2" style={{alignItems:'center'}}>
          <div>
            <h1 style={{fontSize:40, fontWeight:800, lineHeight:1.1}}>Страхование квартиры <span style={{color:'var(--rgs-primary)'}}>по подписке</span></h1>
            <p className="text-muted" style={{marginTop:8}}>Оформление онлайн и без осмотра. Гибкие условия. Быстрые выплаты.</p>
            <div style={{display:'flex',gap:12,marginTop:16}}>
              <a href="#chat" className="btn btn-primary">Подключить защиту</a>
              <a href="#chat" className="btn btn-outline">Разобраться за 2 минуты</a>
            </div>
          </div>
          <div className="card" style={{height:220, display:'flex',alignItems:'center',justifyContent:'center'}}>
            <div style={{textAlign:'center'}}>
              <div style={{fontSize:56}}>🏠</div>
              <div className="text-muted" style={{fontSize:12}}>Визуальная заглушка</div>
            </div>
          </div>
        </div>
      </section>

      <main id="chat" className="container" style={{paddingBottom:64}}>
        <div className="grid grid-2">
          <ChatPane onIntent={onIntent}/>
          <div className="card"><ContentPane slot={slot}/></div>
        </div>
      </main>

      <footer style={{borderTop:'1px solid #e5e7eb', padding:'32px 0', textAlign:'center'}} className="text-muted">
        Прототип для исследования. Данные демонстрационные.
      </footer>
    </div>
  );
}
