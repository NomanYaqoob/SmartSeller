var express = require("express");
var mongoose = require("mongoose");
var UserModel_1 = require("../DBRepo/UserModel");
var q = require("q");
var app = express();
var Schema = mongoose.Schema;
var OrderSchema = new Schema({
    User: Schema.Types.ObjectId,
    Orders: [{
            product: {
                _id: Schema.Types.ObjectId,
                Name: String,
                Price: Number,
                Description: String
            },
            quantity: Number
        }],
    Total: Number,
    Location: {
        long: Number,
        lat: Number
    }
});
var OrderModel = mongoose.model("orders", OrderSchema);
function saveOrder(_order) {
    var deferred = q.defer();
    console.log("Total " + _order.Total);
    UserModel_1.findUser({ FirebaseToken: _order.User })
        .then(function (user) {
        var order = new OrderModel(_order);
        console.log("Total " + order.Total);
        order.User = user._id;
        //console.log("After assignment order.User: ", order.User)
        order.save(function (err, data) {
            if (err) {
                console.log("Cannot save order due to: ", err);
                deferred.reject(err);
            }
            else {
                console.log("Saved");
                deferred.resolve(data);
            }
        });
    }, function (err) {
        if (err) {
            console.log("Cannot save order due to: ", err);
            deferred.reject(err);
        }
    });
    return deferred.promise;
}
exports.saveOrder = saveOrder;
