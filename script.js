const breakfastSelect = document.querySelector('select[name="breakfast"]');
const lunchSelect = document.querySelector('select[name="lunch"]');
const dinnerSelect = document.querySelector('select[name="dinner"]');
const cart = document.querySelector("#cart");
const totalPriceCell = document.getElementById("total-price-cell");
const table = document.querySelector(".table");

let cartItems = [];

breakfastSelect.addEventListener("change", () => {
  updateCart(breakfastSelect, "Завтрак", breakfastSelect.selectedIndex);
});

lunchSelect.addEventListener("change", () => {
  updateCart(lunchSelect, "Обед", lunchSelect.selectedIndex);
});

dinnerSelect.addEventListener("change", () => {
  updateCart(dinnerSelect, "Ужин", dinnerSelect.selectedIndex);
});

function updateCart(select, category, index) {
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
      index: index // Сохраняем индекс выбранного элемента
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

  totalPriceCell.textContent = totalPriceValue;
  renderTotalPrice();
}

function updateTotalPrice() {
  let totalPriceValue = 0;

  for (let i = 0; i < cartItems.length; i++) {
    const item = cartItems[i];
    const index = item.index; // Получаем индекс элемента
    const count = cartItems[i].amount;
    totalPriceValue += count * parseInt(select.options[index].value); // Умножаем количество на цену по индексу
  }

  totalPriceCell.textContent = totalPriceValue;
}

table.addEventListener("click", (event) => {
  if (event.target.classList.contains("item__button")) {
    const itemNumber = event.target.parentNode.querySelector(".item__number");
    const count = parseInt(itemNumber.textContent);
    const row = event.target.closest("tr");
    const name = row.cells[0].textContent;
    const itemIndex = cartItems.findIndex((item) => item.name === name);

    if (event.target.classList.contains("plus-button")) {
      itemNumber.textContent = count + 1;
      cartItems[itemIndex].amount += 1; // Увеличить количество товара в корзине
      const priceDifference = cartItems[itemIndex].price / (count + 1); // Вычислить разницу в цене для одного товара
      totalPriceCell.textContent = parseInt(totalPriceCell.textContent) + priceDifference; // Обновить итоговую сумму
    } else if (event.target.classList.contains("minus-button")) {
      if (count > 0) {
        itemNumber.textContent = count - 1;
        cartItems[itemIndex].amount -= 1; // Уменьшить количество товара в корзине
        const priceDifference = cartItems[itemIndex].price / (count - 1); // Вычислить разницу в цене для одного товара
        totalPriceCell.textContent = parseInt(totalPriceCell.textContent) - priceDifference; // Обновить итоговую сумму
      }
    }

    renderCart(); // Обновить содержимое корзины
  } else if (event.target.classList.contains("fas", "fa-trash")) {
    const row = event.target.parentNode.parentNode.parentNode;
    const name = row.cells[0].textContent;
    const itemIndex = cartItems.findIndex((item) => item.name === name);

    if (itemIndex !== -1) {
      const removedPrice = cartItems[itemIndex].price * cartItems[itemIndex].amount; // Получить цену удаляемого товара
      cartItems.splice(itemIndex, 1);
      renderCart();
      totalPriceCell.textContent = parseInt(totalPriceCell.textContent) - removedPrice; // Обновить итоговую сумму
    }
    updateTotalPrice(); // Обновить общую сумму заказа
  }
});


    


function renderTotalPrice() {
  const totalRow = document.createElement("tr");
  const totalLabelCell = document.createElement("td");
  const totalAmountCell = document.createElement("td");

  totalLabelCell.textContent = "Итого";
  totalLabelCell.colSpan = 1;
  totalAmountCell.textContent = totalPriceCell.textContent; // Отображаем общую сумму заказа

  totalRow.appendChild(totalLabelCell);
  totalRow.appendChild(totalAmountCell);

  cart.appendChild(totalRow);
}


