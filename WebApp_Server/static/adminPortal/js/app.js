angular.module('starter', ['ionic'])
    .config(function ($stateProvider, $urlRouterProvider) {


        $stateProvider
            .state("login", {
                url: "/login",
                templateUrl: "/adminPortal/templates/login.html",
                controller: "loginCtrl"
            })
            .state("signup", {
                url: "/signup",
                templateUrl: "/adminPortal/templates/signup.html",
                controller: "signupCtrl"
            })


            .state("home", {
                url: "/home",
                templateUrl: "./adminPortal/templates/home.html",
                loggedInRequired: true,
                abstract: true
            })

            .state("home.company", {
                url: "/company",
                templateUrl: "./adminPortal/templates/company.html",
                controller: "CompanyController",
                loggedInRequired: true,
            })

            .state("home.employees", {
                url: "/employees",
                templateUrl: "./adminPortal/templates/employees.html",
                controller: "EmployeesController",
                loggedInRequired: true,
            })

            .state("home.products", {
                url: "/products",
                templateUrl: "./adminPortal/templates/products.html",
                controller: "ProductsController",
                loggedInRequired: true,
            })

            .state("panel", {
                url: "/panel",
                templateUrl: "./adminPortal/templates/panel.html",
                controller: "PanelController",
                loggedInRequired: true,
            });


        $urlRouterProvider.otherwise("/login");
    })



    .run(function ($rootScope, $state) {


        $rootScope.$on("$stateChangeStart", function (event, toState) {
            var loggedID = localStorage.getItem("userLog");
            console.log(toState);
            if (toState.loggedInRequired) {
                if (!loggedID) {
                    event.preventDefault();
                    $state.go("login");
                }
            }
        })
    });