export type Card =
  | { type: 'stat'; title: string; value: string }
  | { type: 'kpi'; title: string; value: string; note?: string }
  | { type: 'list' | 'faq'; title: string; items: string[] }
  | { type: 'bar' | 'doughnut'; title: string; legend?: { name: string; value: number }[] }
  | { type: 'cta'; title: string; cta: string; note?: string }
  | { type: 'cross'; title: string; items: { name: string; desc?: string; url?: string }[] };

export const contentLibrary: Record<string, Card[]> = {
  owner_intro: [
    { type: 'stat', title: 'Каждый 10-й обращается за выплатой в первый год', value: '10%+' },
    { type: 'list', title: 'Чаще всего — из-за воды', items: ['затопили соседи','потекла сантехника','прорвало трубу'] }
  ],
  renter_intro: [
    { type: 'doughnut', title: 'Что важно знать арендатору', legend: [
      { name: 'Не знал про страховку', value: 41 },
      { name: 'Думал, что страхует только собственник', value: 37 },
      { name: 'Не задумывался', value: 22 },
    ]},
    { type: 'list', title: 'Что можно защитить', items: ['Личные вещи','Ответственность перед соседями','Поломки техники'] }
  ],
  fear_flood: [
    { type: 'doughnut', title: 'Структура случаев', legend: [ { name: 'Залив', value: 60 }, { name: 'Пожар', value: 25 }, { name: 'Кража', value: 10 }, { name: 'ГО', value: 5 } ] },
    { type: 'stat', title: 'Средняя выплата по РГС', value: '210 000 ₽' },
    { type: 'faq', title: 'Что покрывается', items: ['Ремонт и мебель','Ответственность перед соседями','Быстрая выплата на карту'] }
  ],
  fear_fire: [
    { type: 'doughnut', title: 'Доля пожаров в убытках', legend: [ { name: 'Пожар', value: 25 }, { name: 'Прочие', value: 75 } ] },
    { type: 'kpi', title: 'Средний убыток без страховки', value: '100–300 тыс. ₽' },
    { type: 'kpi', title: 'Среднее время выплаты', value: '3–5 дней', note: 'при корректных документах' }
  ],
  fear_theft: [
    { type: 'list', title: 'Кража: что покрывается', items: ['Взлом и проникновение','Похищение техники/ценного','Повреждение замков/дверей'] },
    { type: 'kpi', title: 'Среднее время выплаты', value: '3–5 дней' }
  ],
  liability_guide: [
    { type: 'list', title: 'ГО — ущерб соседям', items: ['Покрытие залива/пожара','Юридическая защита','Часто самая дорогая часть'] },
    { type: 'stat', title: 'Средняя выплата по ГО', value: '210 000 ₽' }
  ],
  faq_common: [
    { type: 'faq', title: 'Частые вопросы', items: ['Период ожидания?','Можно ли страховать аренду?','Скорость выплат?','Можно менять суммы?'] },
    { type: 'kpi', title: 'Среднее время выплаты по всем рискам', value: '3–5 дней' }
  ],
  cases: [
    { type: 'list', title: 'Реальные выплаты', items: ['12 900 ₽/год → залив → 115 000 ₽','Пожар от электрики → 250 000 ₽ (полис 3 500 ₽)'] },
    { type: 'stat', title: '49% переживали ЧП', value: '49%' }
  ],
  steps: [
    { type: 'list', title: 'Оформление (2–5 минут)', items: ['Адрес','Телефон + СМС','Риски','Суммы покрытия','Оплата, e‑mail'] }
  ],
  checkout: [
    { type: 'cta', title: 'Готовы оформить?', cta: 'Быстрая покупка', note: 'Без осмотра. 2–5 минут.' },
    { type: 'cross', title: 'Кросс‑селл', items: [
      { name: 'Дом по подписке', desc: 'Защита дома', url: '#' },
      { name: 'Ипотека', desc: 'Для банка', url: '#' },
      { name: 'Здоровье/Путешествия', desc: 'Другие продукты', url: '#' }
    ]}
  ],
  stats_overall: [
    { type: 'doughnut', title: 'Структура убытков', legend: [ { name: 'Залив', value: 60 }, { name: 'Пожар', value: 25 }, { name: 'Кража', value: 10 }, { name: 'ГО', value: 5 } ] },
    { type: 'kpi', title: 'Среднее время выплаты', value: '3–5 дней' }
  ]
};
