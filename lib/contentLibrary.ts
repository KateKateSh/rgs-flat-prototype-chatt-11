// lib/contentLibrary.ts

export type Card =
  | { type: 'stat'; title: string; value: string }
  | { type: 'kpi'; title: string; value: string; note?: string }
  | { type: 'list' | 'faq'; title: string; items: string[] }
  | { type: 'bar' | 'doughnut'; title: string; legend?: { name: string; value: number }[]; palette?: string[] }
  | { type: 'image'; title: string; src: string; alt?: string }
  | { type: 'cta'; title: string; cta: string; note?: string }
  | { type: 'cross'; title: string; items: { name: string; desc?: string; url?: string }[] };

export const contentLibrary: Record<string, Card[]> = {
  // ===== Общий контент
  stats_overall: [
    { type: 'image', title: 'Топ причин обращений', src: '/clients-bars.png', alt: 'Залив 48%, Пожар 38%, ГО 28%, Кража 18%' },
    { type: 'kpi', title: 'Среднее время выплаты', value: '3–5 дней' },
    { type: 'cross', title: 'Дополнительно может пригодиться', items: [
      { name: 'RGS.Дом по подписке', desc: 'Для частного дома', url: 'https://rgs.online/house/' },
      { name: 'Страхование ипотеки', desc: 'Для заемщиков', url: 'https://rgs.online/mortgage/' },
      { name: 'Путешествия', desc: 'Защита в поездках', url: 'https://rgs.online/travel/' },
    ]},
  ],

  // ===== Арендаторы
  renter_intro: [
    { type: 'image', title: 'Что важно знать арендатору', src: '/renter-donut.png', alt: '41% не знали, что можно страховать съемное жилье; 37% считали, что это обязанность собственника; 22% не задумывались' },
    { type: 'list',  title: 'Что можно защитить', items: ['Личные вещи', 'Ответственность перед соседями', 'Непредсказуемые поломки техники'] },
    { type: 'cta',   title: 'Готовы подобрать тариф?', cta: 'Начать', note: '2–5 минут, без осмотра' },
  ],

  // ===== Залив / Потоп
  fear_flood: [
    { type: 'doughnut', title: 'Распределение случаев (пример)', legend: [
      { name: 'Залив', value: 60 }, { name: 'Пожар', value: 25 }, { name: 'Кража', value: 10 }, { name: 'ГО', value: 5 }
    ]},
    { type: 'kpi',  title: 'Средняя выплата по РГС', value: '210 000 ₽' },
    { type: 'list', title: 'Покрывается при заливе', items: ['Ремонт отделки и мебели', 'Компенсации соседям', 'Быстрая выплата на карту'] },
    { type: 'cross', title: 'Что ещё может быть полезно', items: [
      { name: 'Гаджеты', desc: 'Защита электроники', url: 'https://rgs.online/' },
      { name: 'Гражданская ответственность', desc: 'Отдельный полис ГО', url: 'https://rgs.online/' },
    ]},
  ],

  // ===== Пожар (оранжево-красная палитра)
  fear_fire: [
    { type: 'doughnut', title: 'Доля пожаров в убытках', legend: [
      { name: 'Пожар', value: 25 }, { name: 'Прочие', value: 75 }
    ], palette: ['#FF6B4A','#FFD0C7'] },
    { type: 'kpi',  title: 'Средний убыток без страховки', value: '100–300 тыс. ₽' },
    { type: 'kpi',  title: 'Среднее время выплаты', value: '3–5 дней', note: 'при корректных документах' },
    { type: 'list', title: 'Что покрывается при пожаре', items: ['Отделка/мебель', 'Вред соседям (ГО)', 'Последствия пожаротушения'] },
    { type: 'cross', title: 'Кросс-селл RGS', items: [
      { name: 'RGS.Дом по подписке', desc: 'Для частного дома', url: 'https://rgs.online/house/' },
      { name: 'Имущество+', desc: 'Расширенные риски', url: 'https://rgs.online/' },
    ]},
  ],

  // ===== Кража
  fear_theft: [
    { type: 'list', title: 'Кража со взломом: покрывается', items: ['Похищенные вещи', 'Повреждение дверей/замков', 'Следы проникновения'] },
    { type: 'kpi',  title: 'Среднее время выплаты', value: '3–5 дней' },
    { type: 'cross', title: 'Рекомендуем также', items: [
      { name: 'Гаджеты+', desc: 'Расширенная защита техники', url: 'https://rgs.online/' },
      { name: 'Страхование карт', desc: 'Финансовая защита', url: 'https://rgs.online/' },
    ]},
  ],

  // ===== ГО (ответственность перед соседями)
  liability_guide: [
    { type: 'list', title: 'ГО — ущерб соседям', items: ['Залив/пожар у соседей', 'Юр.помощь', 'Часто самая дорогая часть'] },
    { type: 'stat', title: 'Средняя выплата по ГО', value: '210 000 ₽' },
    { type: 'cross', title: 'Связанные продукты', items: [
      { name: 'ГО отдельно', desc: 'Самостоятельный полис ГО', url: 'https://rgs.online/' },
      { name: 'Имущество+', desc: 'Расширенные риски', url: 'https://rgs.online/' },
    ]},
  ],

  // ===== Общие/существующие
  owner_intro: [
    { type: 'stat', title: 'Каждый 10-й обращается за выплатой в первый год', value: '10%+' },
    { type: 'list', title: 'Чаще всего — из-за воды', items: ['затопили соседи','потекла сантехника','прорвало трубу'] }
  ],

  faq_common: [
    { type: 'faq', title: 'Частые вопросы', items: ['Период ожидания?', 'Можно ли страховать аренду?', 'Скорость выплат?', 'Можно менять суммы?'] },
    { type: 'kpi', title: 'Среднее время выплаты по всем рискам', value: '3–5 дней' }
  ],

  cases: [
    { type: 'list', title: 'Реальные выплаты', items: ['12 900 ₽/год → залив → 115 000 ₽', 'Пожар от электрики → 250 000 ₽ (полис 3 500 ₽)'] },
    { type: 'stat', title: '49% переживали ЧП', value: '49%' }
  ],

  steps: [
    { type: 'list', title: 'Оформление (2–5 минут)', items: ['Адрес', 'Телефон + СМС', 'Риски', 'Суммы покрытия', 'Оплата, e-mail'] },
    { type: 'cta', title: 'Готовы оформить?', cta: 'Перейти к шагам', note: 'Без осмотра' }
  ],

  checkout: [
    { type: 'cta', title: 'Готовы оформить?', cta: 'Быстрая покупка', note: 'Без осмотра. 2–5 минут.' },
    { type: 'cross', title: 'Кросс-селл', items: [
      { name: 'Дом по подписке', desc: 'Защита дома', url: 'https://rgs.online/house/' },
      { name: 'Ипотека', desc: 'Для банка', url: 'https://rgs.online/mortgage/' },
      { name: 'Здоровье/Путешествия', desc: 'Другие продукты', url: 'https://rgs.online/travel/' }
    ]}
  ]
};
