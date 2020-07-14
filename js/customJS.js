
 <script>
 $(function () {
  $('.material-tooltip-main').tooltip({
    template: '<div class="tooltip md-tooltip"><div class="tooltip-arrow md-arrow"></div><div class="tooltip-inner md-inner"></div></div>'
  });
})





/*cart*/
$('.add-to-cart').on('click', (e) => {
  addToCart(e.currentTarget)
})

const addToCart = (product) => {
  const productId = $(product).attr('productId');
  const isAlreadyInCart = $.grep(productsInCart, el => {return el.id == productId}).length;

  if (isAlreadyInCart) {
    $.each(storageData, (i, el) => {
      if (productId == el.id) {
        el.itemsNumber += 1;
      }
    })
  } else {
    const newProduct = {
      id: Number(productId),
      itemsNumber: 1
    }

    storageData.push(newProduct);
  }

  updateCart();
  updateProductList();
}
/*end cart*/


/*import products*/
$(document).ready(() => {
  let storageData = [];

  $.get("product.json", (res) => {
    productList = res;

    const isStorageEmpty = Cookies.getStorage('cart').length === 0;

    if (!isStorageEmpty) {
      storageData = Cookies.getStorage('cart');
    }

    updateCart();
    buildProductList();
    buildDropdownCart();
    bindProductEvents();
  });
});
/*parse*/
const updateCart = () => {
  Cookies.setStorage('cart', storageData);
  productsInCart = [];

  parseStorageDataWithProduct();
  updatePill();
  updateTotalAmount();
}

const parseStorageDataWithProduct = () => {
  $.each(storageData, (i, el) => {
    const id = el.id;
    const itemsNumber = el.itemsNumber;

    $.each(productList, (i, el) => {
      if (id == el.id) {
        el.itemsNumber = itemsNumber;
        productsInCart.push(el)
      }
    });
  });
}

const updatePill = () => {
  let itemsInCart = 0;

  $.each(productsInCart, (i, el) => {
    itemsInCart += el.itemsNumber;
  });

  $('.badge-pill').html(itemsInCart);
}

const updateTotalAmount = () => {
  let total = 0;
  const shippingCost = 0;
  let summary = (total + shippingCost).toFixed(2);

  $.each(productsInCart, (i, el) => {
    total += el.itemsNumber * el.price;
  });

  $('#total-price').html(`$${total.toFixed(2)}`);
  $('#shipping-price').html(shippingCost === 0 ? 'Free' : `$${shippingCost}`);
  $('#summary').html(`$${summary}`);
}
</script>