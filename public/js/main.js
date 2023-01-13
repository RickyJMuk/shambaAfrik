const items = [
  {
    image: 'images/bagasse.jpg',
    description: '<p>Sugarcane Bagasse<br><span>1 tonne @ KES 1200</span><br><button action="/buy" type="submit" name="buy">Buy</button> </p>'
  },
  {
    image: 'images/kunde.jpg',
    description: '<p>Cowpeas seeds<br><span>1kg @ KES 200</span><br><button action="/buy" type="submit" name="buy">Buy</button> </p>'
  },
  {
    image: 'images/earthworms.jpg',
    description: '<p>Red Earthworms<br><span>1kg @ KES 2500</span><br><button action="/buy" type="submit" name="buy">Buy</button> </p>'
  },
  {
    image: 'images/neem.jpg',
    description: '<p>Neem Oil Pesticide<br><span>1ltr @ KES 2000</span><br><button action="/buy" type="submit" name="buy">Buy</button> </p>'
  },
  {
    image: 'images/pyrethrin.jpg',
    description: '<p>Natural Pryethrin Pesticide<br><span>1ltr @ KES 2000</span><br><button action="/buy" type="submit" name="buy">Buy</button> </p>'
  },
  {
    image: 'images/garlic.jpeg',
    description: '<p>Garlic Extract Pesticide<br><span>1ltr @ KES 2000</span><br><button action="/buy" type="submit" name="buy">Buy</button> </p>'
  },
  {
    image: 'images/manure.jpg',
    description: '<p>Animal manure<br><span>1 tonne @ KES 3000</span><br><button action="/buy" type="submit" name="buy">Buy</button></p>'
  },
  {
    image: 'images/lime.jpeg',
    description: '<p>Lime dust<br><span>25kg tonne @ KES 700</span><br><button action="/buy" type="submit" name="buy">Buy</button></p>'
  },
  {
    image: 'images/biochar.jpeg',
    description: '<p>Biochar<br><span>20kg @ KES 600</span><br><button action="/buy" type="submit" name="buy">Buy</button></p>'
  },
  {
    image: 'images/maasaisheep.jpg',
    description: '<p>Red Masaai Sheep<br><span>1 @ KES 4500</span><br><button action="/buy" type="submit" name="buy">Buy</button></p>'
  },
  {
    image: 'images/somalisheep.jpg',
    description: '<p>Somali Sheep<br><span>1 @ KES 5000</span><br><button action="/buy" type="submit" name="buy">Buy</button></p>'
  },
  {
    image: 'images/gallagoats.jpg',
    description: '<p>Gala Goats<br><span>1 @ KES 5000</span><br><button action="/buy" type="submit" name="buy">Buy</button></p>'
  },
  {
    image: 'images/seedlings.jpg',
    description: '<p>Indigenous Avocado Seedlings<br><span>1 seedling @ KES 100</span><br><button action="/buy" type="submit" name="buy">Buy</button></p>'
  },
  {
    image: 'images/clover.jpeg',
    description: '<p>Clover Seeds<br><span>1kg @ KES 350</span><br><button action="/buy" type="submit" name="buy">Buy</button></p>'
  },

];

const gridContainer = document.getElementById('grid-container');

items.forEach(item => {
  // Create a new grid item
  const gridItem = document.createElement('div');
  gridItem.classList.add('grid-item');

  // Add the item's picture and description
  gridItem.innerHTML = `
      <img src="${item.image}" alt="">
      <p>${item.description}</p>
    `;

  // Add the grid item to the grid container
  gridContainer.appendChild(gridItem);
});
