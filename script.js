const body = document.body;
const fechar = document.querySelector(".fechar");
const verCarrinho = document.querySelector(".icone-cart");
const btnAddCart = document.querySelectorAll(".add-cart");

const carrinho = [];
verCarrinho.addEventListener("click", function () {
  body.classList.toggle("show-cart");
});
fechar.addEventListener("click", function () {
  body.classList.remove("show-cart");
});
btnAddCart.forEach(function (botao) {
  botao.addEventListener("click", function () {
    const item = botao.closest(".item");
    console.log(item);

    const nome = item.querySelector("h2").textContent;
    const preco = item.querySelector(".preço").textContent;
    const imagem = item.querySelector("img").src;

    console.log(nome);
    console.log(preco);
    console.log(imagem);

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

    console.log(carrinho);
  });
});
