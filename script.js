const body = document.body;
const fechar = document.querySelector(".fechar");
const verCarrinho = document.querySelector(".icone-cart");
const btnAddCart = document.querySelectorAll(".add-cart");
const listaProdutos = document.querySelector(".lista-itens");
const contadorCart =
  document.querySelector(".icone-cart span") ||
  document.getElementById("cart-count");
const btnLimpar = document.getElementById("limpar-carrinho");
const catalogLoader = document.getElementById("catalog-loader");
const toastContainer = document.getElementById("toast-container");
if (btnLimpar) {
  btnLimpar.addEventListener("click", limparCarrinho);
}
const btnFinalizar = document.querySelector(".finalizar");
if (btnFinalizar) {
  btnFinalizar.addEventListener("click", finalizarCompra);
}

let carrinho = [];

// ==================== CATÁLOGO DE PRODUTOS ====================
const produtos = [
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
  {
    id: 3,
    nome: "Camiseta Branca",
    preco: 44.9,
    imagem: "img/camisa03.webp",
  },
  {
    id: 4,
    nome: "Camiseta Oversized",
    preco: 59.9,
    imagem: "img/camisa04.webp",
  },
];

function carregarCarrinho() {
  const carrinhoSalvo = localStorage.getItem("carrinho");
  if (carrinhoSalvo) {
    carrinho = JSON.parse(carrinhoSalvo);
    console.log("Carrinho carregado:", carrinho);
  }
}
function salvarCarrinho() {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}
carregarCarrinho();

// Abrir e fechar carrinho
verCarrinho.addEventListener("click", function () {
  body.classList.toggle("show-cart");
  // smooth scroll para início do carrinho
  setTimeout(() => {
    const pane = document.querySelector(".lista-itens");
    if (pane) pane.scrollTo({ top: 0, behavior: "smooth" });
  }, 200);
});

fechar.addEventListener("click", function () {
  body.classList.remove("show-cart");
});

listaProdutos.addEventListener("click", function (e) {
  const target = e.target;

  // Botão +
  if (target.classList.contains("plus")) {
    const index = parseInt(target.dataset.index);
    if (carrinho[index]) {
      carrinho[index].quantidade++;
      atualizarCarrinho();
    }
  }

  // Botão -
  if (target.classList.contains("minus")) {
    const index = parseInt(target.dataset.index);
    if (carrinho[index]) {
      if (carrinho[index].quantidade > 1) {
        carrinho[index].quantidade--;
      } else {
        carrinho.splice(index, 1);
      }
      atualizarCarrinho();
    }
  }

  // Botão Remover
  if (target.classList.contains("btn-remover")) {
    const index = parseInt(target.dataset.index);
    removerItem(index);
  }
});
function renderizarCatalogo() {
  const container = document.querySelector(".lista-produtos");
  if (!container) {
    console.error("Container .lista-produtos não encontrado!");
    return;
  }

  container.innerHTML = ""; // limpa os produtos estáticos

  produtos.forEach((produto) => {
    const html = `
      <div class="item" data-id="${produto.id}">
        <img src="${produto.imagem}" alt="${produto.nome}">
        <div class="descricao">
          <h2>${produto.nome}</h2>
          <p class="preço" data-preco="${produto.preco}">R$ ${produto.preco.toFixed(2)}</p>
          <button class="add-cart">Adicionar ao carrinho</button>
        </div>
      </div>
    `;
    container.innerHTML += html;
  });

  // Reatribui os eventos nos novos botões "Adicionar"
  adicionarEventosBotoesAdd();
}

// Atualizar interface
function atualizarCarrinho() {
  listaProdutos.innerHTML = "";

  if (carrinho.length === 0) {
    document.getElementById("carrinho-vazio").classList.add("show");
    contadorCart.textContent = 0;
    atualizarTotalGeral();
    salvarCarrinho();
    return;
  } else {
    document.getElementById("carrinho-vazio").classList.remove("show");
  }
  carrinho.forEach(function (produto, index) {
    const subtotal = calcularSubtotal(produto);

    const html = `
      <div class="produtos">
        <div class="imagem">
          <img src="${produto.imagem}">
        </div>
        <div class="nome">
          <h2>${produto.nome}</h2>
        </div>
        <div class="preco">
          R$ ${Number(produto.preco).toFixed(2)}
        </div>
        <div class="quantidade">
          <span class="minus" data-index="${index}">-</span>
          <span>${produto.quantidade}</span>
          <span class="plus" data-index="${index}">+</span>
        </div>
      </div>
      <div class="subtotal-caixa">
          <button class="btn-remover" data-index="${index}">🗑 Remover</button> 
        <p class="subtotal-item">
            Subtotal: <span class="subtotal">R$ ${subtotal.toFixed(2)}</span>
        </p>
        </div>
    `;
    listaProdutos.innerHTML += html;
  });

  // Contador de itens
  let totalItens = carrinho.reduce((acc, prod) => acc + prod.quantidade, 0);
  contadorCart.textContent = totalItens;

  atualizarTotalGeral();
  salvarCarrinho(); // ← salva sempre que renderiza
}
// ==================== CÁLCULO DO TOTAL ====================
function calcularTotalGeral() {
  let total = 0; // ← let, não const

  for (let item of carrinho) {
    const subtotal = item.preco * item.quantidade;
    total += subtotal;
  }

  return total; // ← importante retornar o valor
}

function atualizarTotalGeral() {
  // ← nome corrigido
  const total = calcularTotalGeral(); // ← () para chamar a função
  const elementoTotal = document.getElementById("total-geral");

  if (elementoTotal) {
    elementoTotal.textContent = `R$ ${total.toFixed(2)}`;
  }
}
function calcularSubtotal(produto) {
  const precoNumerico = parseFloat(produto.preco);
  return precoNumerico * produto.quantidade;
}
function limparCarrinho() {
  if (confirm("Você tem certeza que deseja limpar o carrinho ?")) carrinho = [];
  atualizarCarrinho();
  salvarCarrinho();
}
function finalizarCompra() {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }
  const total = calcularTotalGeral();
  alert(
    `Compra finalizada com sucesso!\n\nTotal: R$ ${total.toFixed(2)}\n\nObrigado pela compra! 🛍️`,
  );

  carrinho = [];
  atualizarCarrinho();
  salvarCarrinho();
}
function removerItem(index) {
  if (confirm("Você tem certeza que deseja remover o produto ?")) {
    carrinho.splice(index, 1);
    atualizarCarrinho();
  }
}
function adicionarEventosBotoesAdd() {
  const btns = document.querySelectorAll(".add-cart");

  btns.forEach((botao) => {
    // Remove listener antigo se existir
    botao.removeEventListener("click", handleAddToCart);
    botao.addEventListener("click", handleAddToCart);
  });
}
function handleAddToCart(e) {
  const item = e.target.closest(".item");
  if (!item) return;

  const nome = item.querySelector("h2").textContent.trim();
  const precoEl = item.querySelector(".preço");
  const preco = precoEl ? Number(precoEl.dataset.preco) : 0;
  const imagem = item.querySelector("img").src;

  const produto = {
    id: Number(item.dataset.id) || Date.now(),
    nome,
    preco,
    imagem,
  };

  // animação visual para o usuário
  animateAddToCart(item.querySelector("img"));

  addToCartWithToast(produto);
}

// animação que clona a imagem e move até o ícone do carrinho
function animateAddToCart(imgEl) {
  if (!imgEl) return;
  const clone = imgEl.cloneNode(true);
  const rect = imgEl.getBoundingClientRect();
  clone.style.position = "fixed";
  clone.style.left = rect.left + "px";
  clone.style.top = rect.top + "px";
  clone.style.width = rect.width + "px";
  clone.style.height = rect.height + "px";
  clone.style.transition = "all .6s cubic-bezier(.2,.8,.2,1)";
  clone.style.zIndex = 1200;
  clone.style.borderRadius = "8px";
  document.body.appendChild(clone);
  const cartIcon = document.querySelector(".icone-cart");
  const dest = cartIcon.getBoundingClientRect();
  requestAnimationFrame(() => {
    clone.style.left = dest.left + dest.width / 2 - rect.width / 4 + "px";
    clone.style.top = dest.top + dest.height / 2 - rect.height / 4 + "px";
    clone.style.transform = "scale(.25)";
    clone.style.opacity = "0.8";
  });
  setTimeout(() => clone.remove(), 700);
}
// ==================== CONSUMO DE API ====================
async function loadProducts() {
  try {
    // show loader
    if (catalogLoader) {
      catalogLoader.hidden = false;
      catalogLoader.setAttribute("aria-hidden", "false");
    }
    const response = await fetch("https://fakestoreapi.com/products?limit=8");
    const data = await response.json();

    // Atualiza o array de produtos com dados da API
    produtos.length = 0; // limpa o array atual

    data.forEach((item) => {
      produtos.push({
        id: item.id,
        nome: item.title.substring(0, 40),
        preco: item.price,
        imagem: item.image,
      });
    });

    renderizarCatalogo(); // re-renderiza com novos produtos
  } catch (error) {
    console.error("Erro ao carregar da API:", error);
    renderizarCatalogo(); // fallback
  } finally {
    if (catalogLoader) {
      catalogLoader.hidden = true;
      catalogLoader.setAttribute("aria-hidden", "true");
    }
  }
}
// ==================== BUSCA ====================
function setupSearch() {
  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "Buscar produtos...";
  searchInput.style.marginBottom = "20px";
  searchInput.style.padding = "10px";
  searchInput.style.width = "100%";
  searchInput.style.borderRadius = "8px";
  searchInput.style.border = "1px solid #ddd";

  // Insere o input antes do catálogo
  const catalogContainer = document.querySelector(".lista-produtos");
  catalogContainer.parentNode.insertBefore(searchInput, catalogContainer);

  // busca com debounce para melhor UX
  const debounce = (fn, delay = 300) => {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), delay);
    };
  };

  const doSearch = (e) => {
    const term = e.target.value.toLowerCase().trim();
    const filtered = produtos.filter((product) =>
      product.nome.toLowerCase().includes(term),
    );
    const container = document.querySelector(".lista-produtos");
    container.innerHTML = "";
    if (filtered.length === 0) {
      container.innerHTML = "<p>Nenhum produto encontrado.</p>";
      return;
    }
    filtered.forEach((product) => {
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
    // reattach events
    adicionarEventosBotoesAdd();
  };

  searchInput.addEventListener("input", debounce(doSearch, 350));
}

// ==================== FILTRO E ORDENAÇÃO ====================
function setupFilters() {
  const filterContainer = document.createElement("div");
  filterContainer.style.marginBottom = "20px";
  filterContainer.innerHTML = `
    <select id="price-filter">
      <option value="all">Todos os preços</option>
      <option value="low">Até R$ 50</option>
      <option value="medium">R$ 50 - R$ 80</option>
      <option value="high">Acima de R$ 80</option>
    </select>
    <select id="sort-filter">
      <option value="default">Ordenar por</option>
      <option value="price-low">Menor preço</option>
      <option value="price-high">Maior preço</option>
      <option value="name">Nome (A-Z)</option>
    </select>
  `;

  const catalog = document.querySelector(".lista-produtos");
  catalog.parentNode.insertBefore(filterContainer, catalog);

  const priceFilter = document.getElementById("price-filter");
  const sortFilter = document.getElementById("sort-filter");

  function applyFilters() {
    let filtered = [...produtos];

    // Filtro de preço
    const priceValue = priceFilter.value;
    if (priceValue === "low") filtered = filtered.filter((p) => p.preco <= 50);
    if (priceValue === "medium")
      filtered = filtered.filter((p) => p.preco > 50 && p.preco <= 80);
    if (priceValue === "high") filtered = filtered.filter((p) => p.preco > 80);

    // Ordenação
    const sortValue = sortFilter.value;
    if (sortValue === "price-low") filtered.sort((a, b) => a.preco - b.preco);
    if (sortValue === "price-high") filtered.sort((a, b) => b.preco - a.preco);
    if (sortValue === "name")
      filtered.sort((a, b) => a.nome.localeCompare(b.nome));

    // Render
    const container = document.querySelector(".lista-produtos");
    container.innerHTML = "";

    filtered.forEach((product) => {
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
    // reattach events after rendering
    adicionarEventosBotoesAdd();
  }

  priceFilter.addEventListener("change", applyFilters);
  sortFilter.addEventListener("change", applyFilters);
}
// ==================== MODAL DE DETALHES ====================
function showProductModal(product) {
  const modal = document.createElement("div");
  modal.className = "product-modal";
  modal.innerHTML = `
    <div class="card">
      <img src="${product.imagem}" alt="${product.nome}" style="width:100%;border-radius:8px;margin-bottom:12px">
      <h2>${product.nome}</h2>
      <p style="font-size:1.25rem;color:var(--danger);">R$ ${product.preco.toFixed(2)}</p>
      <div style="display:flex;gap:10px;justify-content:center;margin-top:12px">
        <button class="add-cart-modal" style="background:#071022;color:#fff;padding:10px 18px;border-radius:999px;border:none">Adicionar ao Carrinho</button>
        <button class="close-modal" style="background:#eee;padding:10px 18px;border-radius:999px;border:none">Fechar</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal
    .querySelector(".close-modal")
    .addEventListener("click", () => modal.remove());
  modal.querySelector(".add-cart-modal").addEventListener("click", () => {
    const existing = carrinho.find((p) => p.nome === product.nome);
    if (existing) existing.quantidade++;
    else carrinho.push({ ...product, quantidade: 1 });
    atualizarCarrinho();
    showToast(`${product.nome} adicionado ao carrinho!`);
    modal.remove();
  });
}

// Clique na imagem ou nome para abrir modal
document.querySelector(".lista-produtos").addEventListener("click", (e) => {
  if (e.target.tagName === "IMG" || e.target.tagName === "H2") {
    const item = e.target.closest(".item");
    const productId = parseInt(item.dataset.id);
    const product = produtos.find((p) => p.id === productId);
    if (product) showProductModal(product);
  }
});
// ==================== TOAST (notificação) ====================
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  if (toastContainer) {
    toastContainer.appendChild(toast);
  } else {
    document.body.appendChild(toast);
  }
  // force reflow then show
  requestAnimationFrame(() => toast.classList.add("show"));
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// Atualize a função de adicionar (no handleAddToCart ou no event listener do catálogo)
function addToCartWithToast(product) {
  const existing = carrinho.find((p) => p.nome === product.nome);
  if (existing) existing.quantidade++;
  else carrinho.push({ ...product, quantidade: 1 });

  atualizarCarrinho();
  showToast(`${product.nome} adicionado ao carrinho!`);
}

setupFilters();
setupSearch();
loadProducts();
atualizarCarrinho();
