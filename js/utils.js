// --- UTILS MODULE (js/utils.js) ---
export function formatCurrency(amount) {
  return amount.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' });
}

export function compressAndSaveImage(file, callback) {
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

export function openLightbox(src) {
  const modal = document.getElementById('modal-lightbox');
  const img = document.getElementById('lightbox-image');
  if (modal && img) {
    img.src = src;
    modal.classList.add('active');
  }
}

export function closeLightbox() {
  const modal = document.getElementById('modal-lightbox');
  if (modal) {
    modal.classList.remove('active');
  }
}

// Global binding for inline HTML onclick handlers
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
