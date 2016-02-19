/**
 * Created by noman on 13-Feb-16.
 */


angular.module("starter")

.factory("CheckoutFactory", function () {
  var allProducts = []
  var total = 0;
  var difference = 0;


  return {
    addProduct : addProduct,
    editProduct : editProduct,
    getProducts:getProducts,
    getTotal:getTotal
  }

  function addProduct(product,quantity){
    total += (product.Price * quantity);
    allProducts.push({product: product,quantity: quantity});
  }


  function editProduct(product,quantity) {
    for(var a = 0; a < allProducts.length;a++) {
      if(allProducts[a].product._id == product._id){
        diff = allProducts[a].quantity - quantity;
        if(diff < 0) {
          allProducts[a].quantity = quantity;
          diff = (diff * -1);
          total += (product.Price * diff);
        }
      }
    }
  }

  function getProducts() {
    return allProducts;
  }

  function getTotal() {
    return total;
  }



  });
