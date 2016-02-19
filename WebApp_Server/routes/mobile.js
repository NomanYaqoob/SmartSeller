var express = require("express");
var Firebase = require("firebase");
var Products_1 = require("../DBRepo/Products");
var Order_1 = require("../DBRepo/Order");
var router = express();
router.get("/products", function (req, res) {
    console.log("in products mobile");
    Products_1.findProducts({})
        .then(function (products) {
        console.log(products);
        res.send({ status: true, products: products });
    }, function (err) {
        res.send({ status: false, message: err });
    });
});
router.post("/order/:user", function (req, res) {
    var user = req.params.user, order = req.body.order, total = req.body.total, location = req.body.location;
    //var orders = order.product;
    //orders.quantity = order.quantity;
    /*var localOrdersObj = [];
    if (order && order.length) {
        order.forEach(function(o) {
            localOrdersObj.push({
                product: {
                    Product: o.product._id,
                    Name: o.product.Name,
                    Price: o.product.Price,
                },
                quantity: o.quantity
            });
        });
    }*/
    console.log("router.locals.ref," + router.locals.ref);
    var firebaseRef = new Firebase("https://demosmartsellers.firebaseio.com/").child("orders");
    var OrderObject = { User: user, Orders: order, Total: total, Location: location };
    firebaseRef.push(OrderObject, function (data) {
        console.log("Firebase Push Complete,", data);
        Order_1.saveOrder(OrderObject)
            .then(function (data) {
            if (data) {
                res.send({ status: true, order: data });
            }
        }, function (err) {
            res.send({ status: false, message: err });
        });
    });
});
module.exports = router;
