const title = document.querySelector("h1");
const preloader = document.querySelector(".preloader");
const header = document.querySelector(".header");
const body = document.querySelector("body");

setTimeout(() => {
  title.classList.add("animate__fadeOutLeftBig");
  setTimeout(() => {
    preloader.classList.add("hide");
    body.style.overflowY = "auto";
    Slider();
  }, 5000);
}, 2000);

// slider
const sliderItem = document.querySelector(".sliderIntro__images-item");
const lengthSlider = document.querySelectorAll(
  ".sliderIntro__images-item"
).length;

function Slider() {
  let counter = 1;

  setInterval(() => {
    if (counter === lengthSlider) counter = 0;
    sliderItem.style.marginLeft = `-${counter}00%`;
    ++counter;
  }, 10000);
}

// menu
const menu = document.querySelector(".menu");
const btnClose = document.querySelector(".menu__close");
const overlay = document.querySelector(".overlay");
const btnOpen = document.querySelector(".header__menu");
const links = document.querySelectorAll(".menu__list-link");

btnClose.addEventListener("click", closeMenu);
overlay.addEventListener("click", closeMenu);

function closeMenu() {
  overlay.classList.add("hide");
  menu.classList.remove("active");
}

btnOpen.addEventListener("click", openMenu);

function openMenu() {
  overlay.classList.remove("hide");
  menu.classList.add("active");
}

links.forEach((link) => link.addEventListener("click", closeMenu));

// Shopping Cart

let counterShoppingCart = document.querySelectorAll(".header__basket-counter");
const btnsShoppingCart = document.querySelectorAll(".header__basket-button");
const shoppingCartBlock = document.querySelector(".shoppingCart");
const btnCloseShoppingCart = document.querySelector(".shoppingCart__close");
const btnsAddToCart = document.querySelectorAll(".goods__box-itemBgBuy button");
const listShoppingCart = document.querySelector(".shoppingCart__list");
const totalUI = document.querySelector(".shoppingCart__totalPrice span");
const quantityGoodsUI = document.querySelector(
  ".shoppingCart__quantityGoods span"
);
const btnInfo = document.querySelector(".shoppingCart__infoPayment");
const blockInfo = document.querySelector(".shoppingCart__infoPayment-block");
const modalNotificationAddCart = document.querySelector(".modalIconProduct");
const modalNotificationWarningCart = document.querySelector(
  ".modalIconProduct.warning"
);

overlay.addEventListener("click", closeShoppingCart);
btnCloseShoppingCart.addEventListener("click", closeShoppingCart);
btnInfo.addEventListener("click", showMiniModal);
const warningText = document.querySelector(".shoppingCart__textWarning");

if (!Array.from(listShoppingCart.children).length) {
  const warningText = document.querySelector(".shoppingCart__textWarning");
  warningText.classList.add("active");
}

btnsAddToCart.forEach((btn) => {
  btn.addEventListener("click", addToCart);
});

btnsShoppingCart.forEach((btn) => {
  btn.addEventListener("click", openShoppingCart);
});

function showMiniModal() {
  blockInfo.classList.toggle("active");
}

function openShoppingCart(event) {
  shoppingCartBlock.classList.add("active");
  body.style.overflowY = "hidden";
  overlay.classList.remove("hide");
}

function closeShoppingCart() {
  shoppingCartBlock.classList.remove("active");
  body.style.overflowY = "auto";
  overlay.classList.add("hide");
}

function changeQuantityGoods(event) {
  const type = event.target.classList.value;
  let quantity = +event.target.parentElement.querySelector("span").textContent;
  const quantityUI = event.target.parentElement.querySelector("span");

  switch (type) {
    case "inc":
      quantity++;
      break;
    case "dec":
      if (quantity >= 1) {
        quantity--;
      }
  }

  quantityUI.innerHTML = quantity;
  updateTotalPrice();
}

function updateTotalPrice() {
  let totalPrice = 0;
  let fullQuantity = 0;
  const itemsShoppingCart = document.querySelectorAll(
    ".shoppingCart__list-item.block"
  );

  itemsShoppingCart.forEach((item) => {
    let price = parseFloat(
      item
        .querySelector(".shoppingCart__list-item.price")
        .textContent.replace("руб", "")
    );
    let quantity = parseFloat(
      item.querySelector(".shoppingCart__list-item.counter span").textContent
    );

    const btnsChangeQuantity = item.querySelectorAll(
      ".shoppingCart__list-item.counter button"
    );

    btnsChangeQuantity.forEach((btn) => {
      btn.addEventListener("click", changeQuantityGoods);
    });

    if (!quantity) removeItem(item);

    totalPrice += price * quantity;
    fullQuantity += quantity;

    totalUI.innerHTML = totalPrice;
    quantityGoodsUI.innerHTML = fullQuantity;
    counterShoppingCart.forEach((item) => (item.innerHTML = fullQuantity));
  });
}

function createBlock(event) {
  const parentBlock = event.target.parentElement.parentElement.parentElement;
  const srcImg = parentBlock.querySelector("img").getAttribute("src");
  const typeProduct = parentBlock
    .querySelector("button")
    .getAttribute("data-type");
  let price = 0;
  const types = {
    BIG: "Чеснок крупный",
    MIDDLE: "Чеснок средний",
    SMALL: "Чеснок маленький",
  };

  switch (typeProduct) {
    case types.BIG:
      price = 200;
      break;

    case types.MIDDLE:
      price = 150;
      break;

    case types.SMALL:
      price = 100;
      break;
  }

  return `
  <div class="shoppingCart__list-item block">
    <div class="shoppingCart__list-item product">
      <div class="shoppingCart__list-item img">
        <img src="${srcImg}" alt="imgProduct" />
      </div>
      <div class="shoppingCart__list-item nameProduct">
        ${typeProduct}
      </div>
    </div>
      <div class="shoppingCart__list-item counter">
        <button class="dec">-</button><span>1</span
         ><button class="inc">+</button>
      </div>
    <div class="shoppingCart__list-item price">${price}руб</div>
  </div>
  `;
}

function removeItem(item) {
  item.remove();
  if (!Array.from(listShoppingCart.children).length) {
    warningText.classList.add("active");
  }
}

function addToCart(event) {
  if (isAvailabilityGoods(event)) {
    modalNotificationWarningCart.style.top = "5%";
    setTimeout(() => {
      modalNotificationWarningCart.style.top = "-100%";
    }, 1500);
    return;
  }

  modalNotificationAddCart.style.top = "5%";
  setTimeout(() => {
    modalNotificationAddCart.style.top = "-100%";
  }, 1500);

  listShoppingCart.innerHTML += createBlock(event);
  if (Array.from(listShoppingCart.children).length > 1) {
    const titleCart = document.querySelector(".shoppingCart__title");
    titleCart.style.marginLeft = "-10px";
  }

  warningText.classList.remove("active");

  updateTotalPrice();
}

function isAvailabilityGoods(event) {
  const currentType = event.target.getAttribute("data-type");
  const arrayTypes = [];
  Array.from(listShoppingCart.children).forEach((block) => {
    const type = block.querySelector(".nameProduct").textContent.trim();
    arrayTypes.push(type);
  });

  if (arrayTypes.includes(currentType)) {
    return true;
  }
  return false;
}

updateTotalPrice();

window.addEventListener("scroll", showUIHelpers);
const btnArrowTop = document.querySelector(".arrowTop");
const btnCart = document.querySelector(".fixedCart");

function showUIHelpers() {
  const currentPositionScroll = window.scrollY;
  const currentHeight = window
    .getComputedStyle(header, null)
    .height.replace("px", "");

  if (currentPositionScroll > currentHeight) {
    btnArrowTop.classList.add("active");
    btnCart.classList.add("active");
  } else {
    btnArrowTop.classList.remove("active");
    btnCart.classList.remove("active");
  }
}

const targetLocation = document.querySelector(".location__target");
const targetHint = document.querySelector(".location__target a");

targetLocation.addEventListener("click", openModalLocation);

function openModalLocation() {
  targetHint.classList.toggle("active");
}
