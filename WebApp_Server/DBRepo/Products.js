var q = require("q");
var mongoose = require("mongoose");
var CompanyModel_1 = require("./CompanyModel");
var UserModel_1 = require("./UserModel");
var Schema = mongoose.Schema;
var ProductSchema = new Schema({
    Name: String,
    Description: String,
    Price: Number,
    Company: String,
    Owner: String
});
var ProductModel = mongoose.model("Products", ProductSchema);
function findProduct(query) {
    var defered = q.defer();
    ProductModel.findOne(query, function (err, product) {
        if (product) {
            console.log(product);
            defered.resolve(product);
        }
        else {
            defered.reject(err);
            console.log(err);
        }
    });
    return defered.promise;
}
exports.findProduct = findProduct;
function findProducts(query) {
    var defered = q.defer();
    ProductModel.find(query, function (err, product) {
        if (product) {
            console.log(product);
            defered.resolve(product);
        }
        else {
            defered.reject(err);
            console.log(err);
        }
    });
    return defered.promise;
}
exports.findProducts = findProducts;
function saveProduct(productPros) {
    var defered = q.defer();
    console.log("productPros.Owner: ", productPros.Owner);
    console.log(typeof productPros.Owner);
    UserModel_1.findUser({ FirebaseToken: productPros.Owner })
        .then(function (user) {
        console.log("IN FindUser Success:", user);
        console.log("UserCompany:", user.Company);
        CompanyModel_1.findCompanyById(user.Company)
            .then(function (company) {
            console.log("IN FindCompany Success:", company);
            productPros.Company = company._id;
            productPros.Owner = user._id;
            var Product = new ProductModel(productPros);
            Product.save(function (err, product) {
                if (err) {
                    defered.reject(err);
                    console.log(err);
                }
                else {
                    defered.resolve(product);
                    console.log("YE kia hy", product);
                }
            });
        }, function (err) {
            defered.reject(err);
        });
    }, function (err) {
        defered.reject(err);
        console.log(err);
    });
    return defered.promise;
}
exports.saveProduct = saveProduct;
