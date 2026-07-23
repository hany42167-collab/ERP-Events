// --- COST SHEETS BUSINESS MODULE (js/modules/cost-sheets.js) ---
import { state, saveERPState } from '../state.js';
import { formatCurrency } from '../utils.js';

export function renderEventSheets() {
  const select = document.getElementById('sheet-event-select');
  if (!select) return;
  
  const previousSelection = select.value;
  select.innerHTML = '';
  
  if (state.events.length === 0) {
    select.innerHTML = '<option value="">لا توجد مناسبات مسجلة</option>';
    const catContainer = document.getElementById('event-categories-container');
    if (catContainer) {
      catContainer.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">يرجى حجز فعالية أولاً لتفحص بياناتها.</div>';
    }
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
  if (profitNode) {
    if (netProfit >= 0) {
      profitNode.style.color = 'var(--accent-primary)';
    } else {
      profitNode.style.color = 'var(--accent-danger)';
    }
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
  if (container) {
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
  }

  // Render Event specific detailed ledger
  const tbody = document.getElementById('event-ledger-table-body');
  if (!tbody) return;
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
      <td data-label="التاريخ" style="font-size: 13px;">${tx.date}</td>
      <td data-label="نوع العملية">
        <span class="badge ${isRev ? 'badge-success' : 'badge-danger'}">
          ${isRev ? 'قبض وإيراد' : 'صرف ومصروف'}
        </span>
      </td>
      <td data-label="البند / القسم" style="font-weight: 500;">
        ${tx.category === 'ClientPayment' ? 'سداد العميل' : (categoryLabels[tx.category]?.ar || tx.category)}
      </td>
      <td data-label="الشرح والبيان">${tx.description}</td>
      <td data-label="القيمة (EGP)" style="font-weight: 600; color: ${isRev ? 'var(--accent-primary)' : 'var(--accent-danger)'};">
        ${isRev ? '+' : '-'}${formatCurrency(tx.amount)}
      </td>
      <td data-label="خيارات">
        <button class="btn btn-secondary btn-sm" style="color: var(--accent-danger);" onclick="deleteERPTransaction('${tx.id}', 'eventsheets')">🗑️ حذف</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

export function openQuickExpenseModal(categoryKey, categoryNameAr) {
  const eventSelect = document.getElementById('sheet-event-select');
  if (!eventSelect) return;
  const selectedEvId = eventSelect.value;
  const event = state.events.find(e => e.id === selectedEvId);
  if (!event) return;

  document.getElementById('quick-expense-cat-title').innerText = categoryNameAr;
  document.getElementById('quick-expense-cat-key').value = categoryKey;
  document.getElementById('quick-expense-event-name').value = event.name;
  
  document.getElementById('quick-expense-amount').value = '';
  document.getElementById('quick-expense-desc').value = '';
  document.getElementById('quick-expense-date').value = new Date().toISOString().split('T')[0];

  window.openModal('modal-category-expense');
}

export function initCSVExport() {
  const btnExport = document.getElementById('btn-export-sheet');
  if (btnExport) {
    btnExport.addEventListener('click', () => {
      const eventSelect = document.getElementById('sheet-event-select');
      if (!eventSelect) return;
      const selectedEvId = eventSelect.value;
      const event = state.events.find(e => e.id === selectedEvId);
      if (!event) {
        alert('الرجاء اختيار فعالية/حفلة أولاً لتصدير البيانات!');
        return;
      }
      
      const evTxs = state.transactions.filter(t => t.eventId === event.id);
      
      let csvContent = "\uFEFF"; // UTF-8 BOM for Excel Arabic layout
      csvContent += `شيت التكاليف والأرباح التقديرية والفعلية\n`;
      csvContent += `اسم الفعالية / الحفلة,${event.name}\n`;
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

export function parseCSVLine(text) {
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

export function parseCSVAndImport(csvText) {
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

    if (parts[0].includes('قيمة عقد العميل الإجمالي')) {
      const val = parseFloat(parts[1].replace(/[^\d.]/g, ''));
      if (!isNaN(val)) totalContractValue = val;
    }

    const mappedKey = categoryMap[parts[0]];
    if (mappedKey && !parsingTransactions) {
      const budgetVal = parseFloat(parts[1].replace(/[^\d.]/g, ''));
      if (!isNaN(budgetVal)) budgets[mappedKey] = budgetVal;
    }

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

  if (totalContractValue !== null) {
    event.totalContractValue = totalContractValue;
  }
  
  event.categoryBudgets = budgets;

  if (newTransactions.length > 0) {
    state.transactions = state.transactions.filter(t => t.eventId !== event.id).concat(newTransactions);
  }

  saveERPState();
  
  if (window.refreshActiveViews) {
    window.refreshActiveViews();
  } else {
    renderEventSheets();
  }
  alert('تم استيراد شيت التكاليف بنجاح وتحديث ميزانيات البنود والمعاملات المالية للحفلة!');
}

// Bind globally for inline HTML click handlers
window.openQuickExpenseModal = openQuickExpenseModal;
window.renderEventSheets = renderEventSheets;
