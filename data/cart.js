export const cart = [];

export function addToCart(productId) {
  let matchingItem;

  const quantity = Number(
    document.querySelector(`.js-quantity-selector-${productId} select`).value
  );

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  if (matchingItem) {
    matchingItem.quantity += quantity;
  } else {
    cart.push({
      productId,
      quantity,
    });
  }
}