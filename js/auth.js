// --- AUTHENTICATION & RBAC MODULE (js/auth.js) ---
export const AUTH_KEY = 'tokens_erp_authenticated_user';

export const USERS_DB = [
  { 
    username: 'admin', 
    password: 'admin123', 
    role: 'مدير النظام', 
    views: ['dashboard', 'eventsheets', 'ledger', 'addpetty', 'pettylog', 'operations', 'warehouse'],
    isReadOnly: false 
  },
  { 
    username: 'owner', 
    password: 'owner123', 
    role: 'مالك الشركة', 
    views: ['dashboard', 'eventsheets', 'ledger', 'operations', 'warehouse'],
    isReadOnly: false 
  },
  { 
    username: 'operation', 
    password: 'op123', 
    role: 'مسؤول العمليات', 
    views: ['eventsheets', 'operations', 'warehouse'],
    isReadOnly: false 
  },
  { 
    username: 'coordinator', 
    password: 'coord123', 
    role: 'منسق الحفلات', 
    views: ['eventsheets', 'addpetty', 'pettylog', 'operations'],
    isReadOnly: false 
  },
  { 
    username: 'accountant', 
    password: 'acc123', 
    role: 'المحاسب المالي', 
    views: ['eventsheets', 'ledger', 'addpetty', 'pettylog'],
    isReadOnly: false 
  },
  { 
    username: 'guest', 
    password: 'guest123', 
    role: 'مستخدم زائر (قراءة فقط)', 
    views: ['dashboard', 'eventsheets', 'ledger', 'addpetty', 'pettylog', 'operations', 'warehouse'],
    isReadOnly: true 
  }
];

export function getCurrentUser() {
  return sessionStorage.getItem(AUTH_KEY);
}

export function getCurrentUserRole() {
  const username = getCurrentUser();
  return USERS_DB.find(u => u.username === username);
}

export function checkAccess(viewName) {
  const user = getCurrentUserRole();
  if (!user) return false;
  return user.views.includes(viewName);
}

export function enforceReadOnly() {
  const user = getCurrentUserRole();
  const isReadOnly = user ? user.isReadOnly === true : false;
  
  // Disable all submit buttons inside forms and primary edit actions
  document.querySelectorAll('form button[type="submit"], .btn-primary:not(#btn-logout), #btn-update-budgets, #btn-import-sheet, .quick-spend-link').forEach(btn => {
    if (isReadOnly) {
      if (btn.classList.contains('quick-spend-link')) {
        btn.style.display = 'none';
      } else {
        btn.disabled = true;
        btn.style.opacity = '0.4';
        btn.style.pointerEvents = 'none';
      }
    } else {
      if (btn.classList.contains('quick-spend-link')) {
        btn.style.display = 'block';
      } else {
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.style.pointerEvents = 'auto';
      }
    }
  });

  // Hide or disable delete buttons in tables
  document.querySelectorAll('table button.btn-secondary, td button.btn-secondary').forEach(btn => {
    if (btn.innerText.includes('حذف')) {
      if (isReadOnly) {
        btn.style.display = 'none';
      } else {
        btn.style.display = 'inline-block';
      }
    }
  });
}

export function updateSidebarNavigation() {
  const user = getCurrentUserRole();
  if (!user) return;
  
  const navItems = document.querySelectorAll('.nav-menu .nav-item');
  let firstAllowedView = null;
  
  navItems.forEach(item => {
    const viewName = item.getAttribute('data-view');
    if (user.views.includes(viewName)) {
      item.style.display = 'block';
      if (!firstAllowedView) {
        firstAllowedView = viewName;
      }
    } else {
      item.style.display = 'none';
    }
  });
  
  return firstAllowedView;
}
