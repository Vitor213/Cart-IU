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

  document.querySelectorAll(".plus").forEach((botao) => {
    botao.addEventListener("click", function () {
      const index = parseInt(this.dataset.index);
      carrinho[index].quantidade++;
      atualizarCarrinho();
      salvarCarrinho(); // ← importante
    });
  });

  document.querySelectorAll(".minus").forEach((botao) => {
    botao.addEventListener("click", function () {
      const index = parseInt(this.dataset.index);
      if (carrinho[index].quantidade > 1) {
        carrinho[index].quantidade--;
      } else {
        carrinho.splice(index, 1);
      }
      atualizarCarrinho();
      salvarCarrinho(); // ← importante
    });
  });

  document.querySelectorAll(".btn-remover").forEach((botao) => {
    botao.addEventListener("click", function () {
      const index = parseInt(this.dataset.index);
      removerItem(index);
    });
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
atualizarCarrinho();
