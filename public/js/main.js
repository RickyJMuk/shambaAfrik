
  var cart = [];

  document.querySelectorAll('.btn-primary').forEach(function(button) {
    button.addEventListener('click', function() {
      var product = JSON.parse(this.dataset.product);
      cart.push(product);
      updateCart();
    });
  });

  function updateCart() {
    var cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    cart.forEach(function(item) {
      var li = document.createElement('li');
      li.textContent = item.name + ' - ' + item.price;
      cartItems.appendChild(li);
    });
    document.getElementById('cart').style.display = 'block';
  }

  document.getElementById('checkout-btn').addEventListener('click', function() {
    // Initiate checkout process here
    console.log('Checkout clicked', cart);
  });
