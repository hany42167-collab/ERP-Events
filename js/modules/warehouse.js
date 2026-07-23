// --- WAREHOUSE BUSINESS MODULE (js/modules/warehouse.js) ---
import { state, saveERPState } from '../state.js';
import { formatCurrency } from '../utils.js';

export function renderWarehouse() {
  const activeSubTabBtn = document.querySelector('#view-warehouse .sub-tab-btn.active');
  if (!activeSubTabBtn) return;
  const activeSubTab = activeSubTabBtn.getAttribute('data-sub');

  if (activeSubTab === 'inv-list') {
    renderConsumablesWarehouse();
  } else if (activeSubTab === 'rental-assets') {
    renderRentalAssetsWarehouse();
  } else if (activeSubTab === 'asset-allocations') {
    renderAssetAllocations();
  }
}

export function renderConsumablesWarehouse() {
  const tbody = document.getElementById('consumable-inventory-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  if (state.consumables.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:var(--text-secondary); padding: 20px;">لا توجد مستلزمات مستهلكة بالجدول.</td></tr>';
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
      <td data-label="الصنف / البيان" style="font-weight:600;">${item.name}</td>
      <td data-label="الرمز SKU" style="font-family:monospace;">${item.sku}</td>
      <td data-label="الرصيد الفعلي" style="font-weight:500;">${item.qty} وحدة</td>
      <td data-label="تكلفة الوحدة">${formatCurrency(item.cost)}</td>
      <td data-label="إجمالي القيمة">${formatCurrency(totalVal)}</td>
      <td data-label="حالة المخزون">${statusBadge}</td>
      <td data-label="خيارات">
        <button class="btn btn-secondary btn-sm" style="color:var(--accent-danger);" onclick="deleteWarehouseItem('${item.id}', 'consumables')">🗑️ حذف</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

export function renderRentalAssetsWarehouse() {
  const tbody = document.getElementById('rental-assets-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  if (state.rentalAssets.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:var(--text-secondary); padding: 20px;">لا توجد أصول ومعدات مؤجرة مسجلة.</td></tr>';
    return;
  }

  state.rentalAssets.forEach(asset => {
    const available = asset.totalQty - asset.rentedQty;
    const totalAssetVal = asset.totalQty * asset.cost;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td data-label="اسم الأصل / المعدة" style="font-weight:600;">${asset.name}</td>
      <td data-label="السعة الكلية">${asset.totalQty} قطعة</td>
      <td data-label="الخارج للإعارة" style="color:var(--accent-warning); font-weight:600;">${asset.rentedQty} قطعة للخارج</td>
      <td data-label="المتوفر بالمخزن" style="color:var(--accent-primary); font-weight:700;">${available} قطعة جاهزة</td>
      <td data-label="تكلفة التأجير">${formatCurrency(asset.cost)} / قطعة</td>
      <td data-label="القيمة الإجمالية">${formatCurrency(totalAssetVal)}</td>
      <td data-label="خيارات">
        <button class="btn btn-secondary btn-sm" style="color:var(--accent-danger);" onclick="deleteWarehouseItem('${asset.id}', 'rentals')">🗑️ حذف</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

export function deleteWarehouseItem(id, type) {
  if (confirm('هل أنت متأكد من حذف هذا الصنف من المخازن؟')) {
    if (type === 'consumables') {
      state.consumables = state.consumables.filter(c => c.id !== id);
    } else {
      state.rentalAssets = state.rentalAssets.filter(a => a.id !== id);
    }
    saveERPState();
    
    if (window.refreshActiveViews) {
      window.refreshActiveViews();
    } else {
      renderWarehouse();
    }
  }
}

export function renderAssetAllocations() {
  const tbody = document.getElementById('asset-allocations-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  if (state.rentalAllocations.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:var(--text-secondary); padding: 20px;">لا توجد حركات إعارة حالية للأصول.</td></tr>';
    return;
  }

  const sortedAllocations = [...state.rentalAllocations].sort((a,b) => new Date(b.deployDate) - new Date(a.deployDate));

  sortedAllocations.forEach(alc => {
    const isReturned = alc.status === 'returned';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td data-label="المناسبة المستعيرة" style="font-weight:500;" class="clickable-event" onclick="openEventCostSheet('${alc.eventId}')">${alc.eventName}</td>
      <td data-label="اسم المعدة" style="font-weight:600;">${alc.assetName}</td>
      <td data-label="الكمية المعارة" style="font-weight:600;">${alc.qty} قطعة</td>
      <td data-label="تاريخ الخروج" style="font-size:13px;">${alc.deployDate}</td>
      <td data-label="تاريخ الإرجاع المتوقع" style="font-size:13px; color: ${!isReturned ? 'var(--accent-warning)' : 'inherit'};">${alc.expectedReturnDate}</td>
      <td data-label="الحالة">
        <span class="badge ${isReturned ? 'badge-success' : 'badge-danger'}">
          ${isReturned ? '🟢 تم الإرجاع' : '🔴 قيد الاستعارة خارجياً'}
        </span>
      </td>
      <td data-label="خيارات">
        ${!isReturned ? `<button class="btn btn-primary btn-sm" onclick="returnRentalAsset('${alc.id}')">📥 استلام للمخزن</button>` : `<span style="color:var(--text-muted); font-size:12px;">مغلق</span>`}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

export function returnRentalAsset(allocationId) {
  const alc = state.rentalAllocations.find(a => a.id === allocationId);
  if (!alc) return;

  const asset = state.rentalAssets.find(a => a.id === alc.assetId);
  if (asset) {
    asset.rentedQty = Math.max(0, asset.rentedQty - alc.qty);
    alc.status = 'returned';
    
    saveERPState();
    
    if (window.refreshActiveViews) {
      window.refreshActiveViews();
    } else {
      renderWarehouse();
    }
    
    alert(`تم استلام عدد ${alc.qty} من "${alc.assetName}" بنجاح وإعادتها لأرصدة المخزن!`);
  }
}

// Bind globally for inline HTML click handlers
window.renderWarehouse = renderWarehouse;
window.renderConsumablesWarehouse = renderConsumablesWarehouse;
window.renderRentalAssetsWarehouse = renderRentalAssetsWarehouse;
window.renderAssetAllocations = renderAssetAllocations;
window.deleteWarehouseItem = deleteWarehouseItem;
window.returnRentalAsset = returnRentalAsset;
