// js/main.js
import { Storage } from "./storage.js";
import { CartManager } from "./cart.js";
import { renderCatalog, products } from "./catalog.js";

const cart = new CartManager();
let cartItems = Storage.load();
cart.items = cartItems; // carrega do storage

// Elementos DOM
const listaProdutos = document.querySelector(".lista-itens");
const listaCatalogo = document.querySelector(".lista-produtos");

// Funções de render
function updateCartUI() {
  // ... seu código atual de atualizarCarrinho() aqui ...
  Storage.save(cart.items);
}

// Inicialização
renderCatalog(".lista-produtos", (product) => {
  cart.add(product);
  updateCartUI();
});

updateCartUI();

// Eventos (abrir/fechar carrinho, etc)
