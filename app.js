/* Freseate · app de pedidos · Vibras Positivas HM */
(() => {
'use strict';

/* ================= CONFIG ================= */
const WA_ORDERS = '573108245744';          // WhatsApp de pedidos (catálogo)
const WA_ALT    = '573137753818';          // WhatsApp del volante
const TZ = 'America/Bogota';
const APP_URL = 'https://freseate.netlify.app/';

// Festivos de Colombia (verificados nov 2026). Formato YYYY-MM-DD
const FESTIVOS = {
  '2026-11-16':'Independencia de Cartagena','2026-12-08':'Inmaculada Concepción','2026-12-25':'Navidad',
  '2027-01-01':'Año Nuevo','2027-01-11':'Reyes Magos','2027-03-22':'San José','2027-03-25':'Jueves Santo','2027-03-26':'Viernes Santo',
  '2027-05-01':'Día del Trabajo','2027-05-10':'Ascensión','2027-05-31':'Corpus Christi','2027-06-07':'Sagrado Corazón',
  '2027-07-05':'San Pedro y San Pablo','2027-07-20':'Independencia','2027-08-07':'Batalla de Boyacá','2027-08-16':'Asunción',
  '2027-10-18':'Día de la Raza','2027-11-01':'Todos los Santos','2027-11-15':'Independencia de Cartagena',
  '2027-12-08':'Inmaculada Concepción','2027-12-25':'Navidad'
};

const TOPPINGS = {
  classic: [
    {id:'mani', es:'Maní', en:'Peanuts'},
    {id:'oreo', es:'Galleta Oreo', en:'Oreo cookie'},
    {id:'mm', es:"M&M's", en:"M&M's"},
    {id:'masmelos', es:'Masmelos', en:'Marshmallows'}
  ],
  premium: [
    {id:'queso', es:'Queso', en:'Cheese'},
    {id:'quipito', es:'Quipito', en:'Quipito popping candy'},
    {id:'leche', es:'Leche en polvo', en:'Powdered milk'},
    {id:'milo', es:'Milo', en:'Milo'}
  ]
};
const PRICE_C = 1500, PRICE_P = 2500;
const ALL_TOPS = [...TOPPINGS.classic.map(t=>({...t,type:'c',price:PRICE_C})), ...TOPPINGS.premium.map(t=>({...t,type:'p',price:PRICE_P}))];
const topById = id => ALL_TOPS.find(t=>t.id===id);

const PRODUCTS = [
  { id:'vaso-chocolate', cat:'vasos', cut:'img/cut-chocolate.webp', photo:'img/foto-chocolate.webp',
    tag:{es:'Vaso',en:'Cup'},
    name:{es:'Fresas, chocolate y crema', en:'Strawberries, chocolate & cream'},
    layers:{es:'Fresas · Chocolate · Crema', en:'Strawberries · Chocolate · Cream'},
    desc:{es:'Capas de fresa fresca, chocolate de fuente y crema suave. Una explosión de sabor.', en:'Layers of fresh strawberries, fountain chocolate and smooth cream. A flavor explosion.'},
    sizes:[{id:'12',label:'12 oz',price:13000,c:1,p:0},{id:'16',label:'16 oz',price:17500,c:1,p:1}] },
  { id:'vaso-arequipe', cat:'vasos', cut:'img/cut-arequipe.webp', photo:'img/foto-arequipe.webp',
    tag:{es:'Vaso',en:'Cup'},
    name:{es:'Fresas, arequipe y crema', en:'Strawberries, dulce de leche & cream'},
    layers:{es:'Fresas · Arequipe · Crema', en:'Strawberries · Dulce de leche · Cream'},
    desc:{es:'Fresas con crema y una suave capa de arequipe. El clásico que nunca falla.', en:'Strawberries and cream with a smooth layer of dulce de leche. The classic that never fails.'},
    sizes:[{id:'12',label:'12 oz',price:13000,c:1,p:0},{id:'16',label:'16 oz',price:17500,c:1,p:1}] },
  { id:'bowl', cat:'bowl', cut:'img/cut-bowl.webp', photo:'img/foto-bowl.webp',
    tag:{es:'Para compartir',en:'To share'},
    name:{es:'Bowl Tentación de chocolate', en:'Chocolate Temptation Bowl'},
    layers:{es:'Fresas · Crema · Chocolate', en:'Strawberries · Cream · Chocolate'},
    desc:{es:'Fresas enteras, crema con queso rallado, chocolate para untar y galletas de oblea.', en:'Whole strawberries, cream with grated cheese, dipping chocolate and wafer cookies.'},
    fixed:{es:'Incluye galleta (oblea) y queso', en:'Includes wafer cookie and cheese'},
    price:23000 },
  { id:'oblea', cat:'oblea', cut:'img/cut-oblea.webp', photo:'img/foto-oblea.webp',
    tag:{es:'Antojo rápido',en:'Quick treat'},
    name:{es:'Oblea Tentación', en:'Temptation Wafer'},
    layers:{es:'Fresas · Crema · Arequipe · Mora', en:'Strawberries · Cream · Dulce de leche · Blackberry'},
    desc:{es:'Oblea crujiente rellena de fresas, crema, arequipe y mora, con queso por encima.', en:'Crispy wafer filled with strawberries, cream, dulce de leche and blackberry, topped with cheese.'},
    fixed:{es:'Incluye topping de queso', en:'Includes cheese topping'},
    price:9000 }
];
const prodById = id => PRODUCTS.find(p=>p.id===id);

/* ================= I18N ================= */
const I18N = {
  es:{
    'nav.menu':'Menú','nav.toppings':'Toppings','nav.how':'Cómo pedir','cart.btn':'Pedido',
    'hero.kicker':'Fuente de chocolate · Medellín','hero.t1':'Fresas,','hero.t2':'chocolate','hero.t3':'y crema',
    'hero.lead':'Frescura, suavidad y el mejor chocolate en un solo lugar. Arma tu vaso a tu gusto y te lo llevamos a la puerta.',
    'hero.cta':'Armar mi pedido','hero.wa':'Escribir por WhatsApp','hero.b1':'vaso 12 oz','hero.b2':'vaso 16 oz','hero.b3a':'Sáb · Dom','hero.b3':'y festivos',
    'menu.kicker':'Nuestro menú','menu.title':'Escoge tu antojo',
    'tops.kicker':'Toppings','tops.title':'El toque final lo pones tú',
    'tops.rule':'Vaso 12 oz: incluye 1 topping clásico. Vaso 16 oz: incluye 1 clásico + 1 premium. ¿Quieres más? Agrégalos.',
    'tops.classic':'Clásicos','tops.premium':'Premium',
    'gal.kicker':'Así llega','gal.title':'Hecho al momento, con fresas frescas',
    'how.kicker':'Cómo pedir','how.title':'Tres pasos y listo',
    'how.s1':'Arma tu vaso','how.s1p':'Elige base, tamaño y toppings. El precio se calcula solo.',
    'how.s2':'Escoge el día','how.s2p':'Entregamos sábados, domingos y festivos. Puedes dejarlo apartado desde hoy.',
    'how.s3':'Envía por WhatsApp','how.s3p':'Tu pedido llega completo y ordenado. Te confirmamos valor del domicilio y pago.',
    'hist.kicker':'Tus antojos','hist.title':'Mis pedidos anteriores',
    'final.title':'¿Antojo de fresas?','final.p':'Síguenos en Instagram y comparte la app con quien se merezca un vaso.',
    'final.ig':'Ver Instagram @freseate.med','final.share':'Compartir la app','final.install':'Instalar en mi celular',
    'foot.wa':'Pedidos WhatsApp','foot.made':'App hecha por',
    'b.add':'Agregar','cart.title':'Tu pedido','cart.sub':'Subtotal productos',
    'cart.delivery':'El valor del domicilio se confirma por WhatsApp según tu barrio.',
    'f.title':'Datos de entrega','f.name':'Tu nombre','f.phone':'Celular','f.addr':'Dirección y barrio (Medellín / Valle de Aburrá)',
    'f.day':'Día de entrega','f.time':'Hora preferida','f.pay':'Forma de pago','f.gift':'Es un regalo (sorprende a alguien)',
    'f.giftTo':'¿Para quién?','f.giftMsg':'Mensaje para la tarjeta','f.notes':'Notas (opcional)',
    'f.send':'Enviar pedido por WhatsApp','f.legal':'Al enviar se abre WhatsApp con tu pedido listo. Solo toca enviar.',
    all:'Todos', vasos:'Vasos', bowl:'Bowl', oblea:'Oblea',
    from:'desde', build:'Armar', addFixed:'Agregar', size:'Tamaño', base:'Base', choco:'Chocolate', areq:'Arequipe',
    inclC:'Topping clásico incluido', inclP:'Topping premium incluido', pick:'elige 1', extras:'Adiciones', extrasHint:'opcional',
    included:'Incluido', viewOrder:'Ver pedido', empty:'Tu pedido está vacío. ¡Escoge un antojo!', remove:'Quitar',
    added:'Agregado a tu pedido', today:'Hoy', asap:'Lo antes posible', morning:'En la mañana', noon:'Al mediodía', afternoon:'En la tarde', evening:'En la noche',
    cash:'Efectivo contra entrega', transfer:'Transferencia (te enviamos los datos)',
    stOn:'Hoy hay domicilios en Medellín. ¡Pide ya!', stOnF:'Hoy es festivo ({f}): hay domicilios. ¡Pide ya!',
    stOff:'Hoy apartas tu pedido y te lo llevamos el {d}', colTime:'Hora Colombia',
    repeat:'Repetir', items:'productos', shareTxt:'Fresas con chocolate y crema a domicilio en Medellín. Arma tu vaso aquí:',
    copied:'Enlace copiado', sentOk:'¡Listo! Termina de enviar el pedido en WhatsApp', fillCart:'Agrega al menos un producto',
    holiday:'festivo', mqWords:['Fresas','Chocolate','Crema','Arequipe','Toppings','Domicilios','Medellín']
  },
  en:{
    'nav.menu':'Menu','nav.toppings':'Toppings','nav.how':'How to order','cart.btn':'Order',
    'hero.kicker':'Chocolate fountain · Medellín','hero.t1':'Strawberries,','hero.t2':'chocolate','hero.t3':'& cream',
    'hero.lead':'Freshness, smoothness and the best chocolate in one place. Build your cup your way and we bring it to your door.',
    'hero.cta':'Build my order','hero.wa':'Message on WhatsApp','hero.b1':'12 oz cup','hero.b2':'16 oz cup','hero.b3a':'Sat · Sun','hero.b3':'& holidays',
    'menu.kicker':'Our menu','menu.title':'Pick your craving',
    'tops.kicker':'Toppings','tops.title':'You add the finishing touch',
    'tops.rule':'12 oz cup: includes 1 classic topping. 16 oz cup: includes 1 classic + 1 premium. Want more? Add them.',
    'tops.classic':'Classic','tops.premium':'Premium',
    'gal.kicker':'How it arrives','gal.title':'Made to order, with fresh strawberries',
    'how.kicker':'How to order','how.title':'Three steps and done',
    'how.s1':'Build your cup','how.s1p':'Choose base, size and toppings. The price adds up automatically.',
    'how.s2':'Pick the day','how.s2p':'We deliver Saturdays, Sundays and holidays. You can book it from today.',
    'how.s3':'Send via WhatsApp','how.s3p':'Your order arrives complete and tidy. We confirm delivery fee and payment.',
    'hist.kicker':'Your treats','hist.title':'My previous orders',
    'final.title':'Craving strawberries?','final.p':'Follow us on Instagram and share the app with someone who deserves a cup.',
    'final.ig':'See Instagram @freseate.med','final.share':'Share the app','final.install':'Install on my phone',
    'foot.wa':'WhatsApp orders','foot.made':'App made by',
    'b.add':'Add','cart.title':'Your order','cart.sub':'Products subtotal',
    'cart.delivery':'Delivery fee is confirmed on WhatsApp depending on your neighborhood.',
    'f.title':'Delivery details','f.name':'Your name','f.phone':'Mobile','f.addr':'Address and neighborhood (Medellín area)',
    'f.day':'Delivery day','f.time':'Preferred time','f.pay':'Payment','f.gift':'It is a gift (surprise someone)',
    'f.giftTo':'Who is it for?','f.giftMsg':'Card message','f.notes':'Notes (optional)',
    'f.send':'Send order via WhatsApp','f.legal':'WhatsApp opens with your order ready. Just tap send.',
    all:'All', vasos:'Cups', bowl:'Bowl', oblea:'Wafer',
    from:'from', build:'Build', addFixed:'Add', size:'Size', base:'Base', choco:'Chocolate', areq:'Dulce de leche',
    inclC:'Included classic topping', inclP:'Included premium topping', pick:'pick 1', extras:'Extra toppings', extrasHint:'optional',
    included:'Included', viewOrder:'View order', empty:'Your order is empty. Pick a treat!', remove:'Remove',
    added:'Added to your order', today:'Today', asap:'As soon as possible', morning:'Morning', noon:'Midday', afternoon:'Afternoon', evening:'Evening',
    cash:'Cash on delivery', transfer:'Bank transfer (we send details)',
    stOn:'We deliver in Medellín today. Order now!', stOnF:'Today is a holiday ({f}): we deliver. Order now!',
    stOff:'Book today and we deliver on {d}', colTime:'Colombia time',
    repeat:'Repeat', items:'items', shareTxt:'Strawberries with chocolate and cream delivered in Medellín. Build your cup here:',
    copied:'Link copied', sentOk:'Done! Finish sending your order in WhatsApp', fillCart:'Add at least one product',
    holiday:'holiday', mqWords:['Strawberries','Chocolate','Cream','Dulce de leche','Toppings','Delivery','Medellín']
  }
};
let lang = localStorage.getItem('fr_lang') || 'es';
const t = k => (I18N[lang][k] ?? I18N.es[k] ?? k);
const L = o => (o ? (o[lang] ?? o.es) : '');

/* ================= HELPERS ================= */
const $ = s => document.querySelector(s);
const money = n => '$' + Math.round(n).toLocaleString('es-CO');
const store = {
  get(k,d){ try{ return JSON.parse(localStorage.getItem(k)) ?? d; }catch{ return d; } },
  set(k,v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch{} }
};
function bogotaParts(date = new Date()){
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(date).map(x=>[x.type,x.value]));
  return { y:+p.year, m:+p.month, d:+p.day, h:+p.hour % 24, min:+p.minute, key:`${p.year}-${p.month}-${p.day}` };
}
// Fecha al mediodía de Bogotá (17:00 UTC) para i días después de hoy
function dayFromToday(i){
  const b = bogotaParts();
  const dt = new Date(Date.UTC(b.y, b.m-1, b.d + i, 17));
  const key = dt.toISOString().slice(0,10);
  return { dt, key, dow: dt.getUTCDay(), festivo: FESTIVOS[key] || null };
}
const isDeliveryDay = d => d.dow === 0 || d.dow === 6 || !!d.festivo;
const fmtDay = (dt, opts={weekday:'long',day:'numeric',month:'long'}) =>
  new Intl.DateTimeFormat(lang==='en'?'en-US':'es-CO',{timeZone:TZ,...opts}).format(dt);
function deliveryDays(n=6){
  const out=[]; for(let i=0;i<60 && out.length<n;i++){ const d=dayFromToday(i); if(isDeliveryDay(d)) out.push({...d, i}); } return out;
}
function toast(msg){ const el=$('#toast'); el.textContent=msg; el.classList.add('show'); clearTimeout(toast._t); toast._t=setTimeout(()=>el.classList.remove('show'),2400); }

/* ================= STATE ================= */
let cart = store.get('fr_cart', []);
let filter = 'all';
let B = null; // builder state

/* ================= RENDER: static texts ================= */
function applyLang(){
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  $('#langBtn').textContent = lang === 'es' ? 'EN' : 'ES';
  $('#langBtn').setAttribute('aria-label', lang==='es' ? 'Switch to English' : 'Cambiar a español');
  // marquee
  const w = t('mqWords'); const html = [...w, ...w, ...w, ...w].map(x=>`<span>${x}</span>`).join('');
  $('#marquee').innerHTML = html;
  // toppings lists
  $('#listClassic').innerHTML = TOPPINGS.classic.map(x=>`<li>${L(x)}</li>`).join('');
  $('#listPremium').innerHTML = TOPPINGS.premium.map(x=>`<li>${L(x)}</li>`).join('');
  // selects
  $('#timeSel').innerHTML = ['asap','morning','noon','afternoon','evening'].map(k=>`<option value="${k}">${t(k)}</option>`).join('');
  $('#paySel').innerHTML = ['cash','transfer'].map(k=>`<option value="${k}">${t(k)}</option>`).join('');
  renderFilters(); renderGrid(); renderDays(); renderStatus(); renderCart(); renderHistory();
  $('#quickWa').href = `https://wa.me/${WA_ORDERS}?text=${encodeURIComponent(lang==='en'?'Hi Freseate! I would like to place an order.':'¡Hola Freseate! Quiero hacer un pedido.')}`;
}

function renderFilters(){
  const cats = ['all','vasos','bowl','oblea'];
  $('#filters').innerHTML = cats.map(c=>`<button data-f="${c}" class="${c===filter?'on':''}">${t(c)}</button>`).join('');
}
function renderGrid(){
  const list = PRODUCTS.filter(p => filter==='all' || p.cat===filter);
  $('#grid').innerHTML = list.map(p => {
    const price = p.sizes ? p.sizes[0].price : p.price;
    return `<article class="card" data-id="${p.id}">
      <div class="ph"><img src="${p.photo}" alt="${L(p.name)}" loading="lazy"><span class="tag">${L(p.tag)}</span></div>
      <div class="body">
        <span class="layers">${L(p.layers)}</span>
        <h3>${L(p.name)}</h3>
        <p>${L(p.desc)}</p>
        <div class="row">
          <div class="price">${p.sizes?`<small>${t('from')}</small>`:''}${money(price)}</div>
          <button class="add" data-open="${p.id}">${p.sizes?t('build'):t('addFixed')}</button>
        </div>
      </div></article>`;
  }).join('');
  observeCards();
}
let io;
function observeCards(){
  if(!('IntersectionObserver' in window)){ document.querySelectorAll('.card').forEach(c=>c.classList.add('in')); return; }
  io = io || new IntersectionObserver(es => es.forEach((e)=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} }), {threshold:.15});
  document.querySelectorAll('.card').forEach((c,i)=>{ c.style.transitionDelay = (i*80)+'ms'; io.observe(c); });
}

/* ================= STATUS ================= */
function renderStatus(){
  const today = dayFromToday(0);
  const el = $('#status'); const txt = $('#statusText');
  if(isDeliveryDay(today)){
    el.classList.remove('off');
    txt.textContent = today.festivo ? t('stOnF').replace('{f}', today.festivo) : t('stOn');
  } else {
    el.classList.add('off');
    const next = deliveryDays(1)[0];
    txt.textContent = t('stOff').replace('{d}', fmtDay(next.dt));
  }
  tickClock();
}
function tickClock(){
  const s = new Intl.DateTimeFormat(lang==='en'?'en-US':'es-CO',{timeZone:TZ,hour:'numeric',minute:'2-digit'}).format(new Date());
  $('#clock').textContent = `· ${s} ${t('colTime')}`;
}

/* ================= BUILDER ================= */
function openBuilder(id, preset){
  const p = prodById(id); if(!p) return;
  B = preset ? {...preset, extras:{...preset.extras}} : { pid:id, size: p.sizes ? p.sizes[p.sizes.length-1].id : null, inclC:null, inclP:null, extras:{}, qty:1 };
  if(p.sizes && !B.inclC) B.inclC = TOPPINGS.classic[0].id;
  renderBuilder();
  openSheet('#builder');
}
function curSize(){ const p=prodById(B.pid); return p.sizes ? p.sizes.find(s=>s.id===B.size) : null; }
function unitPrice(st){
  const p = prodById(st.pid); const s = p.sizes ? p.sizes.find(x=>x.id===st.size) : null;
  let n = s ? s.price : p.price;
  for(const [k,q] of Object.entries(st.extras||{})){ const tp=topById(k); if(tp) n += tp.price*q; }
  return n;
}
function renderBuilder(){
  const p = prodById(B.pid); const s = curSize();
  $('#bImg').src = p.cut; $('#bTag').textContent = L(p.layers); $('#bName').textContent = L(p.name); $('#bDesc').textContent = L(p.desc);
  let h = '';
  if(p.cat==='vasos'){
    h += `<div class="opt"><h4>${t('base')}</h4><div class="chips">
      <button class="chip ${B.pid==='vaso-chocolate'?'on':''}" data-base="vaso-chocolate">${t('choco')}</button>
      <button class="chip ${B.pid==='vaso-arequipe'?'on':''}" data-base="vaso-arequipe">${t('areq')}</button></div></div>`;
    h += `<div class="opt"><h4>${t('size')}</h4><div class="chips">` +
      p.sizes.map(z=>`<button class="chip ${z.id===B.size?'on':''}" data-size="${z.id}">${z.label}<small>${money(z.price)}</small></button>`).join('') + `</div></div>`;
    h += `<div class="opt"><h4>${t('inclC')} <small>${t('pick')}</small></h4><div class="chips">` +
      TOPPINGS.classic.map(x=>`<button class="chip ${x.id===B.inclC?'on':''}" data-ic="${x.id}">${L(x)}</button>`).join('') + `</div></div>`;
    if(s && s.p){
      if(!B.inclP) B.inclP = TOPPINGS.premium[0].id;
      h += `<div class="opt"><h4>${t('inclP')} <small>${t('pick')}</small></h4><div class="chips">` +
        TOPPINGS.premium.map(x=>`<button class="chip ${x.id===B.inclP?'on':''}" data-ip="${x.id}">${L(x)}</button>`).join('') + `</div></div>`;
    } else B.inclP = null;
  } else if(p.fixed){
    h += `<div class="opt"><h4>${t('included')}</h4><div class="chips"><span class="chip on">${L(p.fixed)}</span></div></div>`;
  }
  h += `<div class="opt"><h4>${t('extras')} <small>${t('extrasHint')}</small></h4>` +
    ALL_TOPS.map(x=>`<div class="extra"><span>${L(x)} <small class="muted">+${money(x.price)}</small></span>
      <div class="mini"><button data-ex="${x.id}" data-d="-1" aria-label="-">−</button><span>${B.extras[x.id]||0}</span><button data-ex="${x.id}" data-d="1" aria-label="+">+</button></div></div>`).join('') + `</div>`;
  $('#bBody').innerHTML = h;
  $('#qVal').textContent = B.qty;
  $('#bPrice').textContent = money(unitPrice(B) * B.qty);
}
$('#bBody').addEventListener('click', e => {
  const b = e.target.closest('button'); if(!b || !B) return;
  if(b.dataset.base){ B.pid = b.dataset.base; }
  else if(b.dataset.size){ B.size = b.dataset.size; }
  else if(b.dataset.ic){ B.inclC = b.dataset.ic; }
  else if(b.dataset.ip){ B.inclP = b.dataset.ip; }
  else if(b.dataset.ex){ const k=b.dataset.ex; B.extras[k] = Math.max(0, Math.min(9, (B.extras[k]||0) + (+b.dataset.d))); if(!B.extras[k]) delete B.extras[k]; }
  renderBuilder();
});
$('#qMinus').onclick = () => { B.qty = Math.max(1, B.qty-1); renderBuilder(); };
$('#qPlus').onclick  = () => { B.qty = Math.min(20, B.qty+1); renderBuilder(); };
$('#bAdd').onclick = () => {
  const item = { pid:B.pid, size:B.size, inclC:B.inclC, inclP:B.inclP, extras:B.extras, qty:B.qty };
  item.key = JSON.stringify([item.pid,item.size,item.inclC,item.inclP,Object.entries(item.extras).sort()]);
  const ex = cart.find(c=>c.key===item.key);
  if(ex) ex.qty = Math.min(50, ex.qty + item.qty); else cart.push(item);
  saveCart(); closeSheets(); toast(t('added'));
  const cb=$('#cartBtn'); cb.classList.remove('bump'); void cb.offsetWidth; cb.classList.add('bump');
};

/* ================= CART ================= */
function saveCart(){ store.set('fr_cart', cart); renderCart(); }
function itemLabel(it){
  const p = prodById(it.pid); const s = p.sizes ? p.sizes.find(x=>x.id===it.size) : null;
  return L(p.name) + (s ? ` ${s.label}` : '');
}
function itemDetail(it, lg){
  const LL = o => o[lg] ?? o.es; const parts = [];
  const inc = [it.inclC, it.inclP].filter(Boolean).map(id=>LL(topById(id)));
  if(inc.length) parts.push((lg==='en'?'Toppings: ':'Toppings: ') + inc.join(' + '));
  const p = prodById(it.pid); if(p.fixed) parts.push(LL(p.fixed));
  const ex = Object.entries(it.extras||{}).map(([k,q])=>`${LL(topById(k))} x${q}`);
  if(ex.length) parts.push((lg==='en'?'Extras: ':'Adiciones: ') + ex.join(', '));
  return parts;
}
const cartTotal = () => cart.reduce((a,it)=>a + unitPrice(it)*it.qty, 0);
const cartCount = () => cart.reduce((a,it)=>a + it.qty, 0);
function renderCart(){
  const n = cartCount(), tot = cartTotal();
  $('#cartCount').textContent = n;
  $('#cartSub').textContent = money(tot); $('#sendTotal').textContent = money(tot);
  $('#fab').hidden = n === 0; $('#fabText').textContent = `${t('viewOrder')} (${n})`; $('#fabTotal').textContent = money(tot);
  if(!cart.length){
    $('#cartItems').innerHTML = `<div class="empty"><img src="img/cut-chocolate.webp" alt="">${t('empty')}</div>`; return;
  }
  $('#cartItems').innerHTML = cart.map((it,i)=>`<div class="ci">
    <img src="${prodById(it.pid).cut}" alt="">
    <div class="info"><b>${itemLabel(it)}</b>${itemDetail(it, lang).map(x=>`<small>${x}</small>`).join('')}
      <div class="mini" style="margin-top:6px"><button data-ci="${i}" data-d="-1">−</button><span>${it.qty}</span><button data-ci="${i}" data-d="1">+</button>
      <button class="rm" data-rm="${i}">${t('remove')}</button></div></div>
    <div class="pr">${money(unitPrice(it)*it.qty)}</div></div>`).join('');
}
$('#cartItems').addEventListener('click', e => {
  const b = e.target.closest('button'); if(!b) return;
  if(b.dataset.rm){ cart.splice(+b.dataset.rm,1); }
  else if(b.dataset.ci){ const it=cart[+b.dataset.ci]; it.qty += +b.dataset.d; if(it.qty<1) cart.splice(+b.dataset.ci,1); }
  saveCart();
});
function renderDays(){
  const sel = $('#daySel'); const prev = sel.value;
  sel.innerHTML = deliveryDays(6).map(d => {
    const label = (d.i===0 ? t('today')+' · ' : '') + fmtDay(d.dt) + (d.festivo ? ` (${t('holiday')})` : '');
    const es = new Intl.DateTimeFormat('es-CO',{timeZone:TZ,weekday:'long',day:'numeric',month:'long'}).format(d.dt);
    return `<option value="${d.key}" data-label="${es}${d.festivo?' (festivo '+d.festivo+')':''}">${label}</option>`;
  }).join('');
  if(prev) sel.value = prev;
}

/* ================= ORDER → WHATSAPP ================= */
const form = $('#orderForm');
const saved = store.get('fr_client', {});
['nombre','cel','dir'].forEach(k => { if(saved[k]) form.elements[k].value = saved[k]; });
$('#giftChk').onchange = e => { $('#giftBox').hidden = !e.target.checked; };

form.addEventListener('submit', e => {
  e.preventDefault();
  if(!cart.length){ toast(t('fillCart')); return; }
  const f = Object.fromEntries(new FormData(form));
  store.set('fr_client', {nombre:f.nombre, cel:f.cel, dir:f.dir});
  const now = new Date(); const b = bogotaParts(now);
  const id = `FRE-${String(b.m).padStart(2,'0')}${String(b.d).padStart(2,'0')}-${Math.floor(100+Math.random()*900)}`;
  const when = new Intl.DateTimeFormat('es-CO',{timeZone:TZ,weekday:'long',day:'numeric',month:'long',hour:'numeric',minute:'2-digit'}).format(now);
  const dayOpt = $('#daySel').selectedOptions[0];
  const horas = {asap:'Lo antes posible',morning:'En la mañana',noon:'Al mediodía',afternoon:'En la tarde',evening:'En la noche'};
  const pagos = {cash:'Efectivo contra entrega',transfer:'Transferencia'};
  const lines = [];
  lines.push(`*NUEVO PEDIDO FRESEATE* ${id}`);
  lines.push(`_${when} (hora Colombia)_`, '');
  cart.forEach((it,i) => {
    const p = prodById(it.pid); const s = p.sizes ? p.sizes.find(x=>x.id===it.size) : null;
    lines.push(`*${i+1}. ${it.qty} x ${p.name.es}${s?' '+s.label:''}* — ${money(unitPrice(it)*it.qty)}`);
    itemDetail(it,'es').forEach(d => lines.push(`   ${d}`));
  });
  lines.push('', `*Subtotal: ${money(cartTotal())}* (+ domicilio por confirmar)`, '');
  lines.push(`*Entrega:* ${dayOpt ? dayOpt.dataset.label : f.dia} · ${horas[f.hora]||''}`);
  lines.push(`*Nombre:* ${f.nombre}`, `*Celular:* ${f.cel}`, `*Dirección:* ${f.dir}`, `*Pago:* ${pagos[f.pago]||''}`);
  if(f.regalo){ lines.push(`*Es regalo para:* ${f.para||'-'}`); if(f.dedicatoria) lines.push(`*Tarjeta:* "${f.dedicatoria}"`); }
  if(f.notas) lines.push(`*Notas:* ${f.notas}`);
  if(lang==='en') lines.push('', '(Cliente usó la app en inglés)');
  lines.push('', 'Pedido hecho desde la app ' + APP_URL);
  const url = `https://wa.me/${WA_ORDERS}?text=${encodeURIComponent(lines.join('\n'))}`;

  const hist = store.get('fr_hist', []);
  hist.unshift({ id, at: now.toISOString(), items: cart, total: cartTotal() });
  store.set('fr_hist', hist.slice(0,10));
  window.open(url, '_blank');
  toast(t('sentOk'));
  cart = []; saveCart(); renderHistory(); closeSheets();
  form.elements.notas.value=''; form.elements.dedicatoria.value=''; form.elements.para.value=''; $('#giftChk').checked=false; $('#giftBox').hidden=true;
});

/* ================= HISTORY ================= */
function renderHistory(){
  const hist = store.get('fr_hist', []);
  $('#historial').hidden = !hist.length;
  $('#histList').innerHTML = hist.map((h,i) => `<div class="hist"><div><b>${h.id}</b>
    <small>${fmtDay(new Date(h.at),{weekday:'short',day:'numeric',month:'short'})} · ${h.items.reduce((a,x)=>a+x.qty,0)} ${t('items')} · ${money(h.total)}</small>
    <small>${h.items.map(itemLabel).join(' · ')}</small></div>
    <button data-rep="${i}">${t('repeat')}</button></div>`).join('');
}
$('#histList').addEventListener('click', e => {
  const b = e.target.closest('[data-rep]'); if(!b) return;
  const h = store.get('fr_hist', [])[+b.dataset.rep]; if(!h) return;
  h.items.forEach(it => { const ex = cart.find(c=>c.key===it.key); if(ex) ex.qty += it.qty; else cart.push({...it}); });
  saveCart(); openSheet('#cart');
});

/* ================= SHEETS ================= */
function openSheet(sel){ closeSheets(); const s=$(sel); s.classList.add('open'); s.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; }
function closeSheets(){ document.querySelectorAll('.sheet.open').forEach(s=>{ s.classList.remove('open'); s.setAttribute('aria-hidden','true'); }); document.body.style.overflow=''; }
document.addEventListener('click', e => {
  if(e.target.closest('[data-close]')) closeSheets();
  const op = e.target.closest('[data-open]'); if(op) openBuilder(op.dataset.open);
  const card = e.target.closest('.card .ph'); if(card) openBuilder(card.closest('.card').dataset.id);
  const fb = e.target.closest('[data-f]'); if(fb){ filter = fb.dataset.f; renderFilters(); renderGrid(); }
});
document.addEventListener('keydown', e => { if(e.key==='Escape') closeSheets(); });
$('#cartBtn').onclick = () => { renderDays(); openSheet('#cart'); };
$('#fab').onclick = () => { renderDays(); openSheet('#cart'); };
$('#langBtn').onclick = () => { lang = lang==='es'?'en':'es'; localStorage.setItem('fr_lang', lang); applyLang(); };

/* ================= SHARE / INSTALL ================= */
$('#shareBtn').onclick = async () => {
  const data = { title:'Freseate', text:t('shareTxt'), url:APP_URL };
  if(navigator.share){ try{ await navigator.share(data); }catch{} }
  else { window.open(`https://wa.me/?text=${encodeURIComponent(data.text+' '+data.url)}`, '_blank'); }
};
let deferred;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferred = e; $('#installBtn').hidden = false; });
$('#installBtn').onclick = async () => { if(!deferred) return; deferred.prompt(); await deferred.userChoice; deferred = null; $('#installBtn').hidden = true; };

/* ================= INIT ================= */
applyLang();
setInterval(tickClock, 30000);
document.addEventListener('visibilitychange', () => { if(!document.hidden){ renderStatus(); renderDays(); } });
// Abrir producto directo con ?p=bowl  (sirve para compartir un producto)
const qp = new URLSearchParams(location.search).get('p'); if(qp && prodById(qp)) setTimeout(()=>openBuilder(qp), 400);
if('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(()=>{}));
})();
