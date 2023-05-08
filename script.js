const breakfastSelect = document.querySelector('select[name="breakfast"]');
const lunchSelect = document.querySelector('select[name="lunch"]');
const dinnerSelect = document.querySelector('select[name="dinner"]');
const cart = document.querySelector("#cart");
const totalPrice = document.querySelector("#total-price");

let breakfastCount = 0;
let lunchCount = 0;
let dinnerCount = 0;
let cartItems = [];

breakfastSelect.addEventListener("change", () => {
  breakfastCount = parseInt(breakfastSelect.value);
  updateCart();
});

lunchSelect.addEventListener("change", () => {
  lunchCount = parseInt(lunchSelect.value);
  updateCart();
});

dinnerSelect.addEventListener("change", () => {
  dinnerCount = parseInt(dinnerSelect.value);
  updateCart();
});

function addItemToCart(name, count, price) {
  const row = document.createElement("tr");
  const nameCell = document.createElement("td");
  nameCell.innerHTML = name;

  const countCell = document.createElement("td");
  const countValue = document.createElement("span");
  countValue.innerHTML = count;
  countValue.classList.add("count-value");
  // создаем кнопки "+" и "-" для увеличения и уменьшения количества выбранных блюд
  const minusButton = document.createElement("button");
  minusButton.innerHTML = "-";
  minusButton.classList.add("minus-button");
  minusButton.addEventListener("click", () => {
    if (count > 0) {
      count--;
      countValue.innerHTML = count;
      updateCart();
    }
  });
  const plusButton = document.createElement("button");
  plusButton.innerHTML = "+";
  plusButton.classList.add("plus-button");
  plusButton.addEventListener("click", () => {
    count++;
    countValue.innerHTML = count;
    updateCart();
  });
  countCell.appendChild(minusButton);
  countCell.appendChild(countValue);
  countCell.appendChild(plusButton);

  /*// добавляем обработчики клика на кнопки "+" и "-"
    plusButton.addEventListener("click", () => {
      countCell.innerHTML = parseInt(countCell.innerHTML) + 1;
      updateCart();
    });
    minusButton.addEventListener("click", () => {
      // количество выбранных блюд не может быть отрицательным
      if (parseInt(countCell.innerHTML) > 0) {
        countCell.innerHTML = parseInt(countCell.innerHTML) - 1;
        updateCart();
      }
    });
    // добавляем кнопки "+" и "-" в ячейку "countCell"
    countCell.appendChild(plusButton);
    countCell.appendChild(document.createTextNode(" "));
    countCell.appendChild(minusButton);
    // устанавливаем количество выбранных блюд
    countCell.appendChild(document.createElement("br"));
    countCell.appendChild(document.createTextNode(count));
    row.appendChild(nameCell);
    row.appendChild(countCell); */

  const priceCell = document.createElement("td");
  priceCell.innerHTML = `£${price}` * count;
  // устанавливаем цену в соответствии с выбранным блюдом
  /* if (name === "Яичница с беконом") {
      priceCell.innerHTML = 15;
    } else if (name === "Овсянка с фруктами") {
      priceCell.innerHTML = 10;
    } else if (name === "Сэндвич с сыром и овощами") {
      priceCell.innerHTML = 12;
    } else if (name === "Салат с курицей и авокадо") {
      priceCell.innerHTML = 20;
    } else if (name === "Спагетти с мясным соусом") {
      priceCell.innerHTML = 25;
    } else if (name === "Суп из овощей") {
      priceCell.innerHTML = 15;
    } else if (name === "Стейк с картошкой и овощами") {
      priceCell.innerHTML = 30;
    } else if (name === "Куриное филе с рисом и овощами") {
      priceCell.innerHTML = 25;
    } else if (name === "Салат с морепродуктами") {
      priceCell.innerHTML = 20;
    }
    row.appendChild(priceCell);
  } */

  const deleteCell = document.createElement("td");
  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = "Удалить";
  deleteButton.addEventListener("click", () => {
    const index = cartItems.findIndex((item) => item.name === name);
    if (index !== -1) {
      cartItems.splice(index, 1);
      updateCart();
    }
  });
  deleteCell.appendChild(deleteButton);

  row.appendChild(nameCell);
  row.appendChild(countCell);
  row.appendChild(priceCell);
  row.appendChild(deleteCell);
  cart.appendChild(row);

  cartItems.push({ name, count, price });
  updateCart();
}

function removeItem(name) {
  cartItems = cartItems.filter((item) => item.name !== name);
  updateCart();
}

function updateCart() {
  const counts = [breakfastCount, lunchCount, dinnerCount];
  let total = 0;
  for (let i = 0; i < counts.length; i++) {
    if (counts[i] > 0) {
      const select = [breakfastSelect, lunchSelect, dinnerSelect][i];
      const name = select.options[select.selectedIndex].text;
      const price = parseInt(select.value);
      const amount = counts[i];

      let itemAlreadyInCart = false;
      const cartRows = cart.getElementsByTagName("tr");
      for (let j = 0; j < cartRows.length; j++) {
        const cells = cartRows[j].getElementsByTagName("td");
        if (cells.length > 0 && cells[0].innerHTML === name) {
          cells[1].innerHTML = parseInt(cells[1].innerHTML) + amount;
          itemAlreadyInCart = true;
          break;
        }
      }

      if (!itemAlreadyInCart) {
        const row = document.createElement("tr");
        const nameCell = document.createElement("td");
        const amountCell = document.createElement("td");
        const priceCell = document.createElement("td");
        nameCell.innerHTML = name;
        amountCell.innerHTML = amount;
        priceCell.innerHTML = price;
        row.appendChild(nameCell);
        row.appendChild(amountCell);
        row.appendChild(priceCell);
        cart.appendChild(row);
      }

      total += price * amount;
    }
  }
  totalPrice.innerHTML = total;
}
