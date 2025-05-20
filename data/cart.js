export const cart = [
  {
    id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
    quantity: 10,
  },
  {
    id: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
    quantity: 6,
  },
];

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
