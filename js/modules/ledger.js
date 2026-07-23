// --- LEDGER BUSINESS MODULE (js/modules/ledger.js) ---
import { state, saveERPState } from '../state.js';
import { formatCurrency } from '../utils.js';

export function renderLedger() {
  const select = document.getElementById('tx-event');
  if (!select) return;
  
  select.innerHTML = '<option value="" disabled selected>اختر الفعالية المستهدفة...</option>';
  state.events.forEach(ev => {
    const opt = document.createElement('option');
    opt.value = ev.id;
    opt.innerText = ev.name;
    select.appendChild(opt);
  });

  const searchInput = document.getElementById('tx-search-input');
  const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : '';
  renderAllLedgerTable(searchQuery);
}

export function renderAllLedgerTable(query = '') {
  const tbody = document.getElementById('all-tx-table-body');
  if (!tbody) return;
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
    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--text-secondary); padding: 20px;">لا توجد أي قيود مطابقة لبحثك في الخزينة.</td></tr>';
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
      <td data-label="المناسبة / الحفلة" style="font-weight: 500;" class="clickable-event" onclick="openEventCostSheet('${tx.eventId}')">${evName}</td>
      <td data-label="نوع العملية">
        <span class="badge ${isRev ? 'badge-success' : 'badge-danger'}">
          ${isRev ? 'إيراد قبض' : 'صرف تنفيذ'}
        </span>
      </td>
      <td data-label="البند المالي"><span class="badge badge-primary">${catLabels[tx.category] || tx.category}</span></td>
      <td data-label="القيمة (EGP)" style="font-weight: 700; color: ${isRev ? 'var(--accent-primary)' : 'var(--accent-danger)'};">
        ${isRev ? '+' : '-'}${formatCurrency(tx.amount)}
      </td>
      <td data-label="التاريخ" style="font-size: 13px;">${tx.date}</td>
      <td data-label="الشرح والبيان" style="max-width: 240px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;" title="${tx.description}">
        ${tx.description}
      </td>
      <td data-label="خيارات">
        <button class="btn btn-secondary btn-sm" style="color: var(--accent-danger);" onclick="deleteERPTransaction('${tx.id}', 'ledger')">🗑️ حذف</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

export function deleteERPTransaction(txId, activeView = 'ledger') {
  if (confirm('هل أنت متأكد من رغبتك في حذف هذه الحركة المالية من الحسابات؟')) {
    state.transactions = state.transactions.filter(t => t.id !== txId);
    saveERPState();
    
    if (window.refreshActiveViews) {
      window.refreshActiveViews();
    }
  }
}

// Bind globally for inline HTML click handlers
window.renderLedger = renderLedger;
window.renderAllLedgerTable = renderAllLedgerTable;
window.deleteERPTransaction = deleteERPTransaction;
