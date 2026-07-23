// --- OPERATIONS BUSINESS MODULE (js/modules/operations.js) ---
import { state, saveERPState } from '../state.js';
import { formatCurrency } from '../utils.js';

export function renderOperations() {
  const activeSubTabBtn = document.querySelector('#view-operations .sub-tab-btn.active');
  if (!activeSubTabBtn) return;
  const activeSubTab = activeSubTabBtn.getAttribute('data-sub');
  
  if (activeSubTab === 'tasks') {
    renderTasksSection();
  } else if (activeSubTab === 'vendors') {
    renderVendorsSection();
  } else if (activeSubTab === 'crew') {
    renderCrewSection();
  }
}

export function renderTasksSection() {
  const select = document.getElementById('task-event-select');
  if (!select) return;
  const previousSelection = select.value;
  
  select.innerHTML = '';

  if (state.events.length === 0) {
    select.innerHTML = '<option value="">لا توجد مناسبات مضافة</option>';
    const container = document.getElementById('event-tasks-container');
    if (container) {
      container.innerHTML = '<div style="text-align: center; padding: 20px; color: var(--text-secondary);">يرجى تسجيل فعالية أولاً.</div>';
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
  const eventTasks = state.tasks.filter(t => t.eventId === selectedEvId);
  const totalTasks = eventTasks.length;
  const completedTasks = eventTasks.filter(t => t.status === 'completed').length;
  const completionPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const statsEl = document.getElementById('event-task-completion-stats');
  if (statsEl) {
    statsEl.innerText = `المهام المنجزة: ${completedTasks} من إجمالي ${totalTasks} (${completionPct}%)`;
  }

  const container = document.getElementById('event-tasks-container');
  if (!container) return;
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

export function toggleTaskStatus(taskId) {
  const task = state.tasks.find(t => t.id === taskId);
  if (task) {
    task.status = task.status === 'completed' ? 'pending' : 'completed';
    saveERPState();
    
    if (window.refreshActiveViews) {
      window.refreshActiveViews();
    } else {
      renderTasksSection();
    }
  }
}

export function deleteTask(taskId) {
  if (window.event) window.event.stopPropagation();
  if (confirm('هل أنت متأكد من حذف هذه المهمة؟')) {
    state.tasks = state.tasks.filter(t => t.id !== taskId);
    saveERPState();
    
    if (window.refreshActiveViews) {
      window.refreshActiveViews();
    } else {
      renderTasksSection();
    }
  }
}

export function renderVendorsSection() {
  const tbody = document.getElementById('vendors-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  if (state.vendors.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:var(--text-secondary); padding: 20px;">لا توجد موردين مسجلين بعد.</td></tr>';
    return;
  }

  state.vendors.forEach(vendor => {
    const vendorTxs = state.transactions.filter(t => t.description.includes(vendor.name));
    const totalVolume = vendorTxs.reduce((acc, cur) => acc + cur.amount, 0);

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td data-label="اسم المورد" style="font-weight:600;">${vendor.name}</td>
      <td data-label="نوع الخدمة"><span class="badge badge-primary">${vendor.serviceType}</span></td>
      <td data-label="بيانات الاتصال" style="font-family:monospace;">${vendor.contact}</td>
      <td data-label="حجم المعاملات المالي" style="font-weight:600;">${formatCurrency(totalVolume)}</td>
      <td data-label="خيارات">
        <button class="btn btn-secondary btn-sm" style="color: var(--accent-danger);" onclick="deleteVendor('${vendor.id}')">🗑️ حذف</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

export function deleteVendor(id) {
  if (confirm('هل تريد حذف هذا المورد من الدليل؟')) {
    state.vendors = state.vendors.filter(v => v.id !== id);
    saveERPState();
    renderVendorsSection();
  }
}

export function renderCrewSection() {
  const tbody = document.getElementById('crew-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  if (state.crew.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:var(--text-secondary); padding: 20px;">لا توجد أعضاء منظمين مسجلين.</td></tr>';
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
      <td data-label="اسم المنظم" style="font-weight:600;">${member.name}</td>
      <td data-label="دور المنظم/الفني"><span class="badge badge-success">${roleLabels[member.role] || member.role}</span></td>
      <td data-label="اليومية المحددة">${formatCurrency(member.dailyRate)} / حفلة</td>
      <td data-label="رقم الهاتف" style="font-family:monospace;">${member.phone}</td>
      <td data-label="الحفلة الحالية" style="font-size:13px; font-weight: 500;" class="${assignedEv ? 'clickable-event' : ''}" onclick="${assignedEv ? `openEventCostSheet('${member.currentEventId}')` : ''}">
        ${eventName}
      </td>
      <td data-label="خيارات">
        <div style="display:flex; gap:8px;">
          <button class="btn btn-secondary btn-sm" onclick="openAssignCrewModal('${member.id}')">Assign</button>
          <button class="btn btn-secondary btn-sm" style="color: var(--accent-danger);" onclick="deleteCrewMember('${member.id}')">🗑️</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

export function deleteCrewMember(id) {
  if (confirm('هل تريد استبعاد هذا المنظم؟')) {
    state.crew = state.crew.filter(c => c.id !== id);
    saveERPState();
    renderCrewSection();
  }
}

// Bind globally for inline HTML click handlers
window.renderOperations = renderOperations;
window.renderTasksSection = renderTasksSection;
window.renderVendorsSection = renderVendorsSection;
window.renderCrewSection = renderCrewSection;
window.toggleTaskStatus = toggleTaskStatus;
window.deleteTask = deleteTask;
window.deleteVendor = deleteVendor;
window.deleteCrewMember = deleteCrewMember;
