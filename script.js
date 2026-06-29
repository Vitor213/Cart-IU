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

// Adicionar produtos
btnAddCart.forEach(function (botao) {
  botao.addEventListener("click", function () {
    const item = botao.closest(".item");

    const nome = item.querySelector("h2").textContent;
    const preco = Number(item.querySelector(".preço").dataset.preco);
    const imagem = item.querySelector("img").src;

    const produto = {
      nome,
      preco,
      imagem,
      quantidade: 1,
    };
    console.log(produto);

    const produtoExistente = carrinho.find(function (item) {
      return item.nome === nome;
    });

    if (produtoExistente) {
      produtoExistente.quantidade++;
    } else {
      carrinho.push(produto);
    }

    atualizarCarrinho();
    salvarCarrinho();
  });
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
  const nome = item.querySelector("h2").textContent;
  const preco = Number(item.querySelector(".preço").dataset.preco);
  const imagem = item.querySelector("img").src;

  const produto = { nome, preco, imagem, quantidade: 1 };

  const produtoExistente = carrinho.find((p) => p.nome === nome);

  if (produtoExistente) {
    produtoExistente.quantidade++;
  } else {
    carrinho.push(produto);
  }

  atualizarCarrinho();
  salvarCarrinho();
}
atualizarCarrinho();
renderizarCatalogo();
