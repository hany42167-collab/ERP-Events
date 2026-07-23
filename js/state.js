// --- STATE MODULE (js/state.js) ---
export const state = {
  events: [],
  transactions: [],
  checklist: [],
  vendors: [],
  crew: [],
  assets: [],
  rentals: []
};

export function saveERPState() {
  localStorage.setItem('tokens_erp_state', JSON.stringify(state));
}

export function loadERPState() {
  const data = localStorage.getItem('tokens_erp_state');
  if (data) {
    try {
      const parsed = JSON.parse(data);
      // Mutate properties of the constant object to maintain module references
      Object.keys(parsed).forEach(key => {
        if (state[key] !== undefined) {
          state[key] = parsed[key];
        }
      });
    } catch (e) {
      console.error("Failed to parse local storage ERP state:", e);
    }
  }
}
