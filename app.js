// State Management and Storage Keys for Event Planning ERP
const STORAGE_KEYS = {
  EVENTS: 'erp_events',
  TRANSACTIONS: 'erp_transactions',
  CONSUMABLES: 'erp_consumables',
  RENTAL_ASSETS: 'erp_rental_assets',
  RENTAL_ALLOCATIONS: 'erp_rental_allocations',
  TASKS: 'erp_tasks',
  VENDORS: 'erp_vendors',
  CREW: 'erp_crew'
};

// --- INITIAL MOCK DATA ---
const DEFAULT_EVENTS = [
  {
    id: 'evt_1',
    name: 'حفل زفاف أحمد وسارة - قاعة ريتز كارلتون',
    clientName: 'أحمد صلاح الفقي',
    clientPhone: '01099887766',
    eventDate: '2026-08-12',
    venue: 'فندق ريتز كارلتون - قاعة ألف ليلة',
    guestCount: 250,
    totalContractValue: 350000,
    categoryBudgets: {
      Materials: 100000,
      Labor: 40000,
      Equipment: 80000,
      Logistics: 50000,
      Overheads: 30000
    },
    status: 'planning'
  },
  {
    id: 'evt_2',
    name: 'المؤتمر السنوي لشركة تك للمقاولات 2026',
    clientName: 'م. خالد جلال (شركة تك)',
    clientPhone: '01223344556',
    eventDate: '2026-09-05',
    venue: 'مركز المنارة للمؤتمرات - القاعة الكبرى',
    guestCount: 500,
    totalContractValue: 650000,
    categoryBudgets: {
      Materials: 150000,
      Labor: 100000,
      Equipment: 200000,
      Logistics: 80000,
      Overheads: 50000
    },
    status: 'active'
  },
  {
    id: 'evt_3',
    name: 'حفل تخرج الدفعة 45 كلية الصيدلة',
    clientName: 'اتحاد طلاب صيدلة',
    clientPhone: '01511223344',
    eventDate: '2026-07-28',
    venue: 'نادي ضباط الشرطة بالجزيرة - المسرح المفتوح',
    guestCount: 350,
    totalContractValue: 180000,
    categoryBudgets: {
      Materials: 60000,
      Labor: 30000,
      Equipment: 40000,
      Logistics: 20000,
      Overheads: 10000
    },
    status: 'active'
  }
];

const DEFAULT_TRANSACTIONS = [
  // Event 1 (Ahmed & Sarah Wedding) Financials
  { id: 'tx_1', eventId: 'evt_1', type: 'revenue', category: 'ClientPayment', amount: 100000, date: '2026-06-15', description: 'الدفعة الأولى المقدمة لحجز موعد حفل الزفاف والقاعة', addedBy: 'الحسابات' },
  { id: 'tx_2', eventId: 'evt_1', type: 'expense', category: 'Overheads', amount: 30000, date: '2026-06-20', description: 'رسوم حجز وتأكيد القاعة بفندق ريتز كارلتون', addedBy: 'المكتب الفني' },
  { id: 'tx_3', eventId: 'evt_1', type: 'expense', category: 'Materials', amount: 45000, date: '2026-07-02', description: 'شراء وتوريد الورد الطبيعي والكوشة والزينة من مورد الورد', addedBy: 'المنسق' },
  
  // Event 2 (Tech Conference) Financials
  { id: 'tx_4', eventId: 'evt_2', type: 'revenue', category: 'ClientPayment', amount: 300000, date: '2026-07-01', description: 'مقدم عقد تنظيم المؤتمر السنوي 50%', addedBy: 'الإدارة المالي' },
  { id: 'tx_5', eventId: 'evt_2', type: 'expense', category: 'Equipment', amount: 120000, date: '2026-07-05', description: 'دفعة تعاقد مورد شاشات LED وأنظمة الصوت والضوء والترجمة', addedBy: 'مشتريات الفعالية' },
  { id: 'tx_6', eventId: 'evt_2', type: 'expense', category: 'Logistics', amount: 35000, date: '2026-07-08', description: 'شحن وتجهيز مواد الدعاية المطبوعة والبنرات للمؤتمر', addedBy: 'النقل' },

  // Event 3 (Graduation) Financials
  { id: 'tx_7', eventId: 'evt_3', type: 'revenue', category: 'ClientPayment', amount: 120000, date: '2026-07-10', description: 'سداد الدفعة الأولى من اتحاد الطلاب لصالح الحفل', addedBy: 'الحسابات' },
  { id: 'tx_8', eventId: 'evt_3', type: 'expense', category: 'Labor', amount: 15000, date: '2026-07-12', description: 'أجور مقدمة للمنظمين والـ Hostesses بالمسرح المفتوح', addedBy: 'مشرف الفريق' },
  { id: 'tx_9', eventId: 'evt_3', type: 'expense', category: 'Materials', amount: 28000, date: '2026-07-14', description: 'شراء دروع التخرج التذكارية وشهادات تقدير مغلفة للطلاب', addedBy: 'المشتريات' },
  
  // Petty Cash Expenses (سحب ومصروفات نثرية)
  { id: 'tx_10', eventId: 'evt_1', type: 'expense', category: 'Logistics', amount: 180, date: '2026-07-15', description: 'توصيل أوبر لنقل منسقين الورد لموقع الفندق', addedBy: 'منسق الحفل', isPettyCash: true, receiptImage: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI0ExRjhEMCIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzA2NUY0NiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+T1VCRVIgMTgwPC90ZXh0Pjwvc3ZnPg==' },
  { id: 'tx_11', eventId: 'evt_1', type: 'expense', category: 'Materials', amount: 95, date: '2026-07-16', description: 'شراء بكر لاصق عازل وحبال تعليق للديكور', addedBy: 'مشرف التجهيز', isPettyCash: true, receiptImage: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI0ExRjhEMCIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzA2NUY0NiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VEFQRVMgOTU8L3RleHQ+PC9zdmc+' }
];

const DEFAULT_CONSUMABLES = [
  { id: 'con_1', name: 'باقات ورد طبيعي جوري (أحمر وأبيض)', sku: 'FLOW-RED-WHT', qty: 250, cost: 85, minStock: 50 },
  { id: 'con_2', name: 'شموع ديكور كلاسيكية بيضاء (حجم وسط)', sku: 'CAND-CL-WHT', qty: 500, cost: 25, minStock: 100 },
  { id: 'con_3', name: 'كتيبات ترحيبية ودعوات مطبوعة فارغة', sku: 'PRN-CARD-01', qty: 1200, cost: 8, minStock: 200 },
  { id: 'con_4', name: 'علب شوكولاتة الضيافة المطبوعة بالنحاس', sku: 'BOX-CHOCO-LP', qty: 80, cost: 240, minStock: 15 }
];

const DEFAULT_RENTAL_ASSETS = [
  { id: 'ast_1', name: 'كراسي نابليون مذهبة فاخرة (Banquet Chairs)', sku: 'CH-NAP-GOLD', totalQty: 600, rentedQty: 150, cost: 40 },
  { id: 'ast_2', name: 'طاولات دائرية مغطاة بمفرش قطيفة أخضر/أبيض', sku: 'TBL-ROUND-VVT', totalQty: 80, rentedQty: 15, cost: 120 },
  { id: 'ast_3', name: 'شاشات عرض LED رقمية مقاس P3 (بالمتر المربع)', sku: 'LED-SCR-P3', totalQty: 40, rentedQty: 12, cost: 500 },
  { id: 'ast_4', name: 'كشافات إضاءة متحركة Moving Head (حفلات)', sku: 'LIGHT-MVH-250', totalQty: 24, rentedQty: 8, cost: 300 },
  { id: 'ast_5', name: 'أجهزة مكبرات صوت سماعات معلقة Line Array', sku: 'SND-LINE-ARRY', totalQty: 16, rentedQty: 4, cost: 650 }
];

const DEFAULT_RENTAL_ALLOCATIONS = [
  {
    id: 'alc_1',
    eventId: 'evt_2',
    eventName: 'المؤتمر السنوي لشركة تك للمقاولات 2026',
    assetId: 'ast_3',
    assetName: 'شاشات عرض LED رقمية مقاس P3 (بالمتر المربع)',
    qty: 12,
    deployDate: '2026-07-04',
    expectedReturnDate: '2026-09-08',
    status: 'deployed' // 'deployed' | 'returned'
  },
  {
    id: 'alc_2',
    eventId: 'evt_3',
    eventName: 'حفل تخرج الدفعة 45 كلية الصيدلة',
    assetId: 'ast_1',
    assetName: 'كراسي نابليون مذهبة فاخرة (Banquet Chairs)',
    qty: 150,
    deployDate: '2026-07-12',
    expectedReturnDate: '2026-07-30',
    status: 'deployed'
  }
];

const DEFAULT_TASKS = [
  // Wedding Tasks
  { id: 'tsk_1', eventId: 'evt_1', title: 'حجز وتأكيد بوفيه عشاء ريتز كارلتون للضيوف', category: 'Catering', status: 'completed', assignedTo: 'أحمد المشرف' },
  { id: 'tsk_2', eventId: 'evt_1', title: 'شراء وتوريد باقات الزهور الجوري والكوشة', category: 'Decor', status: 'in-progress', assignedTo: 'منسق الزهور' },
  { id: 'tsk_3', eventId: 'evt_1', title: 'حجز فرقة الموسيقى ومصوري الزفاف والـ DJ', category: 'SoundLight', status: 'pending', assignedTo: 'المكتب الفني' },
  
  // Tech Conference Tasks
  { id: 'tsk_4', eventId: 'evt_2', title: 'تصميم وطباعة البنرات وبطاقات التعريف للضيوف', category: 'Logistics', status: 'completed', assignedTo: 'شركة المطبوعات' },
  { id: 'tsk_5', eventId: 'evt_2', title: 'تركيب شاشات الـ LED وتجربة أجهزة الصوت بالقاعة', category: 'SoundLight', status: 'in-progress', assignedTo: 'مهندس الصوتيات' },
  { id: 'tsk_6', eventId: 'evt_2', title: 'حجز المضيفات وفريق الترحيب والاستقبال للمؤتمر', category: 'Staffing', status: 'pending', assignedTo: 'مشرف الفريق' }
];

const DEFAULT_VENDORS = [
  { id: 'ven_1', name: 'شركة النور لأنظمة الصوت والإضاءة والمسارح', serviceType: 'أجهزة صوت وضوء ومسارح', contact: '01122334455', balance: 0 },
  { id: 'ven_2', name: 'الشركة العربية المخصصة لبوفيهات الفنادق وحفلات العشاء', serviceType: 'خدمات طعام وضيافة (Catering)', contact: '01002003004', balance: 0 },
  { id: 'ven_3', name: 'مشتل الياسمين لتصميم وتوريد زهور الكوشة والممرات', serviceType: 'تنسيق زهور وديكورات طبيعية', contact: '01201201201', balance: 0 }
];

const DEFAULT_CREW = [
  { id: 'crw_1', name: 'ياسمين ممدوح', role: 'Hostess', dailyRate: 600, phone: '01011122233', currentEventId: 'evt_2' },
  { id: 'crw_2', name: 'تامر عبد الرحمن', role: 'Coordinator', dailyRate: 1200, phone: '01144455566', currentEventId: 'evt_1' },
  { id: 'crw_3', name: 'مصطفى كمال', role: 'Supervisor', dailyRate: 1000, phone: '01277788899', currentEventId: 'evt_3' },
  { id: 'crw_4', name: 'ميخائيل جرجس', role: 'SoundEng', dailyRate: 800, phone: '01222233344', currentEventId: '' },
  { id: 'crw_5', name: 'سارة أحمد محمود', role: 'Coordinator', dailyRate: 1500, phone: '01011223344', currentEventId: 'evt_1' },
  { id: 'crw_6', name: 'دينا مصطفى كامل', role: 'Hostess', dailyRate: 600, phone: '01055566677', currentEventId: 'evt_1' },
  { id: 'crw_7', name: 'شادي أسامة رفيق', role: 'Supervisor', dailyRate: 1100, phone: '01188899900', currentEventId: 'evt_2' },
  { id: 'crw_8', name: 'رانيا يوسف شكري', role: 'Hostess', dailyRate: 600, phone: '01533344455', currentEventId: '' },
  { id: 'crw_9', name: 'يوسف خالد زكي', role: 'Coordinator', dailyRate: 1300, phone: '01099988877', currentEventId: '' },
  { id: 'crw_10', name: 'أحمد رامي فوزي', role: 'Hostess', dailyRate: 550, phone: '01244455566', currentEventId: 'evt_3' },
  { id: 'crw_11', name: 'شريف منير فريد', role: 'Supervisor', dailyRate: 1200, phone: '01077733322', currentEventId: '' },
  { id: 'crw_12', name: 'مروان حسين عبد الله', role: 'SoundEng', dailyRate: 900, phone: '01122299988', currentEventId: 'evt_2' }
];

// App State Core
let state = {
  events: [],
  transactions: [],
  consumables: [],
  rentalAssets: [],
  rentalAllocations: [],
  tasks: [],
  vendors: [],
  crew: []
};

// --- DATA LAYER (LOCAL STORAGE persistence) ---
function loadERPState() {
  state.events = JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS)) || DEFAULT_EVENTS;
  
  const savedTx = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS));
  if (!savedTx || savedTx.length < 10) {
    state.transactions = DEFAULT_TRANSACTIONS;
  } else {
    state.transactions = savedTx;
  }

  state.consumables = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONSUMABLES)) || DEFAULT_CONSUMABLES;
  state.rentalAssets = JSON.parse(localStorage.getItem(STORAGE_KEYS.RENTAL_ASSETS)) || DEFAULT_RENTAL_ASSETS;
  state.rentalAllocations = JSON.parse(localStorage.getItem(STORAGE_KEYS.RENTAL_ALLOCATIONS)) || DEFAULT_RENTAL_ALLOCATIONS;
  state.tasks = JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS)) || DEFAULT_TASKS;
  state.vendors = JSON.parse(localStorage.getItem(STORAGE_KEYS.VENDORS)) || DEFAULT_VENDORS;
  
  const savedCrew = JSON.parse(localStorage.getItem(STORAGE_KEYS.CREW));
  if (!savedCrew || savedCrew.length < 6) {
    state.crew = DEFAULT_CREW;
  } else {
    state.crew = savedCrew;
  }
  
  saveERPState();
}

function saveERPState() {
  localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(state.events));
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(state.transactions));
  localStorage.setItem(STORAGE_KEYS.CONSUMABLES, JSON.stringify(state.consumables));
  localStorage.setItem(STORAGE_KEYS.RENTAL_ASSETS, JSON.stringify(state.rentalAssets));
  localStorage.setItem(STORAGE_KEYS.RENTAL_ALLOCATIONS, JSON.stringify(state.rentalAllocations));
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(state.tasks));
  localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify(state.vendors));
  localStorage.setItem(STORAGE_KEYS.CREW, JSON.stringify(state.crew));
}

// Utility: Currency formatter (EGP)
function formatCurrency(val) {
  return new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP', maximumFractionDigits: 0 }).format(val);
}

// Set up UI Views & Sub-Tabs Navigation
function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.view-section');
  const pageTitle = document.getElementById('page-current-title');
  
  navItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetView = this.getAttribute('data-view');
      
      // Sidebar Active Update
      navItems.forEach(nav => nav.classList.remove('active'));
      this.classList.add('active');
      
      // View Toggles
      sections.forEach(sec => sec.classList.remove('active'));
      const activeSection = document.getElementById(`view-${targetView}`);
      if (activeSection) {
        activeSection.classList.add('active');
      }
      
      const titles = {
        'dashboard': 'لوحة التحكم العامة والأرباح',
        'eventsheets': 'شيت التكاليف والأرباح التقديرية والفعلية',
        'ledger': 'دفتر المعاملات والقيود المالية',
        'addpetty': 'سحب مصروفات ونثرية جديدة',
        'pettylog': 'سجل سحب المصروفات والنثرية وإيصالات الدفع',
        'operations': 'العمليات والمهام وتوزيع فريق العمل والموردين',
        'warehouse': 'المستودع وتتبع الأصول المعارة وتجهيزات الفعاليات'
      };
      pageTitle.innerText = titles[targetView] || 'لوحة التحكم';
      
      renderView(targetView);
    });
  });

  // Sub-tabs clicks configuration
  const subTabButtons = document.querySelectorAll('.sub-tab-btn');
  subTabButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const parentSection = this.closest('.view-section');
      const siblings = parentSection.querySelectorAll('.sub-tab-btn');
      siblings.forEach(s => s.classList.remove('active'));
      this.classList.add('active');

      const targetSub = this.getAttribute('data-sub');
      const subSections = parentSection.querySelectorAll('.sub-view-section');
      subSections.forEach(s => s.classList.remove('active'));
      
      const activeSub = parentSection.querySelector(`#sub-view-${targetSub}`);
      if (activeSub) activeSub.classList.add('active');

      // Refresh specific lists per sub-tab
      const currentActiveView = parentSection.id.replace('view-', '');
      renderView(currentActiveView);
    });
  });
}

function renderView(viewName) {
  switch (viewName) {
    case 'dashboard':
      renderDashboard();
      break;
    case 'eventsheets':
      renderEventSheets();
      break;
    case 'ledger':
      renderLedger();
      break;
    case 'operations':
      renderOperations();
      break;
    case 'warehouse':
      renderWarehouse();
      break;
    case 'addpetty':
      renderAddPetty();
      break;
    case 'pettylog':
      renderPettyLog();
      break;
  }
}

// --- 1. DASHBOARD VIEW ---
function renderDashboard() {
  const totalRevenue = state.events.reduce((acc, ev) => acc + ev.totalContractValue, 0);
  const totalSpent = state.transactions.filter(tx => tx.type === 'expense').reduce((acc, tx) => acc + tx.amount, 0);
  const netProfit = totalRevenue - totalSpent;
  const spentPct = totalRevenue > 0 ? Math.round((totalSpent / totalRevenue) * 100) : 0;
  const profitMargin = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0;

  // Count deployed rental assets
  const deployedAssetPieces = state.rentalAllocations.filter(alc => alc.status === 'deployed').reduce((acc, alc) => acc + alc.qty, 0);

  document.getElementById('dash-total-revenue').innerText = formatCurrency(totalRevenue);
  document.getElementById('dash-total-spent').innerText = formatCurrency(totalSpent);
  document.getElementById('dash-spent-pct').innerText = `${spentPct}% من قيمة العقود الكلية`;
  
  const profitNode = document.getElementById('dash-total-profits');
  profitNode.innerText = formatCurrency(netProfit);
  if (netProfit >= 0) {
    profitNode.style.color = 'var(--accent-primary)';
  } else {
    profitNode.style.color = 'var(--accent-danger)';
  }
  document.getElementById('dash-profit-margin').innerText = `هامش ربح: ${profitMargin}%`;

  document.getElementById('dash-out-assets').innerText = `${deployedAssetPieces} قطعة`;

  // Draw SVGs Budget vs Spent Chart
  drawDashboardChart();

  // Draw Recent Transactions
  renderRecentTransactions();

  // Draw Events Overview Table
  renderEventsTable();
}

function drawDashboardChart() {
  const chartContainer = document.getElementById('event-bar-chart');
  chartContainer.innerHTML = '';
  
  if (state.events.length === 0) {
    chartContainer.innerHTML = '<div style="margin: auto; color: var(--text-secondary);">لا توجد حفلات مسجلة بعد لعرض المخطط البياني.</div>';
    return;
  }

  // Find max value to scale chart
  let maxVal = 0;
  state.events.forEach(ev => {
    const evSpent = state.transactions.filter(t => t.eventId === ev.id && t.type === 'expense').reduce((acc, cur) => acc + cur.amount, 0);
    maxVal = Math.max(maxVal, ev.totalContractValue, evSpent);
  });
  
  if (maxVal === 0) maxVal = 1;

  state.events.forEach(ev => {
    const evSpent = state.transactions.filter(t => t.eventId === ev.id && t.type === 'expense').reduce((acc, cur) => acc + cur.amount, 0);
    const revenueHeight = (ev.totalContractValue / maxVal) * 80; // scale down slightly to fit labels
    const spentHeight = (evSpent / maxVal) * 80;
    const isOver = evSpent > ev.totalContractValue;

    const wrapper = document.createElement('div');
    wrapper.className = 'chart-bar-wrapper';

    const barsContainer = document.createElement('div');
    barsContainer.className = 'chart-bars';

    // Contract Revenue Bar
    const budgetBar = document.createElement('div');
    budgetBar.className = 'chart-bar budget';
    budgetBar.style.height = `${revenueHeight}%`;
    
    const budgetTooltip = document.createElement('div');
    budgetTooltip.className = 'chart-tooltip';
    budgetTooltip.innerText = `عقد: ${formatCurrency(ev.totalContractValue)}`;
    budgetBar.appendChild(budgetTooltip);

    // Spent Expense Bar
    const spentBar = document.createElement('div');
    spentBar.className = `chart-bar spent ${isOver ? 'over' : ''}`;
    spentBar.style.height = `${spentHeight}%`;

    const spentTooltip = document.createElement('div');
    spentTooltip.className = 'chart-tooltip';
    spentTooltip.innerText = `مصاريف: ${formatCurrency(evSpent)}`;
    spentBar.appendChild(spentTooltip);

    barsContainer.appendChild(budgetBar);
    barsContainer.appendChild(spentBar);

    // Label
    const label = document.createElement('div');
    label.className = 'chart-label';
    label.innerText = ev.name;

    wrapper.appendChild(barsContainer);
    wrapper.appendChild(label);
    chartContainer.appendChild(wrapper);
  });
}

function renderRecentTransactions() {
  const container = document.getElementById('dash-recent-transactions');
  container.innerHTML = '';

  const recent = [...state.transactions].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  if (recent.length === 0) {
    container.innerHTML = '<div style="color: var(--text-secondary); text-align: center; padding: 20px;">لا توجد معاملات مسجلة حالياً.</div>';
    return;
  }

  const categoryLabels = {
    ClientPayment: 'إيراد من العميل',
    Materials: 'مواد ومستلزمات',
    Labor: 'أجور عمال ومنظمين',
    Equipment: 'أنظمة وأجهزة حفلات',
    Logistics: 'شحن ونقل وضيافة',
    Overheads: 'حجوزات قاعات وعموميات'
  };

  recent.forEach(tx => {
    const ev = state.events.find(e => e.id === tx.eventId);
    const evName = ev ? ev.name : 'فعالية غير معرفة';
    const isRevenue = tx.type === 'revenue';

    const item = document.createElement('div');
    item.className = 'list-item';

    item.innerHTML = `
      <div class="list-item-meta">
        <span class="list-item-title">${tx.description}</span>
        <span class="list-item-sub"><span class="clickable-event" onclick="openEventCostSheet('${tx.eventId}')">${evName}</span> | ${categoryLabels[tx.category] || tx.category}</span>
      </div>
      <div class="list-item-val" style="color: ${isRevenue ? 'var(--accent-primary)' : 'var(--accent-danger)'};">
        ${isRevenue ? '+' : '-'}${formatCurrency(tx.amount)}
        <div style="font-size: 10px; color: var(--text-muted); font-weight: normal; margin-top: 4px;">${tx.date}</div>
      </div>
    `;

    container.appendChild(item);
  });
}

function renderEventsTable() {
  const tbody = document.getElementById('events-table-body');
  tbody.innerHTML = '';

  if (state.events.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--text-secondary);">لا توجد مناسبات نشطة. قم بإنشاء فعالية جديدة للبدء.</td></tr>';
    return;
  }

  state.events.forEach(ev => {
    const evSpent = state.transactions.filter(t => t.eventId === ev.id && t.type === 'expense').reduce((acc, cur) => acc + cur.amount, 0);
    const netProfit = ev.totalContractValue - evSpent;
    const profitPct = ev.totalContractValue > 0 ? (netProfit / ev.totalContractValue) * 100 : 0;
    
    // Checklist progress calculation
    const evTasks = state.tasks.filter(t => t.eventId === ev.id);
    const completedTasks = evTasks.filter(t => t.status === 'completed').length;
    const taskPct = evTasks.length > 0 ? Math.round((completedTasks / evTasks.length) * 100) : 0;

    let progressColor = 'progress-fill';
    if (taskPct === 100) progressColor = 'progress-fill';
    else if (taskPct > 50) progressColor = 'progress-fill warning';
    else progressColor = 'progress-fill danger';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-weight: 600;" class="clickable-event" onclick="openEventCostSheet('${ev.id}')">${ev.name}</td>
      <td style="font-size: 13px;">${ev.eventDate}</td>
      <td style="color: var(--accent-primary); font-weight: 500;">${formatCurrency(ev.totalContractValue)}</td>
      <td style="color: ${evSpent > ev.totalContractValue ? 'var(--accent-danger)' : 'inherit'};">${formatCurrency(evSpent)}</td>
      <td>
        <div class="progress-bar-container">
          <div class="progress-track">
            <div class="${progressColor}" style="width: ${taskPct}%;"></div>
          </div>
          <span class="progress-percent">${taskPct}%</span>
        </div>
      </td>
      <td style="font-weight: 600; color: ${netProfit >= 0 ? 'var(--accent-primary)' : 'var(--accent-danger)'};">
        ${formatCurrency(netProfit)} (${Math.round(profitPct)}%)
      </td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="openEventCostSheet('${ev.id}')">📋 عرض التحليلات</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Expose navigation trigger to event cost sheet details
window.openEventCostSheet = function(eventId) {
  const select = document.getElementById('sheet-event-select');
  if (select) {
    select.value = eventId;
    
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(nav => nav.classList.remove('active'));
    
    const sheetTab = Array.from(navItems).find(n => n.getAttribute('data-view') === 'eventsheets');
    if (sheetTab) sheetTab.classList.add('active');

    const sections = document.querySelectorAll('.view-section');
    sections.forEach(sec => sec.classList.remove('active'));
    
    const targetSection = document.getElementById('view-eventsheets');
    if (targetSection) targetSection.classList.add('active');

    document.getElementById('page-current-title').innerText = 'شيت التكاليف والأرباح التقديرية والفعلية';

    renderEventSheets();
  }
};

// --- 2. EVENT SHEETS VIEW ---
function renderEventSheets() {
  const select = document.getElementById('sheet-event-select');
  
  const previousSelection = select.value;
  
  select.innerHTML = '';
  if (state.events.length === 0) {
    select.innerHTML = '<option value="">لا توجد مناسبات مسجلة</option>';
    document.getElementById('event-categories-container').innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">يرجى حجز فعالية أولاً لتفحص بياناتها.</div>';
    return;
  }

  state.events.forEach(ev => {
    const opt = document.createElement('option');
    opt.value = ev.id;
    opt.innerText = ev.name;
    select.appendChild(opt);
  });

  if (previousSelection && state.events.some(e => e.id === previousSelection)) {
    select.value = previousSelection;
  }

  const selectedEvId = select.value;
  const event = state.events.find(e => e.id === selectedEvId);
  if (!event) return;

  // Render header info card details
  document.getElementById('sheet-info-event-name').innerText = event.name;
  document.getElementById('sheet-info-client').innerText = event.clientName;
  document.getElementById('sheet-info-phone').innerText = event.clientPhone;
  document.getElementById('sheet-info-date').innerText = event.eventDate;
  document.getElementById('sheet-info-venue').innerText = event.venue;
  document.getElementById('sheet-info-guests').innerText = `${event.guestCount} فرد`;
  
  const statusBadge = document.getElementById('sheet-info-status');
  const statuses = { planning: 'قيد التخطيط', active: 'نشط وتشغيل', completed: 'مكتمل وأرشيف' };
  statusBadge.innerText = statuses[event.status] || event.status;
  statusBadge.className = `badge ${event.status === 'completed' ? 'badge-secondary' : event.status === 'active' ? 'badge-primary' : 'badge-warning'}`;

  // Calculations
  const evTxs = state.transactions.filter(t => t.eventId === event.id);
  const evRevenues = evTxs.filter(t => t.type === 'revenue');
  const evExpenses = evTxs.filter(t => t.type === 'expense');

  const totalRevenue = event.totalContractValue;
  const totalPaid = evRevenues.reduce((acc, cur) => acc + cur.amount, 0);
  const totalSpent = evExpenses.reduce((acc, cur) => acc + cur.amount, 0);
  const remainingCollect = totalRevenue - totalPaid;
  const netProfit = totalRevenue - totalSpent;
  const profitMargin = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0;

  document.getElementById('sheet-event-revenue').innerText = formatCurrency(totalRevenue);
  document.getElementById('sheet-event-paid').innerText = `المحصل من العميل: ${formatCurrency(totalPaid)}`;
  
  const pendingNode = document.getElementById('sheet-event-pending');
  pendingNode.innerText = `المتبقي للتحصيل: ${formatCurrency(remainingCollect)}`;
  if (remainingCollect > 0) {
    pendingNode.style.color = 'var(--accent-warning)';
  } else {
    pendingNode.style.color = 'var(--accent-success)';
  }

  document.getElementById('sheet-event-spent').innerText = formatCurrency(totalSpent);
  
  const profitNode = document.getElementById('sheet-event-profit');
  profitNode.innerText = formatCurrency(netProfit);
  if (netProfit >= 0) {
    profitNode.style.color = 'var(--accent-primary)';
  } else {
    profitNode.style.color = 'var(--accent-danger)';
  }
  document.getElementById('sheet-event-margin').innerText = `هامش الربح: ${profitMargin}%`;

  // Draw items categorized breakdown
  const categoryLabels = {
    Materials: { ar: 'الخامات والديكورات والورد', icon: '🌹' },
    Labor: { ar: 'المنظمين والعمال المباشرين', icon: '👷' },
    Equipment: { ar: 'أنظمة الصوت والإضاءة والمسارح', icon: '🎤' },
    Logistics: { ar: 'الشحن والنقل والضيافة', icon: '🚚' },
    Overheads: { ar: 'حجوزات الصالات والعموميات', icon: '🏢' }
  };

  const container = document.getElementById('event-categories-container');
  container.innerHTML = '';

  Object.keys(categoryLabels).forEach(cat => {
    const catBudget = event.categoryBudgets[cat] || 0;
    const catSpent = evExpenses.filter(e => e.category === cat).reduce((acc, cur) => acc + cur.amount, 0);
    const catVariance = catBudget - catSpent;
    const catSpentPct = catBudget > 0 ? (catSpent / catBudget) * 100 : 0;

    let barColor = 'progress-fill';
    let varianceColor = 'var(--accent-primary)';
    if (catSpentPct > 100) {
      barColor = 'progress-fill danger';
      varianceColor = 'var(--accent-danger)';
    } else if (catSpentPct > 85) {
      barColor = 'progress-fill warning';
      varianceColor = 'var(--accent-warning)';
    }

    const card = document.createElement('div');
    card.className = 'cost-category-card';
    card.setAttribute('onclick', `openQuickExpenseModal('${cat}', '${categoryLabels[cat].ar}')`);
    card.innerHTML = `
      <div class="cost-category-header">
        <span class="cost-category-title">${categoryLabels[cat].icon} ${categoryLabels[cat].ar}</span>
        <span class="badge ${catSpentPct > 100 ? 'badge-danger' : catSpentPct > 85 ? 'badge-warning' : 'badge-success'}">${Math.round(catSpentPct)}%</span>
      </div>
      <div class="cost-category-budget-vs-actual">
        <span>الميزانية المرصودة:</span>
        <span style="font-weight: 600;">${formatCurrency(catBudget)}</span>
      </div>
      <div class="cost-category-budget-vs-actual">
        <span>المنصرف الفعلي:</span>
        <span style="font-weight: 700; color: ${catSpentPct > 100 ? 'var(--accent-danger)' : 'inherit'};">${formatCurrency(catSpent)}</span>
      </div>
      <div class="progress-bar-container" style="margin: 12px 0;">
        <div class="progress-track">
          <div class="${barColor}" style="width: ${Math.min(catSpentPct, 100)}%;"></div>
        </div>
      </div>
      <div class="flex-between" style="font-size: 12px; color: var(--text-secondary);">
        <span>المتبقي للقسم:</span>
        <span style="font-weight: 700; color: ${varianceColor};">
          ${catVariance >= 0 ? '+' : ''}${formatCurrency(catVariance)}
        </span>
      </div>
      <div class="quick-spend-link">💸 تسجيل صرف فوري على البند</div>
    `;
    container.appendChild(card);
  });

  // Render Event specific detailed ledger
  const tbody = document.getElementById('event-ledger-table-body');
  tbody.innerHTML = '';

  const sortedTxs = [...evTxs].sort((a,b) => new Date(b.date) - new Date(a.date));

  if (sortedTxs.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--text-secondary);">لا توجد أي إيرادات أو فواتير مسجلة لهذه الفعالية بعد.</td></tr>';
    return;
  }

  sortedTxs.forEach(tx => {
    const isRev = tx.type === 'revenue';
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-size: 13px;">${tx.date}</td>
      <td>
        <span class="badge ${isRev ? 'badge-success' : 'badge-danger'}">
          ${isRev ? 'قبض وإيراد' : 'صرف ومصروف'}
        </span>
      </td>
      <td style="font-weight: 500;">
        ${tx.category === 'ClientPayment' ? 'سداد العميل' : (categoryLabels[tx.category]?.ar || tx.category)}
      </td>
      <td>${tx.description}</td>
      <td style="font-weight: 600; color: ${isRev ? 'var(--accent-primary)' : 'var(--accent-danger)'};">
        ${isRev ? '+' : '-'}${formatCurrency(tx.amount)}
      </td>
      <td>
        <button class="btn btn-secondary btn-sm" style="color: var(--accent-danger);" onclick="deleteERPTransaction('${tx.id}', 'eventsheets')">🗑️ حذف</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// --- 3. LEDGER VIEW ---
function renderLedger() {
  const select = document.getElementById('tx-event');
  
  select.innerHTML = '<option value="" disabled selected>اختر الفعالية المستهدفة...</option>';
  state.events.forEach(ev => {
    const opt = document.createElement('option');
    opt.value = ev.id;
    opt.innerText = ev.name;
    select.appendChild(opt);
  });

  const searchQuery = document.getElementById('tx-search-input').value.toLowerCase().trim();
  renderAllLedgerTable(searchQuery);
}

function renderAllLedgerTable(query = '') {
  const tbody = document.getElementById('all-tx-table-body');
  tbody.innerHTML = '';

  const filtered = state.transactions.filter(tx => {
    const ev = state.events.find(e => e.id === tx.eventId);
    const evName = ev ? ev.name.toLowerCase() : '';
    const desc = tx.description.toLowerCase();
    const cat = tx.category.toLowerCase();
    const typeLabel = tx.type === 'revenue' ? 'إيراد قبض' : 'مصروف صرف';

    return evName.includes(query) || desc.includes(query) || cat.includes(query) || typeLabel.includes(query);
  });

  const sorted = filtered.sort((a,b) => new Date(b.date) - new Date(a.date));

  if (sorted.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--text-secondary);">لا توجد أي قيود مطابقة لبحثك في الخزينة.</td></tr>';
    return;
  }

  const catLabels = {
    ClientPayment: 'إيراد العميل',
    Materials: 'المستلزمات والديكور',
    Labor: 'أجور منظمين وعمال',
    Equipment: 'أنظمة وأجهزة الصوت',
    Logistics: 'النقل واللوجستيات',
    Overheads: 'حجز قاعات وعموميات'
  };

  sorted.forEach(tx => {
    const ev = state.events.find(e => e.id === tx.eventId);
    const evName = ev ? ev.name : 'مجهول';
    const isRev = tx.type === 'revenue';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-weight: 500;" class="clickable-event" onclick="openEventCostSheet('${tx.eventId}')">${evName}</td>
      <td>
        <span class="badge ${isRev ? 'badge-success' : 'badge-danger'}">
          ${isRev ? 'إيراد قبض' : 'صرف تنفيذ'}
        </span>
      </td>
      <td><span class="badge badge-primary">${catLabels[tx.category] || tx.category}</span></td>
      <td style="font-weight: 700; color: ${isRev ? 'var(--accent-primary)' : 'var(--accent-danger)'};">
        ${isRev ? '+' : '-'}${formatCurrency(tx.amount)}
      </td>
      <td style="font-size: 13px;">${tx.date}</td>
      <td style="max-width: 240px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;" title="${tx.description}">
        ${tx.description}
      </td>
      <td>
        <button class="btn btn-secondary btn-sm" style="color: var(--accent-danger);" onclick="deleteERPTransaction('${tx.id}', 'ledger')">🗑️ حذف</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

window.deleteERPTransaction = function(txId, activeView = 'ledger') {
  if (confirm('هل أنت متأكد من رغبتك في حذف هذه الحركة المالية من الحسابات؟')) {
    state.transactions = state.transactions.filter(t => t.id !== txId);
    saveERPState();
    renderView(activeView);
    if (activeView !== 'dashboard') {
      renderDashboard(); // background sync
    }
  }
};

// --- PETTY CASH & RECEIPTS VIEW ---
function renderAddPetty() {
  const select = document.getElementById('petty-event');
  if (!select) return;
  select.innerHTML = '<option value="" disabled selected>اختر المناسبة المخصصة للصرف...</option>';
  state.events.forEach(ev => {
    const opt = document.createElement('option');
    opt.value = ev.id;
    opt.innerText = ev.name;
    select.appendChild(opt);
  });
}

function renderPettyLog() {
  // Populate filter dropdown
  const filterSelect = document.getElementById('petty-filter-event');
  if (filterSelect) {
    const previousFilter = filterSelect.value;
    filterSelect.innerHTML = '<option value="">📂 عرض جميع الفعاليات / الحفلات</option>';
    state.events.forEach(ev => {
      const opt = document.createElement('option');
      opt.value = ev.id;
      opt.innerText = ev.name;
      filterSelect.appendChild(opt);
    });
    if (previousFilter && state.events.some(e => e.id === previousFilter)) {
      filterSelect.value = previousFilter;
    }
  }

  // Calculate statistics
  const pettyTxs = state.transactions.filter(t => t.isPettyCash === true);
  const totalSpent = pettyTxs.reduce((acc, t) => acc + t.amount, 0);
  const totalTransport = pettyTxs.filter(t => t.category === 'Logistics').reduce((acc, t) => acc + t.amount, 0);
  const receiptsCount = pettyTxs.filter(t => !!t.receiptImage).length;

  const totalSpentEl = document.getElementById('petty-total-spent');
  if (totalSpentEl) totalSpentEl.innerText = formatCurrency(totalSpent);

  const totalTransportEl = document.getElementById('petty-total-transport');
  if (totalTransportEl) totalTransportEl.innerText = formatCurrency(totalTransport);

  const receiptsCountEl = document.getElementById('petty-receipts-count');
  if (receiptsCountEl) receiptsCountEl.innerText = `${receiptsCount} إيصال مصوّر`;

  // Render Table
  const searchInput = document.getElementById('petty-search-input');
  const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const selectedFilterEventId = filterSelect ? filterSelect.value : '';
  const tbody = document.getElementById('petty-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  const filtered = pettyTxs.filter(t => {
    // Filter by Event Select
    if (selectedFilterEventId && t.eventId !== selectedFilterEventId) {
      return false;
    }

    const ev = state.events.find(e => e.id === t.eventId);
    const evName = ev ? ev.name.toLowerCase() : '';
    const desc = t.description.toLowerCase();
    const cat = t.category.toLowerCase();
    return evName.includes(searchQuery) || desc.includes(searchQuery) || cat.includes(searchQuery);
  });

  const sorted = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (sorted.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--text-secondary); padding: 20px;">لا توجد أي سحوبات نثرية مسجلة مطابقة للبحث.</td></tr>';
    return;
  }

  const categoryLabels = {
    Logistics: 'انتقالات وأوبر',
    Materials: 'شراء خامات عاجلة',
    Labor: 'بقشيش وعمالة مؤقتة',
    Overheads: 'ضيافة ومأكولات'
  };

  sorted.forEach(t => {
    const ev = state.events.find(e => e.id === t.eventId);
    const evName = ev ? ev.name : 'فعالية غير معرفة';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-weight: 500;" class="clickable-event" onclick="openEventCostSheet('${t.eventId}')">${evName}</td>
      <td><span class="badge badge-primary">${categoryLabels[t.category] || t.category}</span></td>
      <td style="font-size: 13px;">${t.date}</td>
      <td style="max-width: 250px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;" title="${t.description}">${t.description}</td>
      <td style="font-weight: 700; color: var(--accent-danger);">${formatCurrency(t.amount)}</td>
      <td style="text-align: center;">
        ${t.receiptImage ? `<img src="${t.receiptImage}" class="receipt-thumbnail" onclick="openLightbox('${t.receiptImage}')" title="اضغط لعرض إيصال الصرف">` : `<span class="no-receipt-placeholder">لا توجد صورة</span>`}
      </td>
      <td>
        <button class="btn btn-secondary btn-sm" style="color: var(--accent-danger);" onclick="deleteERPTransaction('${t.id}', 'pettylog')">🗑️ حذف</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function compressAndSaveImage(file, callback) {
  const reader = new FileReader();
  reader.onload = function(event) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      const maxDim = 600;
      
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      
      const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
      callback(compressedBase64);
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
}

window.openLightbox = function(src) {
  const modal = document.getElementById('modal-lightbox');
  const img = document.getElementById('lightbox-image');
  if (modal && img) {
    img.src = src;
    modal.classList.add('active');
  }
};

window.openQuickExpenseModal = function(categoryKey, categoryNameAr) {
  const eventSelect = document.getElementById('sheet-event-select');
  if (!eventSelect) return;
  const selectedEvId = eventSelect.value;
  const event = state.events.find(e => e.id === selectedEvId);
  if (!event) return;

  document.getElementById('quick-expense-cat-title').innerText = categoryNameAr;
  document.getElementById('quick-expense-cat-key').value = categoryKey;
  document.getElementById('quick-expense-event-name').value = event.name;
  
  // Set default values
  document.getElementById('quick-expense-amount').value = '';
  document.getElementById('quick-expense-desc').value = '';
  document.getElementById('quick-expense-date').value = new Date().toISOString().split('T')[0];

  openModal('modal-category-expense');
};

// --- 4. OPERATIONS PANEL (Tasks, Vendors, Crew) ---
function renderOperations() {
  const activeSubTab = document.querySelector('#view-operations .sub-tab-btn.active').getAttribute('data-sub');
  
  if (activeSubTab === 'tasks') {
    renderTasksSection();
  } else if (activeSubTab === 'vendors') {
    renderVendorsSection();
  } else if (activeSubTab === 'crew') {
    renderCrewSection();
  }
}

// Sub-Tab 1: Tasks Checklist
function renderTasksSection() {
  const select = document.getElementById('task-event-select');
  const previousSelection = select.value;
  
  select.innerHTML = '';

  if (state.events.length === 0) {
    select.innerHTML = '<option value="">لا توجد مناسبات مضافة</option>';
    document.getElementById('event-tasks-container').innerHTML = '<div style="text-align: center; padding: 20px; color: var(--text-secondary);">يرجى تسجيل فعالية أولاً.</div>';
    return;
  }

  state.events.forEach(ev => {
    const opt = document.createElement('option');
    opt.value = ev.id;
    opt.innerText = ev.name;
    select.appendChild(opt);
  });

  if (previousSelection && state.events.some(e => e.id === previousSelection)) {
    select.value = previousSelection;
  }

  const selectedEvId = select.value;
  const eventTasks = state.tasks.filter(t => t.eventId === selectedEvId);
  const totalTasks = eventTasks.length;
  const completedTasks = eventTasks.filter(t => t.status === 'completed').length;
  const completionPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  document.getElementById('event-task-completion-stats').innerText = `المهام المنجزة: ${completedTasks} من إجمالي ${totalTasks} (${completionPct}%)`;

  const container = document.getElementById('event-tasks-container');
  container.innerHTML = '';

  if (eventTasks.length === 0) {
    container.innerHTML = '<div style="text-align: center; padding: 20px; color: var(--text-secondary);">لا توجد أي مهام تنظيمية مسجلة لهذه الفعالية حالياً. قم بإضافة مهمة للبدء.</div>';
    return;
  }

  const categoryIcons = {
    Catering: '🍽️ بوفيه',
    Decor: '🌹 ديكور',
    SoundLight: '🎤 صوت وضوء',
    Staffing: '👷 تنظيم',
    Logistics: '🚚 شحن ونقل'
  };

  eventTasks.forEach(task => {
    const item = document.createElement('div');
    item.className = 'task-item';
    
    const isCompleted = task.status === 'completed';

    item.innerHTML = `
      <div class="task-checkbox-container" onclick="toggleTaskStatus('${task.id}')">
        <input type="checkbox" class="task-checkbox" ${isCompleted ? 'checked' : ''}>
        <span class="task-title-text ${isCompleted ? 'completed' : ''}">${task.title}</span>
      </div>
      <div class="task-actions">
        <span class="badge badge-secondary" style="font-size:11px;">${categoryIcons[task.category] || task.category}</span>
        <span style="font-size:12px; color: var(--text-secondary);">👤 المسؤول: ${task.assignedTo}</span>
        <button class="btn btn-secondary btn-sm" style="color:var(--accent-danger); padding:4px 8px; margin-right: 10px;" onclick="deleteTask('${task.id}')">🗑️</button>
      </div>
    `;
    container.appendChild(item);
  });
}

window.toggleTaskStatus = function(taskId) {
  const task = state.tasks.find(t => t.id === taskId);
  if (task) {
    task.status = task.status === 'completed' ? 'pending' : 'completed';
    saveERPState();
    renderTasksSection();
    renderDashboard(); // update overall dashboard percentages
  }
};

window.deleteTask = function(taskId) {
  event.stopPropagation(); // prevent triggering status toggle
  if (confirm('هل أنت متأكد من حذف هذه المهمة؟')) {
    state.tasks = state.tasks.filter(t => t.id !== taskId);
    saveERPState();
    renderTasksSection();
    renderDashboard();
  }
};

// Sub-Tab 2: Vendors
function renderVendorsSection() {
  const tbody = document.getElementById('vendors-table-body');
  tbody.innerHTML = '';

  if (state.vendors.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:var(--text-secondary);">لا توجد موردين مسجلين بعد.</td></tr>';
    return;
  }

  state.vendors.forEach(vendor => {
    // Calculate total transactional volume linked to this vendor name in transactions
    const vendorTxs = state.transactions.filter(t => t.description.includes(vendor.name));
    const totalVolume = vendorTxs.reduce((acc, cur) => acc + cur.amount, 0);

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-weight:600;">${vendor.name}</td>
      <td><span class="badge badge-primary">${vendor.serviceType}</span></td>
      <td style="font-family:monospace;">${vendor.contact}</td>
      <td style="font-weight:600;">${formatCurrency(totalVolume)}</td>
      <td>
        <button class="btn btn-secondary btn-sm" style="color: var(--accent-danger);" onclick="deleteVendor('${vendor.id}')">🗑️ حذف</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

window.deleteVendor = function(id) {
  if (confirm('هل تريد حذف هذا المورد من الدليل؟')) {
    state.vendors = state.vendors.filter(v => v.id !== id);
    saveERPState();
    renderVendorsSection();
  }
};

// Sub-Tab 3: Crew Staff
function renderCrewSection() {
  const tbody = document.getElementById('crew-table-body');
  tbody.innerHTML = '';

  if (state.crew.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:var(--text-secondary);">لا توجد أعضاء منظمين مسجلين.</td></tr>';
    return;
  }

  const roleLabels = {
    Coordinator: 'منسق عام',
    Hostess: 'مضيف استقبال',
    Supervisor: 'مشرف قاعة',
    SoundEng: 'مهندس صوتيات'
  };

  state.crew.forEach(member => {
    const assignedEv = state.events.find(e => e.id === member.currentEventId);
    const eventName = assignedEv ? assignedEv.name : 'غير مسند لحفلة حالية';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-weight:600;">${member.name}</td>
      <td><span class="badge badge-success">${roleLabels[member.role] || member.role}</span></td>
      <td>${formatCurrency(member.dailyRate)} / حفلة</td>
      <td style="font-family:monospace;">${member.phone}</td>
      <td style="font-size:13px; font-weight: 500;" class="${assignedEv ? 'clickable-event' : ''}" onclick="${assignedEv ? `openEventCostSheet('${member.currentEventId}')` : ''}">
        ${eventName}
      </td>
      <td>
        <div style="display:flex; gap:8px;">
          <button class="btn btn-secondary btn-sm" onclick="openAssignCrewModal('${member.id}')">Assign</button>
          <button class="btn btn-secondary btn-sm" style="color: var(--accent-danger);" onclick="deleteCrewMember('${member.id}')">🗑️</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

window.deleteCrewMember = function(id) {
  if (confirm('هل تريد استبعاد هذا المنظم؟')) {
    state.crew = state.crew.filter(c => c.id !== id);
    saveERPState();
    renderCrewSection();
  }
};

// Open Quick Crew Assignment
window.openAssignCrewModal = function(crewId) {
  const member = state.crew.find(c => c.id === crewId);
  if (!member) return;

  const eventList = state.events.map(e => `"${e.name}"`).join('\n');
  const selection = prompt(`إسناد المنظم "${member.name}" لفعالية نشطة. اختر اسماً من القائمة الحالية وكتابته بدقة:\n\n${eventList}\n\nأو اكتب "none" لإلغاء الإسناد:`);
  
  if (selection === null) return; // cancel

  if (selection.toLowerCase() === 'none') {
    member.currentEventId = '';
    saveERPState();
    renderCrewSection();
    alert('تم إلغاء تعيين الموظف بنجاح.');
    return;
  }

  const targetEvent = state.events.find(e => e.name.includes(selection) || selection.includes(e.name));
  if (targetEvent) {
    member.currentEventId = targetEvent.id;
    saveERPState();
    renderCrewSection();
    alert(`تم إسناد ${member.name} بنجاح إلى حفلة "${targetEvent.name}"`);
  } else {
    alert('خطأ! لم يتم العثور على حفلة مطابقة للاسم المدخل.');
  }
};

// --- 5. WAREHOUSE & RENTALS VIEW ---
function renderWarehouse() {
  const activeSubTab = document.querySelector('#view-warehouse .sub-tab-btn.active').getAttribute('data-sub');

  if (activeSubTab === 'inv-list') {
    renderConsumablesWarehouse();
  } else if (activeSubTab === 'rental-assets') {
    renderRentalAssetsWarehouse();
  } else if (activeSubTab === 'asset-allocations') {
    renderAssetAllocations();
  }
}

// Sub-Tab 1: Consumables
function renderConsumablesWarehouse() {
  const tbody = document.getElementById('consumable-inventory-tbody');
  tbody.innerHTML = '';

  if (state.consumables.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:var(--text-secondary);">لا توجد مستلزمات مستهلكة بالجدول.</td></tr>';
    return;
  }

  state.consumables.forEach(item => {
    const totalVal = item.qty * item.cost;
    let statusBadge = '<span class="badge badge-success">متوفر</span>';
    if (item.qty === 0) {
      statusBadge = '<span class="badge badge-danger">منفذ بالكامل</span>';
    } else if (item.qty <= item.minStock) {
      statusBadge = '<span class="badge badge-warning">ناقص / اطلب الآن</span>';
    }

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-weight:600;">${item.name}</td>
      <td style="font-family:monospace;">${item.sku}</td>
      <td style="font-weight:500;">${item.qty} وحدة</td>
      <td>${formatCurrency(item.cost)}</td>
      <td style="font-weight:600;">${formatCurrency(totalVal)}</td>
      <td>${statusBadge}</td>
      <td>
        <button class="btn btn-secondary btn-sm" style="color:var(--accent-danger);" onclick="deleteWarehouseItem('${item.id}', 'consumables')">🗑️ حذف</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Sub-Tab 2: Rental Assets
function renderRentalAssetsWarehouse() {
  const tbody = document.getElementById('rental-assets-tbody');
  tbody.innerHTML = '';

  if (state.rentalAssets.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:var(--text-secondary);">لا توجد أصول ومعدات مؤجرة مسجلة.</td></tr>';
    return;
  }

  state.rentalAssets.forEach(asset => {
    const available = asset.totalQty - asset.rentedQty;
    const totalAssetVal = asset.totalQty * asset.cost;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-weight:600;">${asset.name}</td>
      <td>${asset.totalQty} قطعة</td>
      <td style="color:var(--accent-warning); font-weight:600;">${asset.rentedQty} قطعة للخارج</td>
      <td style="color:var(--accent-primary); font-weight:700;">${available} قطعة جاهزة</td>
      <td>${formatCurrency(asset.cost)} / قطعة</td>
      <td style="font-weight:600;">${formatCurrency(totalAssetVal)}</td>
      <td>
        <button class="btn btn-secondary btn-sm" style="color:var(--accent-danger);" onclick="deleteWarehouseItem('${asset.id}', 'rentals')">🗑️ حذف</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

window.deleteWarehouseItem = function(id, type) {
  if (confirm('هل أنت متأكد من حذف هذا الصنف من المخازن؟')) {
    if (type === 'consumables') {
      state.consumables = state.consumables.filter(c => c.id !== id);
    } else {
      state.rentalAssets = state.rentalAssets.filter(a => a.id !== id);
    }
    saveERPState();
    renderWarehouse();
    renderDashboard();
  }
};

// Sub-Tab 3: Rental Allocations & returns
function renderAssetAllocations() {
  const tbody = document.getElementById('asset-allocations-tbody');
  tbody.innerHTML = '';

  if (state.rentalAllocations.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:var(--text-secondary);">لا توجد حركات إعارة حالية للأصول.</td></tr>';
    return;
  }

  const sortedAllocations = [...state.rentalAllocations].sort((a,b) => new Date(b.deployDate) - new Date(a.deployDate));

  sortedAllocations.forEach(alc => {
    const isReturned = alc.status === 'returned';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-weight:500;" class="clickable-event" onclick="openEventCostSheet('${alc.eventId}')">${alc.eventName}</td>
      <td style="font-weight:600;">${alc.assetName}</td>
      <td style="font-weight:600;">${alc.qty} قطعة</td>
      <td style="font-size:13px;">${alc.deployDate}</td>
      <td style="font-size:13px; color: ${!isReturned ? 'var(--accent-warning)' : 'inherit'};">${alc.expectedReturnDate}</td>
      <td>
        <span class="badge ${isReturned ? 'badge-success' : 'badge-danger'}">
          ${isReturned ? '🟢 تم الإرجاع' : '🔴 قيد الاستعارة خارجياً'}
        </span>
      </td>
      <td>
        ${!isReturned ? `<button class="btn btn-primary btn-sm" onclick="returnRentalAsset('${alc.id}')">📥 استلام للمخزن</button>` : `<span style="color:var(--text-muted); font-size:12px;">مغلق</span>`}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

window.returnRentalAsset = function(allocationId) {
  const alc = state.rentalAllocations.find(a => a.id === allocationId);
  if (!alc) return;

  const asset = state.rentalAssets.find(a => a.id === alc.assetId);
  if (asset) {
    // 1. Restore inventory levels
    asset.rentedQty = Math.max(0, asset.rentedQty - alc.qty);
    
    // 2. Mark allocation completed
    alc.status = 'returned';
    
    saveERPState();
    renderWarehouse();
    renderDashboard();
    
    alert(`تم استلام عدد ${alc.qty} من "${alc.assetName}" بنجاح وإعادتها لأرصدة المخزن!`);
  }
};

// --- GLOBAL MODALS TRIGGERS & FORM HANDLERS ---
window.openModal = function(modalId) {
  const overlay = document.getElementById(modalId);
  if (overlay) {
    overlay.classList.add('active');
    
    // Initializer triggers
    if (modalId === 'modal-deploy-asset') {
      setupAssetDeploymentModal();
    }
  }
};

window.closeModal = function(modalId) {
  const overlay = document.getElementById(modalId);
  if (overlay) overlay.classList.remove('active');
};

function setupAssetDeploymentModal() {
  const assetSelect = document.getElementById('dep-asset');
  const eventSelect = document.getElementById('dep-event');
  const qtyInput = document.getElementById('dep-qty');
  const infoPara = document.getElementById('deploy-info');

  assetSelect.innerHTML = '<option value="" disabled selected>اختر الأصل المراد صرفه...</option>';
  state.rentalAssets.forEach(ast => {
    const avail = ast.totalQty - ast.rentedQty;
    const opt = document.createElement('option');
    opt.value = ast.id;
    opt.innerText = `${ast.name} (${avail} متاح)`;
    assetSelect.appendChild(opt);
  });

  eventSelect.innerHTML = '<option value="" disabled selected>اختر الفعالية المستلمة...</option>';
  state.events.forEach(ev => {
    const opt = document.createElement('option');
    opt.value = ev.id;
    opt.innerText = ev.name;
    eventSelect.appendChild(opt);
  });

  qtyInput.value = '';
  infoPara.innerHTML = 'اختر الصنف والكمية لعرض تقديرات الصرف.';

  const updateDeployDetails = () => {
    const assetId = assetSelect.value;
    const qtyVal = parseInt(qtyInput.value) || 0;
    const selectedAsset = state.rentalAssets.find(a => a.id === assetId);

    if (selectedAsset) {
      const avail = selectedAsset.totalQty - selectedAsset.rentedQty;
      const totalUseCost = qtyVal * selectedAsset.cost;
      const isOver = qtyVal > avail;

      infoPara.innerHTML = `
        المتاح حالياً بالمخزن: <span style="font-weight:700;">${avail} قطعة</span><br>
        سعر تكلفة استهلاك الصرف: <span style="font-weight:700; color:var(--accent-primary);">${formatCurrency(totalUseCost)}</span>
      `;

      if (isOver) {
        infoPara.innerHTML += `<br><span style="color:var(--accent-danger); font-weight:600;">⚠️ عجز! الكمية المطلوبة تتعدى الرصيد المتاح.</span>`;
      }
    }
  };

  assetSelect.onchange = updateDeployDetails;
  qtyInput.oninput = updateDeployDetails;
}

// Open category budget updates panel
window.openCategoryBudgetsModal = function() {
  const select = document.getElementById('sheet-event-select');
  const eventId = select.value;
  const event = state.events.find(e => e.id === eventId);
  if (!event) return;

  document.getElementById('budget-edit-event-id').value = event.id;
  document.getElementById('budget-edit-event-name').innerText = event.name;
  document.getElementById('budget-edit-event-total').innerText = formatCurrency(event.totalContractValue);

  const cats = ['Materials', 'Labor', 'Equipment', 'Logistics', 'Overheads'];
  cats.forEach(c => {
    document.getElementById(`budget-val-${c}`).value = event.categoryBudgets[c] || 0;
  });

  document.getElementById('budget-sum-warning').innerText = '';

  openModal('modal-edit-budgets');
};

function initForms() {
  // Add Event Form
  document.getElementById('form-add-event').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('ev-name').value;
    const client = document.getElementById('ev-client').value;
    const phone = document.getElementById('ev-phone').value;
    const date = document.getElementById('ev-date').value;
    const guests = parseInt(document.getElementById('ev-guests').value) || 150;
    const revenue = parseFloat(document.getElementById('ev-revenue').value) || 0;

    // Default total expenses estimation is 60% of contract revenue
    const expenseEst = Math.round(revenue * 0.60);
    const newEvent = {
      id: 'evt_' + Date.now(),
      name: name,
      clientName: client,
      clientPhone: phone,
      eventDate: date,
      venue: document.getElementById('ev-venue').value,
      guestCount: guests,
      totalContractValue: revenue,
      categoryBudgets: {
        Materials: Math.round(expenseEst * 0.40),
        Labor: Math.round(expenseEst * 0.20),
        Equipment: Math.round(expenseEst * 0.20),
        Logistics: Math.round(expenseEst * 0.15),
        Overheads: Math.round(expenseEst * 0.05)
      },
      status: 'planning'
    };

    state.events.push(newEvent);
    saveERPState();
    closeModal('modal-event');
    this.reset();
    
    // Refresh current view
    const currentActiveView = document.querySelector('.nav-item.active').getAttribute('data-view');
    renderView(currentActiveView);
    if (currentActiveView !== 'dashboard') {
      renderDashboard(); // background sync
    }

    alert('تم تسجيل حجز المناسبة بنظام الـ ERP بنجاح!');
  });

  // Add Transaction Form
  document.getElementById('form-add-transaction').addEventListener('submit', function(e) {
    e.preventDefault();
    const eventId = document.getElementById('tx-event').value;
    const type = document.getElementById('tx-type').value;
    const category = document.getElementById('tx-category').value;
    const amount = parseFloat(document.getElementById('tx-amount').value) || 0;
    const date = document.getElementById('tx-date').value;
    const description = document.getElementById('tx-description').value;

    const newTx = {
      id: 'tx_' + Date.now(),
      eventId,
      type,
      category,
      amount,
      date,
      description,
      addedBy: 'المحاسب المالي'
    };

    state.transactions.push(newTx);
    saveERPState();
    this.reset();
    
    document.getElementById('tx-date').value = new Date().toISOString().split('T')[0];

    renderLedger();
    renderDashboard();
    
    alert('تم قيد الحركة بنجاح في السجلات اليومية!');
  });

  // Add Event Task checklist
  document.getElementById('form-add-task').addEventListener('submit', function(e) {
    e.preventDefault();
    const eventSelect = document.getElementById('task-event-select');
    const eventId = eventSelect.value;
    const title = document.getElementById('task-title').value;
    const category = document.getElementById('task-category').value;
    const assigned = document.getElementById('task-assigned').value;

    const newTask = {
      id: 'tsk_' + Date.now(),
      eventId,
      title,
      category,
      status: 'pending',
      assignedTo: assigned
    };

    state.tasks.push(newTask);
    saveERPState();
    closeModal('modal-add-task');
    this.reset();
    renderTasksSection();
    renderDashboard();

    alert('تم إدراج المهمة بنجاح.');
  });

  // Add Vendor Form
  document.getElementById('form-add-vendor').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('vendor-name').value;
    const service = document.getElementById('vendor-service').value;
    const phone = document.getElementById('vendor-phone').value;

    const newVendor = {
      id: 'ven_' + Date.now(),
      name,
      serviceType: service,
      contact: phone,
      balance: 0
    };

    state.vendors.push(newVendor);
    saveERPState();
    closeModal('modal-vendor');
    this.reset();
    renderVendorsSection();

    alert('تم تسجيل المورد في دليل الاتصال المعتمد.');
  });

  // Add Crew Staff Form
  document.getElementById('form-add-crew').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('crew-name').value;
    const role = document.getElementById('crew-role').value;
    const rate = parseFloat(document.getElementById('crew-rate').value) || 500;
    const phone = document.getElementById('crew-phone').value;

    const newCrew = {
      id: 'crw_' + Date.now(),
      name,
      role,
      dailyRate: rate,
      phone,
      currentEventId: ''
    };

    state.crew.push(newCrew);
    saveERPState();
    closeModal('modal-crew');
    this.reset();
    renderCrewSection();

    alert('تم تسجيل الموظف بقاعدة المنظمين بنجاح.');
  });

  // Add Consumable or Rental item to warehouse
  document.getElementById('form-wh-item').addEventListener('submit', function(e) {
    e.preventDefault();
    const type = document.getElementById('wh-item-type').value;
    const name = document.getElementById('wh-item-name').value;
    const sku = document.getElementById('wh-item-sku').value;
    const qty = parseFloat(document.getElementById('wh-item-qty').value) || 0;
    const cost = parseFloat(document.getElementById('wh-item-cost').value) || 0;
    const min = parseFloat(document.getElementById('wh-item-min').value) || 5;

    if (type === 'consumable') {
      const newItem = {
        id: 'con_' + Date.now(),
        name,
        sku,
        qty,
        cost,
        minStock: min
      };
      state.consumables.push(newItem);
    } else {
      const newItem = {
        id: 'ast_' + Date.now(),
        name,
        sku,
        totalQty: qty,
        rentedQty: 0,
        cost
      };
      state.rentalAssets.push(newItem);
    }

    saveERPState();
    closeModal('modal-warehouse-item');
    this.reset();
    renderWarehouse();
    renderDashboard();

    alert('تم إضافة الصنف للمستودع وتحديث جداول الجرد.');
  });

  // Deploy Rental Asset to Event
  document.getElementById('form-deploy-asset').addEventListener('submit', function(e) {
    e.preventDefault();
    const assetId = document.getElementById('dep-asset').value;
    const eventId = document.getElementById('dep-event').value;
    const qty = parseInt(document.getElementById('dep-qty').value) || 0;
    const returnDate = document.getElementById('dep-return-date').value;

    const asset = state.rentalAssets.find(a => a.id === assetId);
    const event = state.events.find(e => e.id === eventId);

    if (!asset || !event) return;
    
    const avail = asset.totalQty - asset.rentedQty;
    if (qty > avail) {
      alert('عذرًا! الرصيد المتاح من هذا الأصل لا يكفي لصرفه لهذه الحفلة حالياً.');
      return;
    }

    // 1. Increment Rented status
    asset.rentedQty += qty;

    // 2. Add Allocation Log
    const newAlloc = {
      id: 'alc_' + Date.now(),
      eventId: event.id,
      eventName: event.name,
      assetId: asset.id,
      assetName: asset.name,
      qty,
      deployDate: new Date().toISOString().split('T')[0],
      expectedReturnDate: returnDate,
      status: 'deployed'
    };
    state.rentalAllocations.push(newAlloc);

    // 3. Optional: Add an automated internal expense for logging/accounting purposes
    const usageCost = qty * asset.cost;
    const newTx = {
      id: 'tx_auto_' + Date.now(),
      eventId: event.id,
      type: 'expense',
      category: 'Equipment',
      amount: usageCost,
      date: new Date().toISOString().split('T')[0],
      description: `صرف أصول للموقع: ${asset.name} (عدد ${qty} قطعة بقيمة استخدام تقديرية ${formatCurrency(asset.cost)}/قطعة)`,
      addedBy: 'النظام (حركة أصول)'
    };
    state.transactions.push(newTx);

    saveERPState();
    closeModal('modal-deploy-asset');
    this.reset();
    renderWarehouse();
    renderDashboard();

    alert(`تم إعارة وصرف الأصول بنجاح لصالح الحفلة، وتسجيل تكلفة تشغيل تقديرية قدرها ${formatCurrency(usageCost)} كبند مصروفات.`);
  });

  // Edit category budgets
  document.getElementById('form-edit-budgets').addEventListener('submit', function(e) {
    e.preventDefault();
    const eventId = document.getElementById('budget-edit-event-id').value;
    const event = state.events.find(e => e.id === eventId);
    if (!event) return;

    const cats = ['Materials', 'Labor', 'Equipment', 'Logistics', 'Overheads'];
    const newBudgets = {};
    let sum = 0;
    
    cats.forEach(c => {
      const val = parseFloat(document.getElementById(`budget-val-${c}`).value) || 0;
      newBudgets[c] = val;
      sum += val;
    });

    // Check sum constraints
    // For Event planning, total expenses budgets are flexible, but we warn if it exceeds the contract value!
    if (sum > event.totalContractValue) {
      const warningNode = document.getElementById('budget-sum-warning');
      warningNode.innerText = `تنبيه: مجموع ميزانيات المصاريف المقترحة (${formatCurrency(sum)}) يتخطى إجمالي قيمة العقد المتفق عليها مع العميل (${formatCurrency(event.totalContractValue)}). هذا يعني حتمية خسارة الفعالية ماليًا!`;
      return;
    }

    event.categoryBudgets = newBudgets;
    saveERPState();
    closeModal('modal-edit-budgets');
    
    renderEventSheets();
    renderDashboard();
    
    alert('تم إعادة تخصيص ميزانيات البنود والخدمات بنجاح!');
  });
}

// Live feedback on budget configurations
function initBudgetFieldsChangeMonitor() {
  const inputs = document.querySelectorAll('.budget-input-field');
  inputs.forEach(inp => {
    inp.addEventListener('input', () => {
      const eventId = document.getElementById('budget-edit-event-id').value;
      const event = state.events.find(e => e.id === eventId);
      if (!event) return;

      const cats = ['Materials', 'Labor', 'Equipment', 'Logistics', 'Overheads'];
      let sum = 0;
      cats.forEach(c => {
        sum += parseFloat(document.getElementById(`budget-val-${c}`).value) || 0;
      });

      const warningNode = document.getElementById('budget-sum-warning');
      const margin = event.totalContractValue - sum;
      const marginPct = event.totalContractValue > 0 ? Math.round((margin / event.totalContractValue) * 100) : 0;

      if (sum > event.totalContractValue) {
        warningNode.style.color = 'var(--accent-danger)';
        warningNode.innerText = `تنبيه الخسارة! مجموع المصاريف: ${formatCurrency(sum)} يتجاوز إيراد العقد: ${formatCurrency(event.totalContractValue)}`;
      } else {
        warningNode.style.color = 'var(--accent-primary)';
        warningNode.innerText = `مجموع المصاريف الموزعة: ${formatCurrency(sum)} | هامش الربح المقدر: ${formatCurrency(margin)} (${marginPct}%)`;
      }
    });
  });
}

// Export/Import event sheet to CSV file format
function initCSVExport() {
  const btnExport = document.getElementById('btn-export-sheet');
  if (btnExport) {
    btnExport.addEventListener('click', () => {
      const select = document.getElementById('sheet-event-select');
      const eventId = select.value;
      const event = state.events.find(e => e.id === eventId);
      if (!event) return;

      const evTxs = state.transactions.filter(t => t.eventId === event.id);
      
      let csvContent = "\uFEFF"; // UTF-8 BOM
      csvContent += "تقرير الأرباح والتكاليف المخصص للحفلة\n";
      csvContent += `اسم الفعالية,${event.name}\n`;
      csvContent += `تاريخ المناسبة,${event.eventDate}\n`;
      csvContent += `العميل المتعاقد,${event.clientName}\n`;
      csvContent += `قيمة عقد العميل الإجمالي,${event.totalContractValue}\n\n`;
      
      csvContent += "القسم البند,الميزانية المرصودة للتنفيذ,المنصرف الفعلي المالي,المتبقي للقسم\n";
      const cats = {
        Materials: 'الخامات والديكورات والورد',
        Labor: 'المنظمين والعمال المباشرين',
        Equipment: 'أنظمة الصوت والإضاءة والمسارح',
        Logistics: 'النقل والخدمات اللوجستية',
        Overheads: 'حجوزات الصالات والعموميات'
      };
      
      Object.keys(cats).forEach(cat => {
        const budget = event.categoryBudgets[cat] || 0;
        const spent = evTxs.filter(e => e.type === 'expense' && e.category === cat).reduce((acc, cur) => acc + cur.amount, 0);
        const variance = budget - spent;
        csvContent += `${cats[cat]},${budget},${spent},${variance}\n`;
      });
      
      csvContent += "\nتفاصيل الحسابات المالية (إيرادات ومصاريف)\n";
      csvContent += "التاريخ,نوع العملية,البند المالي,البيان / الوصف,القيمة المالية\n";
      
      evTxs.forEach(tx => {
        const typeLabel = tx.type === 'revenue' ? 'إيراد قبض' : 'صرف ومصروف';
        const catLabel = tx.category === 'ClientPayment' ? 'دفعة العميل المستلمة' : (cats[tx.category] || tx.category);
        csvContent += `${tx.date},${typeLabel},${catLabel},"${tx.description.replace(/"/g, '""')}",${tx.amount}\n`;
      });

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const encodedUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUrl);
      link.setAttribute("download", `event_report_${event.name.replace(/\s+/g, '_')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // Import CSV Trigger
  const btnImport = document.getElementById('btn-import-sheet');
  const fileImport = document.getElementById('file-import-sheet');
  if (btnImport && fileImport) {
    btnImport.addEventListener('click', () => {
      fileImport.click();
    });

    fileImport.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function(evt) {
        const csvText = evt.target.result;
        parseCSVAndImport(csvText);
        fileImport.value = ''; // Reset file input
      };
      reader.readAsText(file, 'UTF-8');
    });
  }
}

// Robust CSV Line Parser
function parseCSVLine(text) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// Core Import Logic
function parseCSVAndImport(csvText) {
  const eventSelect = document.getElementById('sheet-event-select');
  if (!eventSelect) return;
  const selectedEvId = eventSelect.value;
  const event = state.events.find(e => e.id === selectedEvId);
  if (!event) {
    alert('الرجاء اختيار حفلة أولاً ليتم الاستيراد إليها!');
    return;
  }

  const lines = csvText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  let totalContractValue = null;
  const budgets = {
    Materials: 0,
    Labor: 0,
    Equipment: 0,
    Logistics: 0,
    Overheads: 0
  };
  
  const categoryMap = {
    'الخامات والديكورات والورد': 'Materials',
    'المنظمين والعمال المباشرين': 'Labor',
    'أنظمة الصوت والإضاءة والمسارح': 'Equipment',
    'أنظمة الصوت والاضاءة والمسارح': 'Equipment',
    'النقل والخدمات اللوجستية': 'Logistics',
    'الشحن والنقل والضيافة': 'Logistics',
    'حجوزات الصالات والعموميات': 'Overheads'
  };

  const newTransactions = [];
  let parsingTransactions = false;

  lines.forEach(line => {
    const parts = parseCSVLine(line);
    if (parts.length === 0) return;

    // 1. Parse Contract Value
    if (parts[0].includes('قيمة عقد العميل الإجمالي')) {
      const val = parseFloat(parts[1].replace(/[^\d.]/g, ''));
      if (!isNaN(val)) totalContractValue = val;
    }

    // 2. Parse budgets
    const mappedKey = categoryMap[parts[0]];
    if (mappedKey && !parsingTransactions) {
      const budgetVal = parseFloat(parts[1].replace(/[^\d.]/g, ''));
      if (!isNaN(budgetVal)) budgets[mappedKey] = budgetVal;
    }

    // 3. Parse transactions
    if (parts[0].includes('تفاصيل الحسابات المالية')) {
      parsingTransactions = true;
      return;
    }

    if (parsingTransactions && parts.length >= 5) {
      const date = parts[0];
      const typeLabel = parts[1];
      const categoryLabel = parts[2];
      const description = parts[3];
      const amountVal = parseFloat(parts[4].replace(/[^\d.]/g, ''));

      // Skip header row
      if (date === 'التاريخ' || isNaN(amountVal)) return;

      const type = typeLabel.includes('قبض') || typeLabel.includes('إيراد') ? 'revenue' : 'expense';
      
      let category = 'Overheads';
      if (categoryLabel.includes('سداد') || categoryLabel.includes('العميل')) {
        category = 'ClientPayment';
      } else {
        const catKey = Object.keys(categoryMap).find(k => categoryLabel.includes(k));
        if (catKey) category = categoryMap[catKey];
      }

      newTransactions.push({
        id: 'tx_' + Date.now() + '_' + Math.round(Math.random() * 100000),
        eventId: event.id,
        type: type,
        category: category,
        amount: amountVal,
        date: date,
        description: description,
        addedBy: 'استيراد CSV'
      });
    }
  });

  // Apply parsed data to state
  if (totalContractValue !== null) {
    event.totalContractValue = totalContractValue;
  }
  
  event.categoryBudgets = budgets;

  // Replace transactions for this event if any new ones were parsed
  if (newTransactions.length > 0) {
    state.transactions = state.transactions.filter(t => t.eventId !== event.id).concat(newTransactions);
  }

  saveERPState();
  renderEventSheets();
  renderDashboard();
  alert('تم استيراد شيت التكاليف بنجاح وتحديث ميزانيات البنود والمعاملات المالية للحفلة!');
}

// --- AUTHENTICATION MODULE (6 Users / Passwords) ---
const AUTH_KEY = 'tokens_erp_authenticated_user';
const USERS_DB = [
  { username: 'admin', password: 'admin123', role: 'مدير النظام' },
  { username: 'owner', password: 'owner123', role: 'مالك الشركة' },
  { username: 'operation', password: 'op123', role: 'مسؤول العمليات' },
  { username: 'coordinator', password: 'coord123', role: 'منسق الحفلات' },
  { username: 'accountant', password: 'acc123', role: 'المحاسب المالي' },
  { username: 'guest', password: 'guest123', role: 'مستخدم زائر' }
];

function checkAuthentication() {
  const sessionUser = sessionStorage.getItem(AUTH_KEY);
  const loginScreen = document.getElementById('login-screen');
  
  if (sessionUser) {
    if (loginScreen) loginScreen.style.display = 'none';
    const avatar = document.querySelector('.avatar');
    if (avatar) {
      avatar.innerText = sessionUser.substring(0, 2).toUpperCase();
      avatar.title = `مرحباً بك: ${sessionUser}`;
    }
  } else {
    if (loginScreen) loginScreen.style.display = 'flex';
  }
}

// App DOM Loaded Initializer
document.addEventListener('DOMContentLoaded', () => {
  checkAuthentication();
  loadERPState();

  // Set default dates
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('tx-date').value = today;
  document.getElementById('petty-date').value = today;

  // Initialize Modules
  initNavigation();
  initForms();
  initBudgetFieldsChangeMonitor();
  initCSVExport();

  // Global Actions Triggers
  document.getElementById('btn-global-new-event').addEventListener('click', () => {
    document.getElementById('form-add-event').reset();
    document.getElementById('ev-date').value = today;
    openModal('modal-event');
  });

  document.getElementById('btn-global-new-transaction').addEventListener('click', () => {
    // Switch to ledger view
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(n => n.classList.remove('active'));
    const ledgerTab = Array.from(navItems).find(n => n.getAttribute('data-view') === 'ledger');
    if (ledgerTab) ledgerTab.classList.add('active');

    const sections = document.querySelectorAll('.view-section');
    sections.forEach(s => s.classList.remove('active'));
    document.getElementById('view-ledger').classList.add('active');
    
    document.getElementById('page-current-title').innerText = 'دفتر المعاملات والقيود المالية';
    
    renderLedger();
    
    setTimeout(() => {
      document.getElementById('tx-amount').focus();
    }, 100);
  });

  // Event sheet page selector change trigger
  document.getElementById('sheet-event-select').addEventListener('change', () => {
    renderEventSheets();
  });

  // Ledger Search Input trigger
  document.getElementById('tx-search-input').addEventListener('input', function() {
    renderAllLedgerTable(this.value.toLowerCase().trim());
  });

  // Operations Buttons Triggers
  document.getElementById('btn-add-task').addEventListener('click', () => {
    document.getElementById('form-add-task').reset();
    openModal('modal-add-task');
  });

  document.getElementById('btn-add-vendor').addEventListener('click', () => {
    document.getElementById('form-add-vendor').reset();
    openModal('modal-vendor');
  });

  document.getElementById('btn-add-crew').addEventListener('click', () => {
    document.getElementById('form-add-crew').reset();
    openModal('modal-crew');
  });

  // Operations selector change triggers
  document.getElementById('task-event-select').addEventListener('change', () => {
    renderTasksSection();
  });

  // Warehouse Add Item buttons triggers
  document.getElementById('btn-add-consumable').addEventListener('click', () => {
    document.getElementById('wh-modal-title').innerText = 'إضافة مستلزم مستهلك للمخزن';
    document.getElementById('wh-item-type').value = 'consumable';
    document.getElementById('wh-min-stock-group').style.display = 'block';
    document.getElementById('form-wh-item').reset();
    openModal('modal-warehouse-item');
  });

  document.getElementById('btn-add-rental-asset').addEventListener('click', () => {
    document.getElementById('wh-modal-title').innerText = 'إضافة أصل / ديكور مؤجر للمخزن';
    document.getElementById('wh-item-type').value = 'rental';
    document.getElementById('wh-min-stock-group').style.display = 'none';
    document.getElementById('form-wh-item').reset();
    openModal('modal-warehouse-item');
  });

  document.getElementById('btn-deploy-rental-asset').addEventListener('click', () => {
    document.getElementById('form-deploy-asset').reset();
    document.getElementById('dep-return-date').value = today;
    openModal('modal-deploy-asset');
  });

  document.getElementById('btn-update-budgets').addEventListener('click', () => {
    openCategoryBudgetsModal();
  });

  // Petty Cash search input triggers
  const searchInput = document.getElementById('petty-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      renderPettyLog();
    });
  }

  // Petty Cash event filter dropdown trigger
  const pettyFilterEventEl = document.getElementById('petty-filter-event');
  if (pettyFilterEventEl) {
    pettyFilterEventEl.addEventListener('change', function() {
      renderPettyLog();
    });
  }

  // Petty Cash image upload change preview
  const pettyImageEl = document.getElementById('petty-image');
  if (pettyImageEl) {
    pettyImageEl.addEventListener('change', function(e) {
      const file = e.target.files[0];
      const previewContainer = document.getElementById('petty-image-preview');
      const previewImg = document.getElementById('petty-img-preview-tag');
      if (file && previewContainer && previewImg) {
        const reader = new FileReader();
        reader.onload = function(evt) {
          previewImg.src = evt.target.result;
          previewContainer.style.display = 'block';
        };
        reader.readAsDataURL(file);
      } else {
        previewContainer.style.display = 'none';
        previewImg.src = '';
      }
    });
  }

  // Petty Cash Form submit
  const formAddPettyEl = document.getElementById('form-add-pettycash');
  if (formAddPettyEl) {
    formAddPettyEl.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const eventId = document.getElementById('petty-event').value;
      const category = document.getElementById('petty-category').value;
      const amount = parseFloat(document.getElementById('petty-amount').value) || 0;
      const date = document.getElementById('petty-date').value;
      const description = document.getElementById('petty-description').value;
      const fileInput = document.getElementById('petty-image');
      
      if (fileInput.files.length === 0) {
        alert('الرجاء إرفاق صورة للفاتورة أو الإيصال لإثبات المصروف!');
        return;
      }
      
      const file = fileInput.files[0];
      
      compressAndSaveImage(file, function(compressedBase64) {
        const newTx = {
          id: 'tx_' + Date.now(),
          eventId: eventId,
          type: 'expense',
          category: category,
          amount: amount,
          date: date,
          description: description,
          addedBy: 'سحب مالي فوري',
          isPettyCash: true,
          receiptImage: compressedBase64
        };
        
        state.transactions.push(newTx);
        saveERPState();
        
        // Reset form and preview
        document.getElementById('form-add-pettycash').reset();
        document.getElementById('petty-date').value = today;
        document.getElementById('petty-image-preview').style.display = 'none';
        document.getElementById('petty-img-preview-tag').src = '';
        
        // Dynamic navigation redirection to log view
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(n => n.classList.remove('active'));
        const logTab = Array.from(navItems).find(n => n.getAttribute('data-view') === 'pettylog');
        if (logTab) logTab.classList.add('active');

        const sections = document.querySelectorAll('.view-section');
        sections.forEach(s => s.classList.remove('active'));
        const targetSection = document.getElementById('view-pettylog');
        if (targetSection) targetSection.classList.add('active');

        document.getElementById('page-current-title').innerText = 'سجل سحب المصروفات والنثرية وإيصالات الدفع';
        
        renderPettyLog();
        renderDashboard();
        
        alert('تم تسجيل عملية السحب النثري وحفظ صورة الفاتورة بنجاح!');
      });
    });
  }

  // Quick Expense Form submit
  const formQuickExpenseEl = document.getElementById('form-quick-expense');
  if (formQuickExpenseEl) {
    formQuickExpenseEl.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const eventSelect = document.getElementById('sheet-event-select');
      if (!eventSelect) return;
      const eventId = eventSelect.value;
      const category = document.getElementById('quick-expense-cat-key').value;
      const amount = parseFloat(document.getElementById('quick-expense-amount').value) || 0;
      const date = document.getElementById('quick-expense-date').value;
      const description = document.getElementById('quick-expense-desc').value;
      
      const newTx = {
        id: 'tx_' + Date.now(),
        eventId: eventId,
        type: 'expense',
        category: category,
        amount: amount,
        date: date,
        description: description,
        addedBy: 'صرف فوري من الشيت'
      };
      
      state.transactions.push(newTx);
      saveERPState();
      
      closeModal('modal-category-expense');
      
      // Refresh current view (Event Sheets) and dashboard
      renderEventSheets();
      renderDashboard();
      
      alert('تم تسجيل مصروف البند المالي وتحديث الميزانية التقديرية والفعلية بنجاح!');
    });
  }

  // Bind Login Form Submission
  const formLogin = document.getElementById('form-login');
  if (formLogin) {
    formLogin.addEventListener('submit', function(e) {
      e.preventDefault();
      const uInput = document.getElementById('login-username').value.trim().toLowerCase();
      const pInput = document.getElementById('login-password').value;
      const errorMsg = document.getElementById('login-error-msg');
      
      const foundUser = USERS_DB.find(u => u.username === uInput && u.password === pInput);
      if (foundUser) {
        sessionStorage.setItem(AUTH_KEY, foundUser.username);
        if (errorMsg) errorMsg.style.display = 'none';
        formLogin.reset();
        checkAuthentication();
      } else {
        if (errorMsg) errorMsg.style.display = 'block';
      }
    });
  }

  // Bind Logout Button Click
  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      if (confirm('هل أنت متأكد من رغبتك في تسجيل الخروج؟')) {
        sessionStorage.removeItem(AUTH_KEY);
        checkAuthentication();
      }
    });
  }

  // Init default render
  renderDashboard();
});
