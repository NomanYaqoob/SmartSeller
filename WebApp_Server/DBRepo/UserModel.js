var mongoose = require("mongoose");
var q = require("q");
var Schema = mongoose.Schema;
var UserSchema = new Schema({
    FirstName: String,
    LastName: String,
    Email: { type: String, unique: true, required: true },
    Password: String,
    CreatedOn: { type: Date, default: Date.now() },
    AccountType: String,
    FirebaseToken: String,
    ActivateAccount: { type: Boolean, default: false },
    Company: String
}, { strict: false });
var UserModel = mongoose.model("users", UserSchema);
function saveUser(userProps) {
    var deferred = q.defer();
    var user = new UserModel(userProps);
    user.save(function (err, data) {
        if (err) {
            console.log("Error in saving User");
            console.log(err);
            deferred.reject("Error occurred while saving user");
        }
        else {
            console.log("User Saved Succesfully");
            deferred.resolve(data);
        }
    });
    return deferred.promise;
}
exports.saveUser = saveUser;
function findUser(query) {
    console.log("in findUser", query);
    var deferred = q.defer();
    UserModel
        .findOne(query, function (err, record) {
        if (err) {
            console.log("Error in finding User");
            console.log(err);
            deferred.reject("Error in finding User");
        }
        else {
            console.log("User: ", record);
            if (record) {
                deferred.resolve(record);
            }
            else {
                console.log("No User found");
                deferred.reject("No User found");
            }
        }
    });
    return deferred.promise;
}
exports.findUser = findUser;
function findUserById(id) {
    var deferred = q.defer();
    UserModel
        .findById(id, function (err, record) {
        if (err) {
            console.log("Error in finding User");
            console.log(err);
            deferred.reject("Error in finding User");
        }
        else {
            deferred.resolve(record);
        }
    });
    return deferred.promise;
}
exports.findUserById = findUserById;
function findSellers(query) {
    var deferred = q.defer();
    UserModel
        .find(query, function (err, record) {
        if (err) {
            console.log("Error in finding User");
            console.log(err);
            deferred.reject("Error in finding User");
        }
        else {
            deferred.resolve(record);
        }
    });
    return deferred.promise;
}
exports.findSellers = findSellers;
function updateUser(query, update) {
    var deferred = q.defer();
    console.log("query: ", query);
    console.log("update: ", update);
    UserModel
        .update({ "_id": query }, update, { new: true }, function (err, record) {
        if (err) {
            console.log("Error in Updating User");
            console.log(err);
            deferred.reject("Error in Updating User");
        }
        else {
            deferred.resolve(record);
            console.log("UpdateUser Model: ", record);
        }
    });
    return deferred.promise;
}
exports.updateUser = updateUser;
