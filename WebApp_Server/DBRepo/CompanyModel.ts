import express = require("express");
import q = require("q");
import mongoose = require("mongoose");
import {saveUser, findUser, updateUser} from "./UserModel"

let app = express();

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
    let defered = q.defer();
    findCompany({ $or: [{ Name: company.Name }, { Email: company.Email }] })
        .then((response) => {
            if (response) {
                console.log({ message: "Company Already Added" });
                defered.reject("Company Already Added");
            }
        }, (err) => {
            console.log("In Err")
            findUser({ FirebaseToken: company.Owner })
                .then((response) => {
                    if (response) {
                        // console.log("Response from Token :", response);
                        company.Owner = response.id;
                        let Company = new CompanyModel(company);
                        Company.save((err, CompanyInstance) => {
                            if (err) {
                                defered.reject({ message: "Something Went Wrong Try Again Later!" });
                            }
                            else {
                                updateUser(response.id, { $set: { Company: CompanyInstance.id } })
                                    .then((response) => {
                                        defered.resolve({ userUpdate: true, company: CompanyInstance });
                                    }, (err) => {
                                        defered.reject({ userUpdate: false, company: CompanyInstance });
                                    })
                                console.log(CompanyInstance);

                            }

                        })
                    }
                })
        })
    return defered.promise
}


function getCount(query) {
    let defered = q.defer();
    CompanyModel.count(query, function(err, count) {
        if (err) {
            console.log("Count Error: ", err)
            defered.reject(err);
        }
        else {
            defered.resolve(count);
            console.log("count: ", count);
        }
    })
    return defered.promise;
}


function findCompany(query) {
    console.log("query Find COmpany:", query);
    let defered = q.defer()
    
    // CompanyModel.findById(query, function(err, data){
    //     console.log(err);
    //     //console.log(data);
    //     defered.resolve(data);
    // })

    CompanyModel
        .findOne(query, (err, response) => {
            if (response) {
                console.log(response);
                defered.resolve(response);
            }
            else {
                console.log(err);
                defered.reject("Not Found");
            }
        })
    return defered.promise
}


function findCompanyById(id) {
    console.log("query FindById Company:", id);
    let defered = q.defer()
    CompanyModel.findById(id, function(err, response) {
        if (response) {
            console.log(response);
            defered.resolve(response);
        }
        else {
            console.log(err);
            defered.reject("Not Found");
        }
    })
    return defered.promise;
}

export {findCompany, saveCompany, findCompanyById,getCount};