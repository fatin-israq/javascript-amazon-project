import {
  cart,
  removeFromCart,
  cartQuantity,
  saveToStorage,
  updateDeliveryOption,
} from "../../data/cart.js";

import { products, getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import {
  deliveryOptions,
  getDeliveryOption,
} from "../../data/deliveryOptions.js";

import { renderPaymentSummary } from "./paymentSummary.js";

export function renderOrderSummary() {
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
    matchingItem = getProduct(cartItem.productId);
    const deliveryOptionId = cartItem.deliveryOptionId;

    let deliveryOption = getDeliveryOption(deliveryOptionId);

    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
    const dateString = deliveryDate.format("dddd, MMMM DD");

    if (matchingItem) {
      cartProductHTML += `<div class="cart-item-container js-cart-item-container-${
        matchingItem.id
      }">
    <div class="delivery-date">
        Delivery date: ${dateString}
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
        ${deliveryOptionsHTML(matchingItem, cartItem)}
        </div>
    </div>
    </div>`;
    }
  });

  function deliveryOptionsHTML(matchingItem, cartItem) {
    let html = "";

    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();
      const deliveryDate = today.add(deliveryOption.deliveryDays, "days");

      // Friday delivery is closed for Bangladesh
      if (deliveryDate.format("dddd") === "Friday") {
        deliveryDate = deliveryDate.add(1, "days");
      }
      
      const dateString = deliveryDate.format("dddd, MMMM DD");
      const priceString =
        deliveryOption.priceCents === 0
          ? "FREE"
          : `$${formatCurrency(deliveryOption.priceCents)} -`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html += `
        <div class="delivery-option js-delivery-option" data-product-id="${
          matchingItem.id
        }" data-delivery-option-id="${deliveryOption.id}">
            <input type="radio" ${isChecked ? "checked" : ""}
            class="delivery-option-input"
            name="delivery-option-${matchingItem.id}">
            <div>
            <div class="delivery-option-date">
                ${dateString}
            </div>
            <div class="delivery-option-price">
                ${priceString} Shipping
            </div>
            </div>
        </div>
    `;
    });

    return html;
  }

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
      renderPaymentSummary();
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
          renderPaymentSummary();

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

        const newUpdateLink =
          quantityContainer.querySelector(".js-update-link");
        if (newUpdateLink) {
          attachUpdateListener(newUpdateLink);
        }

        saveButton.addEventListener("click", saveHandler);
        cancelButton.addEventListener("click", cancelHandler);
      }
    });
  }

  document.querySelectorAll(".js-delivery-option").forEach((element) => {
    element.addEventListener("click", () => {
      const { productId, deliveryOptionId } = element.dataset;

      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
}
