var express = require("express");
var q = require("q");
var mongoose = require("mongoose");
var UserModel_1 = require("./UserModel");
var app = express();
var Schema = mongoose.Schema;
var CompanySchema = new Schema({
    Name: { type: String, require: true },
    Email: { type: String, require: true, unique: true },
    Address: String,
    Timestamp: { type: Date, default: Date.now },
    State: String,
    Country: String,
    Telephone: String,
    Owner: String,
});
var CompanyModel = mongoose.model("companies", CompanySchema);
//var token = localStorage.getItem("userLog");
function saveCompany(company) {
    var defered = q.defer();
    findCompany({ $or: [{ Name: company.Name }, { Email: company.Email }] })
        .then(function (response) {
        if (response) {
            console.log({ message: "Company Already Added" });
            defered.reject("Company Already Added");
        }
    }, function (err) {
        console.log("In Err");
        UserModel_1.findUser({ FirebaseToken: company.Owner })
            .then(function (response) {
            if (response) {
                // console.log("Response from Token :", response);
                company.Owner = response.id;
                var Company = new CompanyModel(company);
                Company.save(function (err, CompanyInstance) {
                    if (err) {
                        defered.reject({ message: "Something Went Wrong Try Again Later!" });
                    }
                    else {
                        UserModel_1.updateUser(response.id, { $set: { Company: CompanyInstance.id } })
                            .then(function (response) {
                            defered.resolve({ userUpdate: true, company: CompanyInstance });
                        }, function (err) {
                            defered.reject({ userUpdate: false, company: CompanyInstance });
                        });
                        console.log(CompanyInstance);
                    }
                });
            }
        });
    });
    return defered.promise;
}
exports.saveCompany = saveCompany;
function getCount(query) {
    var defered = q.defer();
    CompanyModel.count(query, function (err, count) {
        if (err) {
            console.log("Count Error: ", err);
            defered.reject(err);
        }
        else {
            defered.resolve(count);
            console.log("count: ", count);
        }
    });
    return defered.promise;
}
exports.getCount = getCount;
function findCompany(query) {
    console.log("query Find COmpany:", query);
    var defered = q.defer();
    // CompanyModel.findById(query, function(err, data){
    //     console.log(err);
    //     //console.log(data);
    //     defered.resolve(data);
    // })
    CompanyModel
        .findOne(query, function (err, response) {
        if (response) {
            console.log(response);
            defered.resolve(response);
        }
        else {
            console.log(err);
            defered.reject("Not Found");
        }
    });
    return defered.promise;
}
exports.findCompany = findCompany;
function findCompanyById(id) {
    console.log("query FindById Company:", id);
    var defered = q.defer();
    CompanyModel.findById(id, function (err, response) {
        if (response) {
            console.log(response);
            defered.resolve(response);
        }
        else {
            console.log(err);
            defered.reject("Not Found");
        }
    });
    return defered.promise;
}
exports.findCompanyById = findCompanyById;
