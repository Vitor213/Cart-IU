// js/storage.js
export const Storage = {
  KEY: "carrinho",

  save(cart) {
    localStorage.setItem(this.KEY, JSON.stringify(cart));
  },

  load() {
    const saved = localStorage.getItem(this.KEY);
    return saved ? JSON.parse(saved) : [];
  },
};
