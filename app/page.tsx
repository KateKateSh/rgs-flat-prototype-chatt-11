'use client';
import { useState } from 'react';
import Image from 'next/image';                 // ⬅️ импорт ДОЛЖЕН быть здесь, наверху
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
          {/* Левый столбец */}
          <div>
            <h1 style={{fontSize:40, fontWeight:800, lineHeight:1.1}}>
              Страхование квартиры <span style={{color:'var(--rgs-primary)'}}>по подписке</span>
            </h1>
            <p className="text-muted" style={{marginTop:8}}>
              Оформление онлайн и без осмотра. Гибкие условия. Быстрые выплаты.
            </p>
            <div style={{display:'flex',gap:12,marginTop:16}}>
              <a href="#chat" className="btn btn-primary">Подключить защиту</a>
              <a href="#chat" className="btn btn-outline">Разобраться за 2 минуты</a>
            </div>
          </div>

          {/* Правый столбец — баннер */}
          <div className="card" style={{overflow:'hidden', borderRadius:16, padding:0}}>
            <Image
              src="/flat-hero.png"
              alt="Квартира — 11 рисков на выбор. Настройте полис и платите, как удобно."
              width={1200}
              height={492}
              priority
              style={{width:'100%', height:'auto', display:'block'}}
            />
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
