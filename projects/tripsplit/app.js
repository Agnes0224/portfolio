/* Presentation only. No product API, financial mutation, or model calls. */
const members = '<span>我</span><span>张明</span><span>李娜</span><span>王磊</span>';
const field = (name, value, kind = '') => `<div class="mock-field ${kind}"><label>${name}</label><div>${value}</div></div>`;
const tags = `<span class="mock-members">${members}</span>`;
const appHead = '<div class="mock-app-head"><span class="mock-logo">T</span><b>厦门仲夏之旅</b><span>···</span></div>';
const form = (filled, missing = false, changed = false) => `<div class="mock-form">${field('消费', filled ? '沙县小吃' : '<span class="placeholder">填写消费名称</span>')}${field('金额', filled ? (changed ? '¥132.00' : '¥128.00') : '<span class="placeholder">¥ 输入金额</span>', changed ? 'changed' : '')}${field('付款人', filled ? '我' : '<span class="placeholder">选择付款人 ▾</span>')}${field('参与人', filled && !missing ? tags : '<span class="placeholder">选择参与成员 ▾</span>', missing ? 'missing' : '')}<div class="mock-split"><span>分摊方式</span><b>均分 ▾</b></div></div>`;
const smallReceipt = `<div class="small-receipt"><div><span class="posted-chip">已入账</span><strong>¥128.00</strong></div><b>沙县小吃</b><p>我付款 · 四人均分</p><div class="receipt-links"><span>引用修改 ↶</span><span>修改账目 ↗</span></div></div>`;
const phases = {
  start: {
    title: '记录沙县小吃 128 元，我付款，四人均分。',
    screens: [
      { title: '传统表单', subtitle: '先组织字段', body: `<h5>记一笔消费</h5>${form(false)}<span class="mock-save">保存账目</span>`, note: '对象与字段一目了然，也先呈现出填写任务。' },
      { title: 'AI 自动填表', subtitle: '表达后填入表单', body: '<div class="ai-input"><span>✦ AI 识别</span><p>描述消费，或上传支付截图…</p><div>＋ 添加凭证 <span>识别 →</span></div></div><p class="mock-hint">识别后填入下方字段</p>' + form(false), note: 'AI 减少手输；结果与后续操作仍围绕字段组织。' },
      { title: 'Chat First', subtitle: '先说发生了什么', body: '<div class="chat-empty"><span class="mock-logo">T</span><h5>刚刚发生了什么消费？</h5><p>说一句，或发张支付截图。</p></div><div class="mock-composer"><span>＋</span><span>说一笔消费…</span><b>↑</b></div>', note: '优先营造“随手发消息”的感受，再逐步形成账目。' },
    ],
  },
  complete: {
    title: '已提供“沙县小吃128元，我付的”，还需要补充参与人。',
    screens: [
      { title: '传统表单', subtitle: '定位缺失字段', body: '<h5>沙县小吃 · 待补充</h5>' + form(true, true) + '<div class="inline-question">选择哪些人参与分摊？</div>', note: '在字段所在位置补充，缺什么与已有值可同时检查。' },
      { title: 'AI 自动填表', subtitle: '保留识别结果，提示补充', body: '<div class="source-text">“沙县小吃128元，我付的。”</div>' + form(true, true) + '<div class="inline-question">还需参与人，可选择或继续描述。</div>', note: '也能智能补问，不必丢弃表单或重新识别整笔。' },
      { title: 'Chat First', subtitle: '在当前消费里继续说', body: '<div class="mock-message user-message">沙县小吃128元，我付的。</div><div class="mock-message assistant-message">哪些成员参与分摊？<small>已保留：128元 · 我付款</small></div><div class="mock-message user-message">四个人均分。</div>' + smallReceipt, note: '补充与原输入在同一任务上下文中，但仍要检查最终结果。' },
    ],
  },
  change: {
    title: '把刚刚记录的“沙县小吃”从 128 元改为 132 元。',
    screens: [
      { title: '传统表单', subtitle: '选中对象，精确编辑', body: '<div class="object-strip">当前编辑：沙县小吃</div>' + form(true, false, true) + '<span class="mock-save">保存修改</span>', note: '金额字段稳定、对象清楚，适合直接精确修改。' },
      { title: 'AI 自动填表', subtitle: '围绕表单对象继续操作', body: '<div class="object-strip">当前对象：沙县小吃</div><div class="ai-amend">✦ 也可描述：“金额改成132元”</div>' + form(true, false, true), note: '可用字段，也可接自然语言；关键是绑定当前账目对象。' },
      { title: 'Chat First', subtitle: '引用对象后连续表达', body: smallReceipt + '<div class="mock-quote"><small>正在引用</small><b>沙县小吃 · ¥128.00</b></div><div class="mock-message user-message">金额改成132元。</div><div class="mock-message assistant-message">已修改为 ¥132.00<small>我付款 · 四人各承担 ¥33.00</small></div>', note: '轻量调整可以继续说；引用提示补偿“到底改哪笔”的风险。' },
    ],
  },
};

let activeScheme = 2;
function renderScheme(value) {
  activeScheme = Number(value);
  document.querySelectorAll('[data-scheme]').forEach(button => {
    const selected = Number(button.dataset.scheme) === activeScheme;
    button.setAttribute('aria-selected', String(selected));
    button.tabIndex = selected ? 0 : -1;
  });
  document.querySelectorAll('.comparison-option').forEach((option, index) => {
    option.classList.toggle('scheme-active', index === activeScheme);
  });
}

function renderPhase(key) {
  const phase = phases[key];
  document.querySelector('#task-title').textContent = phase.title;
  document.querySelector('#comparison-screens').setAttribute('aria-labelledby', `tab-${key}`);
  document.querySelector('#comparison-screens').innerHTML = phase.screens.map((screen, i) => `<article id="scheme-${i}" class="comparison-option ${i === 2 ? 'selected-option' : ''}"><div class="option-title"><span>${String.fromCharCode(65 + i)}</span><div><h4>${screen.title}</h4><p>${screen.subtitle}</p></div>${i === 2 ? '<b class="chosen-label">当时选用</b>' : ''}</div><div class="comparison-app ${key}">${appHead}<div class="mock-app-body">${screen.body}</div></div><p class="screen-comment">${screen.note}</p></article>`).join('');
  document.querySelectorAll('[data-phase]').forEach(button => {
    const selected = button.dataset.phase === key;
    button.setAttribute('aria-selected', String(selected));
    button.tabIndex = selected ? 0 : -1;
  });
  renderScheme(activeScheme);
}
const evidence = {
  history: '<div class="evidence-document"><span class="source-badge">有效修改历史 / B</span><strong>现有修改历史无法解释付款人差异</strong><p>关联来源仍不足以判断两笔是否同源。</p></div>',
  sources: '<div class="evidence-source-pair"><div><span class="source-badge">来源 A</span><strong>火锅240元，小李付的。</strong></div><div><span class="source-badge">来源 B</span><strong>聚餐240元，小王付的。</strong></div></div>',
};
function renderEvidence(key) {
  document.querySelector('#evidence-content').innerHTML = evidence[key];
  document.querySelector('#evidence-content').setAttribute('aria-labelledby', `tab-${key}`);
  document.querySelectorAll('[data-evidence]').forEach(button => {
    const selected = button.dataset.evidence === key;
    button.setAttribute('aria-selected', String(selected));
    button.tabIndex = selected ? 0 : -1;
  });
}
function setupTabs(selector, attribute, render) {
  const tabs = [...document.querySelectorAll(selector)];
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => render(tab.dataset[attribute]));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next == null) return;
      event.preventDefault();
      tabs[next].focus();
      render(tabs[next].dataset[attribute]);
    });
  });
}
setupTabs('[data-phase]', 'phase', renderPhase);
setupTabs('[data-scheme]', 'scheme', renderScheme);
setupTabs('[data-evidence]', 'evidence', renderEvidence);
const entryStates = {
  pending: {status: 'Pending · 待补全', title: '消费已保存，账目尚未成立', people: '参与人未明确', source: '保留金额 ¥60 与付款人“我”', action: '在 Ledger 中找到记录，稍后补充参与人', total: 53400, posted: false},
  defaults: {status: '已入账', title: '适用用户预设，校验后记录', people: '我、张明、王磊 · 各 ¥20.00', source: '参与人已采用旅行默认设置', action: '回执展示实际默认字段，可查看或修改', total: 59400, posted: true},
  completed: {status: '已入账', title: '补全后重新校验，形成正式账目', people: '我、张明、王磊 · 各 ¥20.00', source: '用户补充：“我们三人参加，李娜没去。”', action: '保留原输入与补充信息，不重复创建账目', total: 59400, posted: true},
};
function renderEntry(key) {
  const state = entryStates[key];
  const result = document.querySelector('#entry-result');
  result.dataset.state = key;
  result.dataset.totalCents = String(state.total);
  result.classList.toggle('entry-posted', state.posted);
  result.setAttribute('aria-labelledby', `entry-tab-${key}`);
  result.innerHTML = `<div class="entry-status-line"><span>${state.status}</span><small>${state.posted ? '参与正式财务计算' : '不参与余额、分摊与结算'}</small></div><h4>${state.title}</h4><div class="entry-expense-preview"><div><strong>打车</strong><b>¥60.00</b></div><p>付款人：我</p><p>${state.people}</p><small>${state.source}</small></div><div class="entry-ledger-total"><span>旅行正式支出</span><strong>¥${(state.total / 100).toFixed(2)}</strong><small>${state.posted ? '原正式支出 ¥534 ＋ 本笔 ¥60' : '本笔 ¥60 暂不计入'}</small></div><p class="entry-next-action">${state.action}</p>`;
  document.querySelectorAll('[data-entry]').forEach(button => {
    const selected = button.dataset.entry === key;
    button.setAttribute('aria-selected', String(selected));
    button.tabIndex = selected ? 0 : -1;
  });
}
setupTabs('[data-entry]', 'entry', renderEntry);
renderPhase('start');
renderEvidence('history');
renderEntry('pending');

const viewer = document.querySelector('#image-viewer');
let zoomTrigger;
document.querySelectorAll('[data-zoom]').forEach(button => button.addEventListener('click', () => {
  zoomTrigger = button;
  const image = viewer.querySelector('img');
  image.src = button.dataset.zoom;
  image.alt = button.querySelector('img').alt;
  viewer.querySelector('#image-caption').textContent = button.dataset.caption;
  viewer.querySelector('.viewer-content').classList.toggle('phone-view', button.dataset.zoom.includes('-clean'));
  viewer.showModal();
  viewer.querySelector('.viewer-content').scrollTop = 0;
  document.body.classList.add('viewer-open');
}));
viewer.querySelector('.viewer-close').addEventListener('click', () => viewer.close());
viewer.addEventListener('click', event => { if (event.target === viewer) viewer.close(); });
viewer.addEventListener('close', () => { document.body.classList.remove('viewer-open'); zoomTrigger?.focus({ preventScroll: true }); });
const nav = [...document.querySelectorAll('header nav a')];
const sections = nav.map(link => document.querySelector(link.hash));
const setNav = () => {
  const atBottom = scrollY > 0 && scrollY + innerHeight >= document.documentElement.scrollHeight - 3;
  const current = atBottom ? sections.at(-1) : [...sections].reverse().find(section => section.getBoundingClientRect().top < 180) || sections[0];
  nav.forEach(link => {
    if (link.hash === `#${current.id}`) {
      if (!link.hasAttribute('aria-current')) {
        link.setAttribute('aria-current', 'true');
        const container = link.parentElement;
        const box = link.getBoundingClientRect(), frame = container.getBoundingClientRect();
        if (box.left < frame.left || box.right > frame.right) container.scrollLeft += box.left - frame.left - 12;
      }
    } else link.removeAttribute('aria-current');
  });
};
let queued;
addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(() => { setNav(); queued = false; }); } }, { passive: true });
setNav();
