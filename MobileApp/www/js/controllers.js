/**
 * Created by Avialdo on 1/29/2016.
 */


angular.module("starter")

.controller("LoginController",function($scope,$http,$state,$ionicPopup){

  $scope.seller = {}
    $scope.login = function () {
      $http.post("http://localhost:8000/api/login",{data: $scope.seller})
        .success(function (response) {
          if(response.status) {
            localStorage.setItem("user",response.user.FirebaseToken);
            $state.go("home.services");
          }
          else {
            var alertPopup = $ionicPopup.alert({
              title: 'Alert!',
              template: response.message
            });

            alertPopup.then(function (res) {
              console.log(response.message);
            });
          }
        })

    }
  })


.controller("HomeController", function ($scope,$http) {

  })




.controller("ServicesController",function($scope,$http,$ionicLoading,$ionicModal,CheckoutFactory){



  $ionicModal.fromTemplateUrl('./views/product-model.html',{
    scope: $scope,
    animation: 'slide-in-up'
  })
    .then(function (modal) {
      $scope.modal = modal
    });

  $scope.openModal = function (product) {
    $scope.currentProduct = product;
    $scope.modal.show();

  };
  $scope.data = {
    showReorder : false
  };
  $scope.products = [];
  $ionicLoading.show();
  $http.get("http://localhost:8000/mobile/products")
    .success(function (response) {
      if(response.status){
        $ionicLoading.hide();
        $scope.products = response.products
      }
      else {
        $ionicLoading.show({
          template: response.message
        });
      }
    })
    .error(function (response) {
      $ionicLoading.show({
        template: response.message
      });
    });

  $scope.reorderItem = function (item, from, to) {
    $scope.products.splice(from,1);
    $scope.products.splice(to,0,item);
  };

  $scope.addProduct = function (product,quantity) {
    CheckoutFactory.addProduct(product,quantity);
    $scope.modal.hide()
  }
  })


.controller("OrderController", function ($scope,$http,$ionicLoading,$ionicPlatform,CheckoutFactory,$ionicPopup,$timeout,$cordovaGeolocation) {

  $scope.orders = CheckoutFactory.getProducts();
  $scope.total = CheckoutFactory.getTotal();
    var location = {},alertPopup;

  $scope.order = function () {


    if($scope.orders.length > 0) {
      $ionicPlatform.ready(function () {
        var user = localStorage.getItem("user");
        var posOptions = {timeout: 10000, enableHighAccuracy: false};
        $cordovaGeolocation
          .getCurrentPosition(posOptions)
          .then(function (position) {
            location.lat  = position.coords.latitude;
            location.long = position.coords.longitude;
            $ionicLoading.show();
            $http.post("http://localhost:8000/mobile/order/"+user,{order:$scope.orders,total:$scope.total,location:location})
              .success(function (response) {
                $ionicLoading.hide();
                if(response.status) {
                  alertPopup = $ionicPopup.alert({
                    title: 'Alert!',
                    template: "Order Sent Successfully"
                  });

                  alertPopup.then(function (res) {
                    console.log(response.message);
                  });
                }
                else {
                  alertPopup = $ionicPopup.alert({
                    title: 'Alert!',
                    template: response.message
                  });

                  alertPopup.then(function (res) {
                    console.log(response.message);
                  });
                }
              })
              .error(function (response) {
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                  title: 'Alert!',
                  template: response.message
                });

                alertPopup.then(function (res) {
                  console.log(response.message);
                });
              })
          }, function(err) {
            alertPopup = $ionicPopup.alert({
              title: 'Alert!',
              template: err
            });

            alertPopup.then(function (res) {
              console.log(res);
            });
          });

      });

    }
    else {
      alertPopup = $ionicPopup.alert({
        title: 'Alert!',
        template: "First Order any product"
      });

      alertPopup.then(function (res) {
        console.log(res);
      });
    }



  }
  });

