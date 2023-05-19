const breakfastSelect = document.querySelector('select[name="breakfast"]');
const lunchSelect = document.querySelector('select[name="lunch"]');
const dinnerSelect = document.querySelector('select[name="dinner"]');
const cart = document.querySelector("#cart");
const totalPrice = document.querySelector("#total-price");
const table = document.querySelector(".table");

let cartItems = [];

breakfastSelect.addEventListener("change", () => {
  updateCart(breakfastSelect, "Завтрак");
});

lunchSelect.addEventListener("change", () => {
  updateCart(lunchSelect, "Обед");
});

dinnerSelect.addEventListener("change", () => {
  updateCart(dinnerSelect, "Ужин");
});

function updateCart(select, category) {
  const selectedOption = select.options[select.selectedIndex];
  const name = selectedOption.text;
  const price = parseInt(selectedOption.value);
  const amount = 1;

  let itemAlreadyInCart = false;
  let itemIndex = -1;

  for (let i = 0; i < cartItems.length; i++) {
    if (cartItems[i].name === name) {
      itemAlreadyInCart = true;
      itemIndex = i;
      break;
    }
  }

  if (itemAlreadyInCart) {
    cartItems[itemIndex].amount += amount;
  } else {
    cartItems.push({
      name: name,
      amount: amount,
      price: price,
    });
  }

  renderCart();
}

function renderCart() {
  cart.innerHTML = "";

  let totalPriceValue = 0;

  for (let i = 0; i < cartItems.length; i++) {
    const item = cartItems[i];
    const row = document.createElement("tr");
    const nameCell = document.createElement("td");
    const amountCell = document.createElement("td");
    const priceCell = document.createElement("td");
    const deleteCell = document.createElement("td");
    const deleteIcon = document.createElement("i");

    deleteIcon.classList.add("fas", "fa-trash");
    deleteIcon.setAttribute("type", "icon");
    deleteIcon.innerHTML = "";

    nameCell.innerHTML = item.name;

    const amountCellContainer = document.createElement("div");
    amountCellContainer.className = "item__counter";

    const minusButton = document.createElement("button");
    minusButton.type = "button";
    minusButton.className = "item__button minus-button";
    minusButton.textContent = "-";
    amountCellContainer.appendChild(minusButton);

    const itemNumber = document.createElement("span");
    itemNumber.className = "item__number";
    itemNumber.textContent = item.amount;
    amountCellContainer.appendChild(itemNumber);

    const plusButton = document.createElement("button");
    plusButton.type = "button";
    plusButton.className = "item__button plus-button";
    plusButton.textContent = "+";
    amountCellContainer.appendChild(plusButton);

    minusButton.addEventListener("click", function () {
      const row = this.parentNode.parentNode;
      const itemName = row.querySelector("td:first-child").textContent;
      updateCartItem(itemName, -1);
    });

    plusButton.addEventListener("click", function () {
      const row = this.parentNode.parentNode;
      const itemName = row.querySelector("td:first-child").textContent;
      updateCartItem(itemName, 1);
    });

    amountCell.appendChild(amountCellContainer);
    priceCell.innerHTML = item.price;

    deleteIcon.addEventListener("click", function () {
      cartItems.splice(i, 1);
      renderCart(); // Обновить корзину после удаления строки
    });

    row.appendChild(nameCell);
    row.appendChild(amountCell);
    row.appendChild(priceCell);
    row.appendChild(deleteCell);
    deleteCell.appendChild(deleteIcon);
    cart.appendChild(row);

    totalPriceValue += item.price * item.amount;
  }

  totalPrice.textContent = totalPriceValue;
  renderTotalPrice();
}
function updateTotalPrice() {
  let totalPriceValue = 0;
  const priceCells = document.querySelectorAll(".table td:nth-child(3)");

  for (let i = 0; i < cartItems.length; i++) {
    const item = cartItems[i];
    totalPriceValue += item.price * item.amount;
  }

  totalPriceCell.textContent = totalPriceValue;
}
table.addEventListener("click", (event) => {
  if (event.target.classList.contains("item__button")) {
    const itemNumber = event.target.parentNode.querySelector(".item__number");
    const count = parseInt(itemNumber.textContent);
    const row = event.target.closest("tr");
    const priceCell = row.querySelector("td:nth-child(3)");
    let price = parseInt(priceCell.textContent);

    if (event.target.classList.contains("plus-button")) {
      itemNumber.textContent = count + 1;
      cartItems[itemIndex].price += price; // Увеличить цену
      priceCell.textContent = price;
      updateCartItem(event.target.parentNode.parentNode);
    } else if (event.target.classList.contains("minus-button")) {
      if (count > 0) {
        itemNumber.textContent = count - 1;
        cartItems[itemIndex].price -= price; // Уменьшить цену
        priceCell.textContent = price;
        updateCartItem(event.target.parentNode.parentNode);
      }
    }
    updateTotalPrice();
  } else if (event.target.classList.contains("fas", "fa-trash")) {
    const row = event.target.parentNode.parentNode.parentNode;
    const name = row.cells[0].textContent;
    const itemIndex = cartItems.findIndex((item) => item.name === name);

    if (itemIndex !== -1) {
      cartItems.splice(itemIndex, 1);
      renderCart();
    }
    updateTotalPrice();
  }
});

function updateCartItem(row) {
  const name = row.cells[0].textContent;
  const amount = parseInt(row.querySelector(".item__number").textContent);
  const price = parseInt(row.cells[2].textContent);
  const itemIndex = cartItems.findIndex((item) => item.name === name);

  if (itemIndex !== -1) {
    cartItems[itemIndex].amount = amount;
    cartItems[itemIndex].price = price * amount; // Обновить цену
  }

  renderCart();
  renderTotalPrice();
}

function renderTotalPrice() {
  const totalRow = document.createElement("tr");
  const totalLabelCell = document.createElement("td");
  const totalAmountCell = document.createElement("td");
  const totalPriceCell = document.createElement("td");

  totalLabelCell.textContent = "Итого";
  totalLabelCell.colSpan = 1;
  totalAmountCell.textContent = "";
  totalPriceCell.textContent = totalPrice.textContent;

  totalRow.appendChild(totalLabelCell);
  totalRow.appendChild(totalAmountCell);
  totalRow.appendChild(totalPriceCell);

  cart.appendChild(totalRow);
}
