
import express = require("express");
import Firebase = require("firebase");
import q = require("q");
import {saveUser, findUser} from "../DBRepo/UserModel";
import {findCompany, saveCompany, getCount} from "../DBRepo/CompanyModel";
import {saveProduct, findProduct, findProducts} from "../DBRepo/Products";
import {saveOrder} from "../DBRepo/Order"

let router = express();


router.get("/products", (req, res) => {
    console.log("in products mobile");
    findProducts({})
        .then((products) => {
            console.log(products)
            res.send({ status: true, products: products })
        }, (err) => {
            res.send({ status: false, message: err })
        })
})


router.post("/order/:user", (req, res) => {
    var user = req.params.user,
        order = req.body.order,
        total = req.body.total,
        location = req.body.location;
        
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
    firebaseRef.push(OrderObject, function(data) {
        console.log("Firebase Push Complete,", data);
        saveOrder(OrderObject)
            .then((data) => {
                if (data) {
                    res.send({ status: true, order: data })
                }
            }, (err) => {
                res.send({ status: false, message: err });
            })
    })
})

module.exports = router;
