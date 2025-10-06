export const runtime = 'edge';

const USE_LLM = false; // ⬅️ false = без LLM, true = DeepSeek

const SYSTEM_PROMPT = `Ты — виртуальный ассистент РГС. Отвечай коротко, дружелюбно, без жаргона.`;

function localRouter(text: string){
  const t = (text||'').toLowerCase();
  const resp = (intent: string, message: string, cards: any[] = []) => ({ message, ui: { cards }, intent });
  if(/оформ|купить|подключ/.test(t)) return resp('start_purchase', 'Начнём оформление. Понадобится адрес, контакты, риски и суммы покрытия. Это займёт 2–5 минут.', [{type:'cta', title:'Начнём оформление', cta:'Продолжить', note:'2–5 минут'}]);
  if(/сним|аренд/.test(t)) return resp('renter', 'Арендованное жильё тоже можно застраховать. Личные вещи и ответственность — доступны.');
  if(/своя|собствен/.test(t)) return resp('owner', 'Своя квартира — это вложения. Расскажу, как защититься без переплат.');
  if(/затоп|залив|вод/.test(t)) return resp('fear_flood', 'Затопления — самые частые случаи. Покрытие включает ремонт и компенсации соседям.');
  if(/пожар|огорел|огн/.test(t)) return resp('fear_fire', 'Пожар — один из самых разрушительных рисков. Последствия можно закрыть покрытием.');
  if(/краж|вор|взлом/.test(t)) return resp('fear_theft', 'Кража со взломом — про вещи и повреждения при проникновении. Расскажу, что покрывается.');
  if(/го|ответствен|сосед/.test(t)) return resp('liability', 'ГО — когда нужно компенсировать ущерб соседям. Часто это самая затратная часть.');
  if(/шаг|как офор|порядок/.test(t)) return resp('steps', 'Покажу, как проходит оформление — быстро и без лишних шагов.');
  if(/пример|кейс|выплат/.test(t)) return resp('cases', 'Примеры из практики — это помогает принять решение.');
  if(/статист|цифр|процент/.test(t)) return resp('stats_overall', 'Коротко по цифрам: структура рисков и среднее время выплаты.');
  if(/faq|вопрос|сколько|когда|почему/.test(t)) return resp('faq_common', 'Собрал ответы на частые вопросы.');
  return resp('faq_common', 'Подскажу по условиям и рискам. Выберите тему или напишите свой вопрос.');
}

export async function POST(req: Request) {
  const body = await req.json().catch(()=>({}));
  const messages = (body as any)?.messages ?? [];
  const lastUser = messages.filter((m: any)=>m.role==='user').slice(-1)[0]?.content || '';

  if(!USE_LLM){
    const data = localRouter(lastUser);
    return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
  }

  const payload = {
    model: 'deepseek-chat',
    messages: [ { role: 'system', content: SYSTEM_PROMPT }, ...messages ],
    temperature: 0.2,
    stream: false,
    response_format: { type: 'json_object' }
  };

  const resp = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify(payload)
  });

  if (!resp.ok) {
    const data = localRouter(lastUser);
    return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
  }

  const data = await resp.json();
  const content = data?.choices?.[0]?.message?.content ?? '{}';
  return new Response(content, { headers: { 'Content-Type': 'application/json' } });
}
