let productsHTML = ``;

products.forEach((product) => {
  productsHTML += `<div class="product-container">
          <div class="product-image-container">
            <img class="product-image"
              src="${product.image}">
          </div>

          <div class="product-name limit-text-to-2-lines">
            ${product.name}
          </div>

          <div class="product-rating-container">
            <img class="product-rating-stars"
              src="images/ratings/rating-${product.rating.stars * 10}.png">
            <div class="product-rating-count link-primary">
              ${product.rating.count}
            </div>
          </div>

          <div class="product-price">
            $${(product.priceCents / 100).toFixed(2)}
          </div>

          <div class="product-quantity-container js-quantity-selector-${
            product.id
          }">
            <select>
              <option selected value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>

          <div class="product-spacer"></div>

          <div class="added-to-cart js-added-to-cart-${product.id}">
            <img src="images/icons/checkmark.png">
            <p>Added</p>
          </div>

          <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${
            product.id
          }">
            Add to Cart
          </button>
        </div>`;
});

document.querySelector(".js-products-grid").innerHTML = productsHTML;

let timeoutID;

document.querySelectorAll(".js-add-to-cart").forEach((button) => {
  button.addEventListener("click", () => {
    const productId = button.dataset.productId;

    let matchingItem;

    cart.forEach((item) => {
      if (productId === item.productId) {
        matchingItem = item;
      }
    });

    if (matchingItem) {
      matchingItem.quantity += 1;
    } else {
      cart.push({
        productId,
        quantity: 1,
      });
    }

    let cartQuantity = 0;
    cartQuantity += Number(
      document.querySelector(`.js-quantity-selector-${productId} select`).value
    );

    cart.forEach((item) => {
      cartQuantity += item.quantity;
    });

    document.querySelector(".js-cart-quantity").innerHTML = cartQuantity;

    document
      .querySelector(`.js-added-to-cart-${productId}`)
      .classList.add("added-to-cart-sccss");

    clearTimeout(timeoutID);
    timeoutID = setTimeout(() => {
      document
        .querySelector(`.js-added-to-cart-${productId}`)
        .classList.remove("added-to-cart-sccss");
    }, 2000);

    // end of setTimeout
  });
  // end of button.addEventListener
});
// end of document.querySelectorAll(".js-add-to-cart").forEach((button)
