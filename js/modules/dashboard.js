// --- DASHBOARD BUSINESS MODULE (js/modules/dashboard.js) ---
import { state } from '../state.js';
import { formatCurrency } from '../utils.js';
import { renderEventSheets } from './cost-sheets.js';

export function renderDashboard() {
  const totalRevenue = state.events.reduce((acc, ev) => acc + ev.totalContractValue, 0);
  const totalSpent = state.transactions.filter(tx => tx.type === 'expense').reduce((acc, tx) => acc + tx.amount, 0);
  const netProfit = totalRevenue - totalSpent;
  const spentPct = totalRevenue > 0 ? Math.round((totalSpent / totalRevenue) * 100) : 0;
  const profitMargin = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0;

  // Count deployed rental assets
  const deployedAssetPieces = state.rentalAllocations.filter(alc => alc.status === 'deployed').reduce((acc, alc) => acc + alc.qty, 0);

  const revEl = document.getElementById('dash-total-revenue');
  if (revEl) revEl.innerText = formatCurrency(totalRevenue);
  
  const spentEl = document.getElementById('dash-total-spent');
  if (spentEl) spentEl.innerText = formatCurrency(totalSpent);
  
  const pctEl = document.getElementById('dash-spent-pct');
  if (pctEl) pctEl.innerText = `${spentPct}% من قيمة العقود الكلية`;
  
  const profitNode = document.getElementById('dash-total-profits');
  if (profitNode) {
    profitNode.innerText = formatCurrency(netProfit);
    if (netProfit >= 0) {
      profitNode.style.color = 'var(--accent-primary)';
    } else {
      profitNode.style.color = 'var(--accent-danger)';
    }
  }
  
  const marginEl = document.getElementById('dash-profit-margin');
  if (marginEl) marginEl.innerText = `هامش ربح: ${profitMargin}%`;

  const assetsEl = document.getElementById('dash-out-assets');
  if (assetsEl) assetsEl.innerText = `${deployedAssetPieces} قطعة`;

  // Draw SVGs Budget vs Spent Chart
  drawDashboardChart();

  // Draw Recent Transactions
  renderRecentTransactions();

  // Draw Events Overview Table
  renderEventsTable();
}

export function drawDashboardChart() {
  const chartContainer = document.getElementById('event-bar-chart');
  if (!chartContainer) return;
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
    const revenueHeight = (ev.totalContractValue / maxVal) * 80;
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

export function renderRecentTransactions() {
  const container = document.getElementById('dash-recent-transactions');
  if (!container) return;
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

export function renderEventsTable() {
  const tbody = document.getElementById('events-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  if (state.events.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--text-secondary);">لا توجد مناسبات نشطة. قم بإنشاء فعالية جديدة للبدء.</td></tr>';
    return;
  }

  state.events.forEach(ev => {
    const evSpent = state.transactions.filter(t => t.eventId === ev.id && t.type === 'expense').reduce((acc, cur) => acc + cur.amount, 0);
    const netProfit = ev.totalContractValue - evSpent;
    const profitPct = ev.totalContractValue > 0 ? (netProfit / ev.totalContractValue) * 100 : 0;
    
    const evTasks = state.tasks.filter(t => t.eventId === ev.id);
    const completedTasks = evTasks.filter(t => t.status === 'completed').length;
    const taskPct = evTasks.length > 0 ? Math.round((completedTasks / evTasks.length) * 100) : 0;

    let progressColor = 'progress-fill';
    if (taskPct === 100) progressColor = 'progress-fill';
    else if (taskPct > 50) progressColor = 'progress-fill warning';
    else progressColor = 'progress-fill danger';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td data-label="اسم الحفلة/الفعالية" style="font-weight: 600;" class="clickable-event" onclick="openEventCostSheet('${ev.id}')">${ev.name}</td>
      <td data-label="التاريخ المحدد" style="font-size: 13px;">${ev.eventDate}</td>
      <td data-label="قيمة العقد" style="color: var(--accent-primary); font-weight: 500;">${formatCurrency(ev.totalContractValue)}</td>
      <td data-label="إجمالي المصاريف" style="color: ${evSpent > ev.totalContractValue ? 'var(--accent-danger)' : 'inherit'};">${formatCurrency(evSpent)}</td>
      <td data-label="التقدم بالمهام">
        <div class="progress-bar-container">
          <div class="progress-track">
            <div class="${progressColor}" style="width: ${taskPct}%;"></div>
          </div>
          <span class="progress-percent">${taskPct}%</span>
        </div>
      </td>
      <td data-label="صافي الأرباح" style="font-weight: 600; color: ${netProfit >= 0 ? 'var(--accent-primary)' : 'var(--accent-danger)'};">
        ${formatCurrency(netProfit)} (${Math.round(profitPct)}%)
      </td>
      <td data-label="خيارات">
        <button class="btn btn-secondary btn-sm" onclick="openEventCostSheet('${ev.id}')">📋 عرض التحليلات</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

export function openEventCostSheet(eventId) {
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

    const pageTitle = document.getElementById('page-current-title');
    if (pageTitle) pageTitle.innerText = 'شيت التكاليف والأرباح التقديرية والفعلية';

    renderEventSheets();
  }
}

// Bind globally for inline table click handlers
window.openEventCostSheet = openEventCostSheet;
