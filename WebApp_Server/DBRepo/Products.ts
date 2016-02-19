import express = require("express");
import q = require("q");
import mongoose = require("mongoose");
import {findCompany, saveCompany, findCompanyById} from "./CompanyModel"
import {saveUser, findUser, updateUser, findUserById} from "./UserModel"
let Schema = mongoose.Schema;

var ProductSchema = new Schema({
    Name: String,
    Description: String,
    Price: Number,
    Company: String,
    Owner: String
});


let ProductModel = mongoose.model("Products", ProductSchema);

function findProduct(query) {
    let defered = q.defer();
    ProductModel.findOne(query, (err, product) => {
        if (product) {
            console.log(product);
            defered.resolve(product);
        }
        else {
            defered.reject(err);
            console.log(err);
        }
    })
    return defered.promise;
}


function findProducts(query) {
    let defered = q.defer();
    ProductModel.find(query, (err, product) => {
        if (product) {
            console.log(product);
            defered.resolve(product);
        }
        else {
            defered.reject(err);
            console.log(err);
        }
    })
    return defered.promise;
}


function saveProduct(productPros) {
    let defered = q.defer();
    console.log("productPros.Owner: ", productPros.Owner);
    console.log(typeof productPros.Owner);
    findUser({ FirebaseToken: productPros.Owner })
        .then((user) => {
            console.log("IN FindUser Success:", user);
            console.log("UserCompany:", user.Company);
            
            findCompanyById(user.Company)
                .then((company) => {
                    console.log("IN FindCompany Success:", company);
                    productPros.Company = company._id;
                    productPros.Owner = user._id;
                    let Product = new ProductModel(productPros);
                    Product.save((err, product) => {
                        if (err) {
                            defered.reject(err);
                            console.log(err);
                        }
                        else {
                            defered.resolve(product);
                            console.log("YE kia hy", product);
                        }
                    })
                }, (err) => {
                    defered.reject(err);
                })
        }, (err) => {
            defered.reject(err);
            console.log(err);
        })
    return defered.promise;
}

export {saveProduct, findProduct,findProducts}