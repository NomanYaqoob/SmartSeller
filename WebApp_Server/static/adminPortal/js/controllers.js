angular.module('starter')
	.controller("loginCtrl", function ($scope, $http, $state, $ionicPopup) {
		$scope.user = {};
		$scope.doLogin = function () {
			$http.post("/api/login", { data: $scope.user })
				.success(function (response) {
					console.log(response);
					if (response.status) {
						localStorage.setItem("userLog", response.user.FirebaseToken);
						$http.get("/api/companycount/" + response.user.FirebaseToken)
							.success(function (count) {
								if (count) {
									$state.go("home.employees");
								}
								else {
									$state.go("home.company");
								}
							})
							.error(function (err) {
								console.log(err);
							});

					} else {
						var alertPopup = $ionicPopup.alert({
							title: 'Alert!',
							template: response.message
						});

						alertPopup.then(function (res) {
							console.log(response.message);
						});
					}
				})
				.error(function (err) {
					console.log(err);
				});
		};

	})
	.controller("signupCtrl", function ($scope, $http, $state, $ionicPopup, $ionicLoading) {
		$scope.user = {};
		$scope.signupUser = function (eve) {
			$ionicLoading.show({
				template: "Loading..."
			})
			$scope.user.AccountType = "";
			$http.post("/api/signup", { data: $scope.user })
				.success(function (response) {
					$ionicLoading.hide();
					console.log(response);
					if (response.status) {
						var alertPopup = $ionicPopup.alert({
							title: 'Welcome!',
							template: "Your Account has been created"
						});

						alertPopup.then(function (res) {
							console.log(response.message);
						});
						$state.go("login");
					}
					else if (response.message.code == 'EMAIL_TAKEN') {
						var alertPopup = $ionicPopup.alert({
							title: 'Alert!',
							template: "This Email is Already Registered"
						});

						alertPopup.then(function (res) {
							console.log(response.message);
						});
						$scope.user = {};
					}
				})
				.error(function (err) {
                    $ionicLoading.hide();
					console.log(err);
				});
		};


	})


	.controller("CompanyController", function ($scope, $http, $state, $ionicPopup) {

		$scope.company = {};
		$scope.addCompany = function () {
			var token = localStorage.getItem("userLog");
			$scope.company.Owner = token;
			$http.post("/api/addcompany", { data: $scope.company })
				.then(function (response) {
					console.log(response.data);
					console.log(response);
					if (response.data.status) {
						var alertPopup = $ionicPopup.alert({
							template: response.message
						});

						alertPopup.then(function (res) {
							console.log(response.message);
						});
						$state.go("home.employees");
					}
					else if (response.data.companyAlready) {
						console.log("IN Already added")
						var alertPopup = $ionicPopup.alert({
							title: 'Alert!',
							template: response.data.message
						});

						alertPopup.then(function (res) {
							console.log(response.message);
						});
					}
				}, function (err) {
					console.log(err);


				})
		}
	})



	.controller("EmployeesController", function ($scope, $http) {

		$scope.seller = [{}];
        var item = -1;
		$scope.dynamicArr = [];
		$scope.addSellers = function (num) {
			$scope.dynamicArr = [];
			for (var a = 0; a < num; a++) {
				$scope.dynamicArr.push(a);
			}
		}

		$scope.newSeller = function (index) {
            item++;
			console.log(index);
			$scope.seller[index].Admin = localStorage.getItem("userLog");

			$http.post("/api/createseller", { data: $scope.seller[item] })
				.success(function (response) {
					console.log(response);
					if (response.status) {
						$scope.dynamicArr.splice(index, 1);
					}
				})
				.error(function (err) {
					console.log(err);
				})
		}
	})



	.controller("ProductsController", function ($scope, $http, $ionicPopup) {
		$scope.products = {};
		$scope.addProduct = function () {
			$scope.products.Owner = localStorage.getItem("userLog");
			$http.post("/api/addProduct", { data: $scope.products })
				.success(function (res) {
					console.log(res);
                    if (res.status) {
                        var alertPopup = $ionicPopup.alert({
							template: "Saved!"
						});

						alertPopup.then(function (res) {
							console.log(res);
						});
                    }
					$scope.products = {};
				})
				.error(function (err) {
					console.log(err);
				})
		}


	})





    .controller("PanelController", function ($scope, $http, $ionicPopup) {

		$scope.sellers = {};
        var FirebaseToken = localStorage.getItem("userLog");
        $http.get("/api/getsellers", {
            params: {
				token: FirebaseToken
			}
        })
        // $http.get("/api/getsellers/:token", FirebaseToken)
			.success(function (response) {
				if (response.status)
					$scope.sellers = response.sellers
				else {
					var alertPopup = $ionicPopup.alert({
						template: response.message
					});

					alertPopup.then(function (res) {
						console.log(res);
					});
				}
            })
            .error(function (err) {
                var alertPopup = $ionicPopup.alert({
                    template: err
                });

                alertPopup.then(function (res) {
                    console.log(res);
                });
            })

    });