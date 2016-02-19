import express = require("express");
import mongoose = require("mongoose");
import {saveUser, findUser, updateUser, findUserById, findSellers} from "../DBRepo/UserModel";
import q = require("q");


let app = express();

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
    Location : {
        long : Number,
        lat : Number
    }
})


var OrderModel = mongoose.model("orders", OrderSchema);

function saveOrder(_order) {
    let deferred = q.defer();
    console.log("Total " + _order.Total)
    findUser({ FirebaseToken: _order.User })
        .then((user) => {
            var order = new OrderModel(_order);
            console.log("Total " + order.Total)
            order.User = user._id;
            //console.log("After assignment order.User: ", order.User)
            order.save(function(err, data) {
                if (err) {
                    console.log("Cannot save order due to: ", err);
                    deferred.reject(err);
                }
                else {
                    console.log("Saved");
                    deferred.resolve(data);
                }
            })
        }, (err) => {
            if (err) {
                console.log("Cannot save order due to: ", err);
                deferred.reject(err);
            }
        })


    return deferred.promise;
}


export {saveOrder};
