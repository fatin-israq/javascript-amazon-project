import {
  cart,
  removeFromCart,
  cartQuantity,
  saveToStorage,
} from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";

let cartProductHTML = "";
let matchingItem;

updateCheckoutItem();

function updateCheckoutItem() {
  if (cartQuantity()) {
    document.querySelector(
      ".js-checkout-header-middle-section"
    ).innerHTML = `Checkout (<a class="return-to-home-link"
            href="amazon.html">${cartQuantity()} items</a>)`;
  }
}

cart.forEach((cartItem) => {
  products.forEach((productItem) => {
    if (productItem.id === cartItem.productId) {
      matchingItem = productItem;
      return;
    }
  });

  if (matchingItem) {
    cartProductHTML += `<div class="cart-item-container js-cart-item-container-${
      matchingItem.id
    }">
    <div class="delivery-date">
        Delivery date: Tuesday, June 21
    </div>

    <div class="cart-item-details-grid">
        <img class="product-image"
        src="${matchingItem.image}">

        <div class="cart-item-details">
        <div class="product-name">
            ${matchingItem.name}
        </div>
        <div class="product-price">
            $${formatCurrency(matchingItem.priceCents)}
        </div>
        <div class="product-quantity">
            <span>
            Quantity: <span class="quantity-label">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary js-update-link js-is-updating-${
              matchingItem.id
            }" data-product-id="${matchingItem.id}">
            Update
            </span>
            <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${
              matchingItem.id
            }">
            Delete
            </span>
        </div>
        </div>

        <div class="delivery-options">
        <div class="delivery-options-title">
            Choose a delivery option:
        </div>
        <div class="delivery-option">
            <input type="radio" checked
            class="delivery-option-input"
            name="delivery-option-${matchingItem.id}">
            <div>
            <div class="delivery-option-date">
                Tuesday, June 21
            </div>
            <div class="delivery-option-price">
                FREE Shipping
            </div>
            </div>
        </div>
        <div class="delivery-option">
            <input type="radio"
            class="delivery-option-input"
            name="delivery-option-${matchingItem.id}">
            <div>
            <div class="delivery-option-date">
                Wednesday, June 15
            </div>
            <div class="delivery-option-price">
                $4.99 - Shipping
            </div>
            </div>
        </div>
        <div class="delivery-option">
            <input type="radio"
            class="delivery-option-input"
            name="delivery-option-${matchingItem.id}">
            <div>
            <div class="delivery-option-date">
                Monday, June 13
            </div>
            <div class="delivery-option-price">
                $9.99 - Shipping
            </div>
            </div>
        </div>
        </div>
    </div>
    </div>`;
  }
});

document.querySelector(".js-order-summary").innerHTML = cartProductHTML;

document.querySelectorAll(".js-delete-link").forEach((link) => {
  link.addEventListener("click", () => {
    const productId = link.dataset.productId;
    removeFromCart(productId);

    const removedElement = document.querySelector(
      `.js-cart-item-container-${productId}`
    );
    removedElement.remove();
    updateCheckoutItem();
  });
});

document.querySelectorAll(".js-update-link").forEach(attachUpdateListener);

function attachUpdateListener(updateLink) {
  updateLink.addEventListener("click", () => {
    const productId = updateLink.dataset.productId;
    const quantityContainer = updateLink.closest(".product-quantity");

    if (quantityContainer) {
      const oldQuantity =
        quantityContainer.querySelector(".quantity-label").textContent;

      const originalHTML = quantityContainer.innerHTML;
      //   console.log(originalHTML);

      quantityContainer.innerHTML = `
        Quantity: <input type="number" class="quantity-input" value="${oldQuantity}" min="1" style="width: 50px">
        <span class="update-quantity-link link-primary js-save-link" data-product-id="${productId}">
          Save
        </span>
        <span class="delete-quantity-link link-primary js-cancel-link" data-product-id="${productId}">
          Cancel
        </span>
      `;

      const saveButton = quantityContainer.querySelector(".js-save-link");
      const cancelButton = quantityContainer.querySelector(".js-cancel-link");

      function saveHandler() {
        const newQuantity = Number(
          quantityContainer.querySelector(".quantity-input").value
        );

        // Update cart with new quantity
        cart.forEach((cartItem) => {
          if (cartItem.productId === productId) {
            cartItem.quantity = newQuantity;
          }
        });

        // Save to localStorage
        saveToStorage();

        // Update UI
        quantityContainer.innerHTML = originalHTML;
        quantityContainer.querySelector(".quantity-label").textContent =
          newQuantity;

        // Update checkout header
        updateCheckoutItem();

        // Remove event listeners to prevent memory leaks
        saveButton.removeEventListener("click", saveHandler);
        cancelButton.removeEventListener("click", cancelHandler);
      }

      function cancelHandler() {
        quantityContainer.innerHTML = originalHTML;

        // Remove event listeners
        saveButton.removeEventListener("click", saveHandler);
        cancelButton.removeEventListener("click", cancelHandler);
      }

      const newUpdateLink = quantityContainer.querySelector(".js-update-link");
      if (newUpdateLink) {
        attachUpdateListener(newUpdateLink);
      }

      saveButton.addEventListener("click", saveHandler);
      cancelButton.addEventListener("click", cancelHandler);
    }
  });
}
