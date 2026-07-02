const body = document.body;
const fechar = document.querySelector(".fechar");
const verCarrinho = document.querySelector(".icone-cart");
const btnAddCart = document.querySelectorAll(".add-cart");
const listaProdutos = document.querySelector(".lista-itens");
const contadorCart = document.querySelector(".icone-cart span");
const btnLimpar = document.getElementById("limpar-carrinho");
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
    nome,
    preco,
    imagem,
    quantidade: 1,
  };

  const produtoExistente = carrinho.find((p) => p.nome === nome);

  if (produtoExistente) {
    produtoExistente.quantidade++;
  } else {
    carrinho.push(produto);
  }

  atualizarCarrinho();
  salvarCarrinho();
}
// ==================== CONSUMO DE API ====================
async function loadProducts() {
  try {
    const response = await fetch("https://fakestoreapi.com/products?limit=5");
    const data = await response.json();

    // Atualiza o array de produtos com dados da API
    produtos.length = 0; // limpa o array atual

    data.forEach((item) => {
      produtos.push({
        id: item.id,
        nome: item.title.substring(0, 30),
        preco: item.price,
        imagem: item.image,
      });
    });

    renderizarCatalogo(); // re-renderiza com novos produtos
  } catch (error) {
    console.error("Erro ao carregar da API:", error);
    renderizarCatalogo(); // fallback
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

  searchInput.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase().trim();

    const filtered = produtos.filter((product) =>
      product.nome.toLowerCase().includes(term),
    );

    // Renderiza apenas os filtrados
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
  });
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
  }

  priceFilter.addEventListener("change", applyFilters);
  sortFilter.addEventListener("change", applyFilters);
}
// ==================== MODAL DE DETALHES ====================
function showProductModal(product) {
  const modal = document.createElement("div");
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.width = "100%";
  modal.style.height = "100%";
  modal.style.background = "rgba(0,0,0,0.8)";
  modal.style.display = "flex";
  modal.style.alignItems = "center";
  modal.style.justifyContent = "center";
  modal.style.zIndex = "1000";

  modal.innerHTML = `
    <div style="background:white; padding:20px; border-radius:12px; max-width:400px; text-align:center;">
      <img src="${product.imagem}" style="width:100%; border-radius:12px;">
      <h2>${product.nome}</h2>
      <p style="font-size:1.5rem; color:#e74c3c;">R$ ${product.preco.toFixed(2)}</p>
      <button class="add-cart-modal" style="background:#222; color:white; padding:12px 30px; border:none; border-radius:50px; margin:15px 0;">Adicionar ao Carrinho</button>
      <button onclick="this.parentElement.parentElement.remove()" style="background:#ddd; padding:8px 20px; border:none; border-radius:50px;">Fechar</button>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector(".add-cart-modal").addEventListener("click", () => {
    const existing = carrinho.find((p) => p.nome === product.nome);
    if (existing) existing.quantidade++;
    else carrinho.push({ ...product, quantidade: 1 });
    atualizarCarrinho();
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
  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.left = "50%";
  toast.style.transform = "translateX(-50%)";
  toast.style.background = "#27ae60";
  toast.style.color = "white";
  toast.style.padding = "12px 25px";
  toast.style.borderRadius = "50px";
  toast.style.boxShadow = "0 5px 15px rgba(0,0,0,0.2)";
  toast.style.zIndex = "2000";
  toast.style.opacity = "0";
  toast.style.transition = "all 0.3s";
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => (toast.style.opacity = "1"), 10);
  setTimeout(() => {
    toast.style.opacity = "0";
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
