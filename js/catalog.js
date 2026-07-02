// js/catalog.js
export const products = [
  {
    id: 1,
    nome: "Camiseta Estampada",
    preco: 49.9,
    imagem: "img/camisa01.webp",
  },
  {
    id: 2,
    nome: "Camiseta Preta Básica",
    preco: 39.9,
    imagem: "img/camisa02.webp",
  },
  { id: 3, nome: "Camiseta Branca", preco: 44.9, imagem: "img/camisa03.webp" },
  {
    id: 4,
    nome: "Camiseta Oversized",
    preco: 59.9,
    imagem: "img/camisa04.webp",
  },
];

export function renderCatalog(containerSelector, addToCartCallback) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  container.innerHTML = "";

  products.forEach((product) => {
    const html = `
      <div class="item" data-id="${product.id}">
        <img src="${product.imagem}" alt="${product.nome}">
        <div class="descricao">
          <h2>${product.nome}</h2>
          <p class="preço" data-preco="${product.preco}">R$ ${product.preco.toFixed(2)}</p>
          <button class="add-cart">Adicionar ao carrinho</button>
        </div>
      </div>
    `;
    container.innerHTML += html;
  });
}
