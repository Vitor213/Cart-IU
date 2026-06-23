let iconCart = document.querySelector(".icone-cart");
let body = document.querySelector("body");
let closeCart = document.querySelector(".fechar");

iconCart.addEventListener("click", () => {
  body.classList.toggle("showCart");
});
closeCart.addEventListener("click", () => {
  body.classList.toggle("showCart");
});
