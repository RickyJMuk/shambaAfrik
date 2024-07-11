// Get the cart container and cart items container
const cartContainer = document.getElementById('cart');
const cartItemsContainer = document.getElementById('cart-items');

// Get all the buy buttons
const buyButtons = document.querySelectorAll('button[name="buy"]');

// Add event listener to each buy button
buyButtons.forEach((button) => {
  button.addEventListener('click', (e) => {
    // Get the product data from the button
    const productData = JSON.parse(button.getAttribute('data-product'));

    // Create a new cart item element
    const cartItemElement = document.createElement('div');
    cartItemElement.className = 'list-group-item';
    cartItemElement.innerHTML = `
      <h5>${productData.name}</h5>
      <p>Quantity: 1</p>
      <p>Price: KES ${productData.price}</p>
    `;

    // Add the cart item element to the cart items container
    cartItemsContainer.appendChild(cartItemElement);

    // Show the cart container
    cartContainer.style.display = 'block';
  });
});

// Add event listener to the drop cart button
document.getElementById('drop-cart-btn').addEventListener('click', () => {
  // Clear the cart items container
  cartItemsContainer.innerHTML = '';

  // Hide the cart container
  cartContainer.style.display = 'none';
});

// Add event listener to the checkout button
document.getElementById('checkout-btn').addEventListener('click', () => {
  // Get all the cart items
  const cartItems = cartItemsContainer.children;

  // Calculate the total cost
  let totalCost = 0;
  Array.from(cartItems).forEach((cartItem) => {
    const priceText = cartItem.querySelector('p:nth-child(3)').textContent;
    const price = parseFloat(priceText.replace('KES ', ''));
    totalCost += price;
  });

  // Display the total cost
  alert(`Total cost: KES ${totalCost.toFixed(2)}`);

  // Get customer input for M-Pesa number and pick-up point
  const mpesaNumberInput = document.getElementById('mpesa-number');
  const pickUpPointSelect = document.getElementById('pick-up-point');

  const mpesaNumber = mpesaNumberInput.value;
  const pickUpPoint = pickUpPointSelect.value;

  if (!mpesaNumber ||!pickUpPoint) {
    alert('Please enter your M-Pesa number and pick-up point');
    return;
  }

  // Integrate M-Pesa payment gateway
  const mpesaPaymentGateway = 'https://api.m-pesa.com/v1/payments';
  const mpesaApiKey = 'YOUR_M-PESA_API_KEY';
  const mpesaApiSecret = 'YOUR_M-PESA_API_SECRET';
  const mpesaBusinessShortCode = 'YOUR_M-PESA_BUSINESS_SHORT_CODE';
  const mpesaTransactionType = 'CustomerPayBillOnline';
  const mpesaAmount = totalCost;
  const mpesaPhoneNumber = mpesaNumber;

  const mpesaPaymentRequest = {
    'BusinessShortCode': mpesaBusinessShortCode,
    'Password': mpesaApiSecret,
    'Timestamp': new Date().getTime(),
    'TransactionType': mpesaTransactionType,
    'Amount': mpesaAmount,
    'PartyA': mpesaPhoneNumber,
    'PartyB': mpesaBusinessShortCode,
    'PhoneNumber': mpesaPhoneNumber,
    'CallBackURL': 'https://example.com/callback',
    'AccountReference': 'Your account reference',
    'TransactionDesc': 'Your transaction description'
  };

  fetch(mpesaPaymentGateway, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${mpesaApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(mpesaPaymentRequest)
  })
 .then(response => response.json())
 .then(data => {
    console.log(data);
    // Handle payment response
  })
 .catch(error => {
    console.error(error);
    // Handle payment error
  });

  // Save pick-up point to local storage
  localStorage.setItem('pickUpPoint', pickUpPoint);

  // Clear the cart
  cartItemsContainer.innerHTML = '';
  cartContainer.style.display = 'none';
});