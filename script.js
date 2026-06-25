const body = document.body;
const fechar = document.querySelector(".fechar");
const verCarrinho = document.querySelector(".icone-cart");
const btnAddCart = document.querySelectorAll(".add-cart");
const listaProdutos = document.querySelector(".lista-itens");
const contadorCart = document.querySelector(".icone-cart span");

const carrinho = [];

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
    const preco = item.querySelector(".preço").textContent;
    const imagem = item.querySelector("img").src;

    const produto = {
      nome,
      preco,
      imagem,
      quantidade: 1,
    };

    const produtoExistente = carrinho.find(function (item) {
      return item.nome === nome;
    });

    if (produtoExistente) {
      produtoExistente.quantidade++;
    } else {
      carrinho.push(produto);
    }

    atualizarCarrinho();
  });
});

// Atualizar interface
function atualizarCarrinho() {
  listaProdutos.innerHTML = "";

  carrinho.forEach(function (produto, index) {
    const html = `
      <div class="produtos">
      <div class="imagem">
      <img src="${produto.imagem}">
        </div>
        <div class="nome">
          <h2>${produto.nome}</h2>
        </div>
        <div class="preco">
          ${produto.preco}
        </div>

        <div class="quantidade">
          <span class="minus" data-index="${index}">-</span>
          <span>${produto.quantidade}</span>
          <span class="plus" data-index="${index}">+</span>
        </div>
      </div>
    `;

    listaProdutos.innerHTML += html;
  });

  const botoesPlus = document.querySelectorAll(".plus");
  const botoesMinus = document.querySelectorAll(".minus");

  botoesPlus.forEach(function (botao) {
    botao.addEventListener("click", function () {
      const index = botao.dataset.index;

      carrinho[index].quantidade++;

      atualizarCarrinho();
    });
  });

  botoesMinus.forEach(function (botao) {
    botao.addEventListener("click", function () {
      const index = botao.dataset.index;
      if (carrinho[index].quantidade > 1) {
        carrinho[index].quantidade--;
      } else {
        carrinho.splice(index, 1);
      }

      atualizarCarrinho();
    });
  });

  let totalItens = 0;

  carrinho.forEach(function (produto) {
    totalItens += produto.quantidade;
  });

  contadorCart.textContent = totalItens;
}
