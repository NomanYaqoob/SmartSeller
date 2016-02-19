var express = require("express");
var Firebase = require("firebase");
var q = require("q");
var UserModel_1 = require("../DBRepo/UserModel");
var CompanyModel_1 = require("../DBRepo/CompanyModel");
var Products_1 = require("../DBRepo/Products");
var nodeMailer = require("nodemailer");
var router = express.Router();
var transporter = nodeMailer.createTransport({
    service: "Gmail",
    auth: {
        user: 'smartbecho@gmail.com',
        pass: "Saylani3160"
    }
});
function sendMail(text, to, subject) {
    var defered = q.defer();
    var mailOption = {
        from: "no-reply@smartbecho.com",
        to: to,
        subject: subject,
        text: text
    };
    transporter.sendMail(mailOption, function (err, info) {
        console.log("IN sendMail callback:", info + "," + err);
        if (err) {
            defered.reject(err);
            console.log("Err: ", err);
        }
        else {
            // console.log("Email Sent to:", info.response);
            defered.resolve(info);
            console.log("Info:", info);
        }
    });
    return defered.promise;
}
var firebaseRef = new Firebase("https://demosmartsellers.firebaseio.com/");
router.post("/signup", function (req, res) {
    console.log("On Sign Up");
    var user = req.body.data;
    firebaseRef.createUser({
        email: user.Email,
        password: user.Password
    }, function (err, data) {
        if (err) {
            res.send({ status: false, message: err });
        }
        else {
            console.log(data.uid);
            user.FirebaseToken = data.uid;
            UserModel_1.saveUser(user)
                .then(function (userInstance) {
                sendMail("Thankyou for choosing us.\nYour Account has been created successfully. \n\nTo verify please click the link below\nLink: http://localhost:3000/#/user?token=" + userInstance.FirebaseToken, userInstance.Email, "SmartBecho Account Information")
                    .then(function (info) {
                    console.log(info);
                    res.send({ status: true, user: userInstance, emailStatus: info });
                }, function (err) {
                    console.log(err);
                    res.send({ status: true, user: userInstance, emailStatus: err });
                });
                // res.send({ status: true, user: userInstance, emailStatus: emailResponse });
            }, function (err) {
                res.send({ status: false, message: err });
            });
        }
    });
});
router.get("/companycount/:token", function (req, res) {
    UserModel_1.findUser({ FirebaseToken: req.params.token })
        .then(function (user) {
        CompanyModel_1.getCount({ Owner: user._id })
            .then(function (count) {
            res.send({ status: true, count: count });
        }, function (err) {
            res.send({ status: false, message: err });
        });
    }, function (err) {
        res.send({ status: false, message: err });
    });
});
router.post("/createseller", function (req, res) {
    var user = req.body.data;
    firebaseRef.createUser({
        email: user.Email,
        password: user.Password
    }, function (err, data) {
        if (err) {
            res.send({ status: false, message: err });
        }
        else {
            user.FirebaseToken = data.uid;
            UserModel_1.saveUser(user)
                .then(function (userInstance) {
                sendMail("Your Account has been Created\nEmail:" + userInstance.Email + "\nPassword: " + userInstance.Password, userInstance.Email, "smartBecho Seller Account");
                // .then((info) => {
                // 	console.log(info);
                // 	res.send({ status: true, user: userInstance, emailStatus: info });
                // }, (err) => {
                // 	console.log(err);
                // 	res.send({ status: true, user: userInstance, emailStatus: err });
                // })
                res.send({ status: true, user: userInstance });
            }, function (err) {
                res.send({ status: false, message: err });
            });
        }
    });
});
router.post("/login", function (req, res) {
    console.log("On Login In");
    var user = req.body.data;
    UserModel_1.findUser({ Email: user.email })
        .then(function (userInstance) {
        if (!userInstance) {
            res.send({ status: false, message: "No user found with supplied email" });
            return;
        }
        if (userInstance.Password == user.password) {
            console.log(userInstance.FirebaseToken);
            //localStorage.setItem("loggedUser",userInstance.FirebaseToken)
            res.send({ status: true, message: "Logged In successfully", user: userInstance });
        }
        else {
            console.log(userInstance);
            res.send({ status: false, message: "Wrong password" });
        }
    }, function (err) {
        res.send({ status: false, message: err });
    });
});
router.post("/addcompany", function (req, res) {
    CompanyModel_1.saveCompany(req.body.data)
        .then(function (response) {
        //console.log(response);
        res.send({ status: true, comapny: response });
    }, function (err) {
        //console.log(err);
        res.send({ companyAlready: true, message: err });
    });
});
router.post("/addProduct", function (req, res) {
    var product = req.body.data;
    //console.log("Req.body.data: ", product);
    Products_1.saveProduct(product)
        .then(function (product) {
        if (product) {
            res.send({ status: true, product: product });
        }
        else {
            res.send({ status: false, product: product });
        }
    }, function (err) {
        res.send({ status: false, message: err });
    });
});
router.get("/getsellers", function (req, res) {
    console.log(req.query.token);
    UserModel_1.findSellers({ Admin: req.query.token })
        .then(function (users) {
        console.log("users:", users);
        res.send({ status: true, sellers: users });
    }, function (err) {
        console.log("error:", err);
        res.send({ status: false, message: err });
    });
});
module.exports = router;
