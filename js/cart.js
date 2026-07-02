// js/cart.js
export class CartManager {
  constructor() {
    this.items = [];
  }

  add(product) {
    const existing = this.items.find((item) => item.nome === product.nome);
    if (existing) {
      existing.quantidade++;
    } else {
      this.items.push({ ...product, quantidade: 1 });
    }
  }

  remove(index) {
    this.items.splice(index, 1);
  }

  changeQuantity(index, delta) {
    const item = this.items[index];
    if (!item) return;

    item.quantidade += delta;
    if (item.quantidade < 1) this.remove(index);
  }

  getTotal() {
    return this.items.reduce(
      (total, item) => total + item.preco * item.quantidade,
      0,
    );
  }

  clear() {
    this.items = [];
  }

  getItems() {
    return this.items;
  }
}
