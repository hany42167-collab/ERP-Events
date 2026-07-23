// --- PETTY CASH BUSINESS MODULE (js/modules/petty-cash.js) ---
import { state } from '../state.js';
import { formatCurrency } from '../utils.js';

export function renderAddPetty() {
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

export function renderPettyLog() {
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
      <td data-label="الفعالية / الحفلة" style="font-weight: 500;" class="clickable-event" onclick="openEventCostSheet('${t.eventId}')">${evName}</td>
      <td data-label="البند المخصص"><span class="badge badge-primary">${categoryLabels[t.category] || t.category}</span></td>
      <td data-label="التاريخ" style="font-size: 13px;">${t.date}</td>
      <td data-label="الشرح والبيان" style="max-width: 250px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;" title="${t.description}">${t.description}</td>
      <td data-label="القيمة (EGP)" style="font-weight: 700; color: var(--accent-danger);">${formatCurrency(t.amount)}</td>
      <td data-label="الإيصال المصوّر" style="text-align: center;">
        ${t.receiptImage ? `<img src="${t.receiptImage}" class="receipt-thumbnail" onclick="openLightbox('${t.receiptImage}')" title="اضغط لعرض إيصال الصرف">` : `<span class="no-receipt-placeholder">لا توجد صورة</span>`}
      </td>
      <td data-label="خيارات">
        <button class="btn btn-secondary btn-sm" style="color: var(--accent-danger);" onclick="deleteERPTransaction('${t.id}', 'pettylog')">🗑️ حذف</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Bind globally for navigation loading
window.renderAddPetty = renderAddPetty;
window.renderPettyLog = renderPettyLog;
