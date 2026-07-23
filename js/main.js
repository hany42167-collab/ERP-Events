// --- APP BOOTSTRAPPER & MAIN ENTRY POINT (js/main.js) ---
import { state, loadERPState, saveERPState } from './state.js';
import { formatCurrency, compressAndSaveImage } from './utils.js';
import { getCurrentUser, getCurrentUserRole, enforceReadOnly, updateSidebarNavigation, AUTH_KEY, USERS_DB } from './auth.js';

import { renderDashboard } from './modules/dashboard.js';
import { renderEventSheets, initCSVExport } from './modules/cost-sheets.js';
import { renderLedger, renderAllLedgerTable } from './modules/ledger.js';
import { renderAddPetty, renderPettyLog } from './modules/petty-cash.js';
import { renderOperations, renderTasksSection, renderVendorsSection, renderCrewSection } from './modules/operations.js';
import { renderWarehouse } from './modules/warehouse.js';

// --- GLOBAL RENDER VIEW BUS ---
export function renderView(viewName) {
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
  // Enforce read-only permissions on inputs/buttons if guest user is active
  enforceReadOnly();
}

export function refreshActiveViews() {
  const activeNavItem = document.querySelector('.nav-item.active');
  if (activeNavItem) {
    const activeView = activeNavItem.getAttribute('data-view');
    renderView(activeView);
  }
  // Sync dashboard in the background
  renderDashboard();
}

window.renderView = renderView;
window.refreshActiveViews = refreshActiveViews;

// --- GLOBAL MODALS TRIGGERS & FORM HANDLERS ---
export function openModal(modalId) {
  const overlay = document.getElementById(modalId);
  if (overlay) {
    overlay.classList.add('active');
    if (modalId === 'modal-deploy-asset') {
      setupAssetDeploymentModal();
    }
  }
}

export function closeModal(modalId) {
  const overlay = document.getElementById(modalId);
  if (overlay) {
    overlay.classList.remove('active');
  }
}

window.openModal = openModal;
window.closeModal = closeModal;

// Navigation initializer
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
      if (pageTitle) pageTitle.innerText = titles[targetView] || 'لوحة التحكم';
      
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

      const currentActiveView = parentSection.id.replace('view-', '');
      renderView(currentActiveView);
    });
  });
}

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
    
    refreshActiveViews();
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

    refreshActiveViews();
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
    
    refreshActiveViews();
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
    
    refreshActiveViews();
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

    asset.rentedQty += qty;

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
    
    refreshActiveViews();
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

    if (sum > event.totalContractValue) {
      const warningNode = document.getElementById('budget-sum-warning');
      warningNode.innerText = `تنبيه: مجموع ميزانيات المصاريف المقترحة (${formatCurrency(sum)}) يتخطى إجمالي قيمة العقد المتفق عليها مع العميل (${formatCurrency(event.totalContractValue)}). هذا يعني حتمية خسارة الفعالية ماليًا!`;
      return;
    }

    event.categoryBudgets = newBudgets;
    saveERPState();
    closeModal('modal-edit-budgets');
    
    refreshActiveViews();
    alert('تم إعادة تخصيص ميزانيات البنود والخدمات بنجاح!');
  });

  // Petty cash spend form submit
  const formAddPettyEl = document.getElementById('form-add-petty');
  if (formAddPettyEl) {
    formAddPettyEl.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const eventId = document.getElementById('petty-event').value;
      const category = document.getElementById('petty-category').value;
      const amount = parseFloat(document.getElementById('petty-amount').value) || 0;
      const date = document.getElementById('petty-date').value;
      const description = document.getElementById('petty-description').value;
      const receiptFile = document.getElementById('petty-receipt').files[0];
      
      const newTx = {
        id: 'tx_petty_' + Date.now(),
        eventId: eventId,
        type: 'expense',
        category: category,
        amount: amount,
        date: date,
        description: description,
        addedBy: 'سحب نثريات فورية',
        isPettyCash: true,
        receiptImage: null
      };

      const saveAndRender = () => {
        state.transactions.push(newTx);
        saveERPState();
        formAddPettyEl.reset();
        
        document.getElementById('petty-date').value = new Date().toISOString().split('T')[0];
        
        refreshActiveViews();
        alert('تم تسجيل عملية السحب النثري بنجاح!');
      };

      if (receiptFile) {
        compressAndSaveImage(receiptFile, (compressedBase64) => {
          newTx.receiptImage = compressedBase64;
          saveAndRender();
        });
      } else {
        saveAndRender();
      }
    });
  }

  // Quick Expense Form submit from Cost Sheet category card click
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
      
      refreshActiveViews();
      alert('تم تسجيل مصروف البند المالي وتحديث الميزانية التقديرية والفعلية بنجاح!');
    });
  }
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

function setupAssetDeploymentModal() {
  const assetSelect = document.getElementById('dep-asset');
  const eventSelect = document.getElementById('dep-event');
  const qtyInput = document.getElementById('dep-qty');
  const infoPara = document.getElementById('deploy-info');
  if (!assetSelect || !eventSelect) return;

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

window.openCategoryBudgetsModal = function() {
  const select = document.getElementById('sheet-event-select');
  if (!select) return;
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

window.openAssignCrewModal = function(crewId) {
  const member = state.crew.find(c => c.id === crewId);
  if (!member) return;

  const eventList = state.events.map(e => `"${e.name}"`).join('\n');
  const selection = prompt(`إسناد المنظم "${member.name}" لفعالية نشطة. اختر اسماً من القائمة الحالية وكتابته بدقة:\n\n${eventList}\n\nأو اكتب "none" لإلغاء الإسناد:`);
  
  if (selection === null) return;

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

// App Bootstrapper
document.addEventListener('DOMContentLoaded', () => {
  // Load local state
  loadERPState();

  // Authentication validation
  const checkAuthAndRoute = () => {
    const user = getCurrentUser();
    const loginScreen = document.getElementById('login-screen');
    
    if (user) {
      if (loginScreen) loginScreen.style.display = 'none';
      
      // Update UI avatar text
      const avatar = document.querySelector('.avatar');
      if (avatar) {
        avatar.innerText = user.substring(0, 2).toUpperCase();
        avatar.title = `مرحباً بك: ${user}`;
      }
      
      // Configure dynamic sidebar tabs per role
      const defaultView = updateSidebarNavigation();
      
      // Navigate to default view or keep active
      const activeTab = document.querySelector('.nav-item.active');
      if (activeTab && activeTab.style.display !== 'none') {
        const activeView = activeTab.getAttribute('data-view');
        renderView(activeView);
      } else if (defaultView) {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(n => n.classList.remove('active'));
        const defaultTab = Array.from(navItems).find(n => n.getAttribute('data-view') === defaultView);
        if (defaultTab) {
          defaultTab.classList.add('active');
          const sections = document.querySelectorAll('.view-section');
          sections.forEach(s => s.classList.remove('active'));
          const activeSec = document.getElementById(`view-${defaultView}`);
          if (activeSec) activeSec.classList.add('active');
          
          const titles = {
            'dashboard': 'لوحة التحكم العامة والأرباح',
            'eventsheets': 'شيت التكاليف والأرباح التقديرية والفعلية',
            'ledger': 'دفتر المعاملات والقيود المالية',
            'addpetty': 'سحب مصروفات ونثرية جديدة',
            'pettylog': 'سجل سحب المصروفات والنثرية وإيصالات الدفع',
            'operations': 'العمليات والمهام وتوزيع فريق العمل والموردين',
            'warehouse': 'المستودع وتتبع الأصول المعارة وتجهيزات الفعاليات'
          };
          const pageTitle = document.getElementById('page-current-title');
          if (pageTitle) pageTitle.innerText = titles[defaultView] || 'لوحة التحكم';
          
          renderView(defaultView);
        }
      }
    } else {
      if (loginScreen) loginScreen.style.display = 'flex';
    }
  };

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
        checkAuthAndRoute();
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
        checkAuthAndRoute();
      }
    });
  }

  // Check auth immediately
  checkAuthAndRoute();

  // Set default dates
  const today = new Date().toISOString().split('T')[0];
  const txDate = document.getElementById('tx-date');
  if (txDate) txDate.value = today;
  const pettyDate = document.getElementById('petty-date');
  if (pettyDate) pettyDate.value = today;

  // Initialize navigation and forms
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
      const txAmt = document.getElementById('tx-amount');
      if (txAmt) txAmt.focus();
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
});
