
import express = require("express");
import Firebase = require("firebase");
import q = require("q");
import {saveUser, findUser, updateUser, findUserById, findSellers} from "../DBRepo/UserModel";
import {findCompany, saveCompany, getCount} from "../DBRepo/CompanyModel";
import {saveProduct, findProduct, findProducts} from "../DBRepo/Products";
import nodeMailer = require("nodemailer");
let router = express.Router();
let transporter = nodeMailer.createTransport({
	service: "Gmail",
	auth: {
		user: 'smartbecho@gmail.com',
		pass: "Saylani3160"
	}
});


function sendMail(text, to, subject) {
	var defered = q.defer();
	let mailOption = {
		from: "no-reply@smartbecho.com",
		to: to,
		subject: subject,
		text: text
	}
	transporter.sendMail(mailOption, (err, info) => {
		console.log("IN sendMail callback:", info + "," + err)
		if (err) {
			defered.reject(err);
			console.log("Err: ", err);
		}
		else {
			// console.log("Email Sent to:", info.response);
			defered.resolve(info);
			console.log("Info:", info);
		}
	})
	return defered.promise;
}
var firebaseRef = new Firebase("https://demosmartsellers.firebaseio.com/");

router.post("/signup", (req: express.Request, res: express.Response) => {
	console.log("On Sign Up");
	let user = req.body.data;
	firebaseRef.createUser({
		email: user.Email,
		password: user.Password
	}, (err, data) => {
		if (err) {
			res.send({ status: false, message: err });
		}
		else {
			console.log(data.uid);
			user.FirebaseToken = data.uid;
			saveUser(user)
				.then((userInstance) => {
					sendMail("Thankyou for choosing us.\nYour Account has been created successfully. \n\nTo verify please click the link below\nLink: http://localhost:3000/#/user?token=" + userInstance.FirebaseToken, userInstance.Email, "SmartBecho Account Information")
						.then((info) => {
							console.log(info);
							res.send({ status: true, user: userInstance, emailStatus: info });
						}, (err) => {
							console.log(err);
							res.send({ status: true, user: userInstance, emailStatus: err });
						});
					// res.send({ status: true, user: userInstance, emailStatus: emailResponse });
				}, (err) => {
					res.send({ status: false, message: err });
				});
		}
	});
});


router.get("/companycount/:token", (req, res) => {
    findUser({ FirebaseToken: req.params.token })
        .then((user) => {
            getCount({ Owner: user._id })
                .then((count) => {
                    res.send({ status: true, count: count })
                }, (err) => {
                    res.send({ status: false, message: err })
                })
        }, (err) => {
            res.send({ status: false, message: err })
        })
})

router.post("/createseller", (req, res) => {
	let user = req.body.data;
	firebaseRef.createUser({
		email: user.Email,
		password: user.Password
	}, (err, data) => {
		if (err) {
			res.send({ status: false, message: err })
		} else {
			user.FirebaseToken = data.uid;
			saveUser(user)
				.then((userInstance) => {
					sendMail("Your Account has been Created\nEmail:" + userInstance.Email + "\nPassword: " + userInstance.Password, userInstance.Email, "smartBecho Seller Account")
					// .then((info) => {
					// 	console.log(info);
					// 	res.send({ status: true, user: userInstance, emailStatus: info });
					// }, (err) => {
					// 	console.log(err);
					// 	res.send({ status: true, user: userInstance, emailStatus: err });
					// })
					res.send({ status: true, user: userInstance });
				}, (err) => {
					res.send({ status: false, message: err });
				})
		}
	})
})


router.post("/login", (req: express.Request, res: express.Response) => {
	console.log("On Login In");

	let user = req.body.data;
	findUser({ Email: user.email })
		.then((userInstance) => {
			if (!userInstance) {
				res.send({ status: false, message: "No user found with supplied email" });
				return;
			}
			if (userInstance.Password == user.password) {
				console.log(userInstance.FirebaseToken);
				//localStorage.setItem("loggedUser",userInstance.FirebaseToken)
				res.send({ status: true, message: "Logged In successfully", user: userInstance });
			} else {
				console.log(userInstance);
				res.send({ status: false, message: "Wrong password" });
			}

		}, (err) => {
			res.send({ status: false, message: err });
		});
});


router.post("/addcompany", (req, res) => {
	saveCompany(req.body.data)
		.then((response) => {
			//console.log(response);
			res.send({ status: true, comapny: response });
		}, (err) => {
			//console.log(err);
			res.send({ companyAlready: true, message: err });
		})
})


router.post("/addProduct", (req, res) => {
	let product = req.body.data;
	//console.log("Req.body.data: ", product);
	saveProduct(product)
		.then((product) => {
			if (product) {
				res.send({ status: true, product: product })
			} else {
				res.send({ status: false, product: product })
			}
		}, (err) => {
			res.send({ status: false, message: err })
		})
})


router.get("/getsellers", (req, res) => {

	console.log(req.query.token);
    findSellers({ Admin: req.query.token })
		.then((users) => {
			console.log("users:", users)
			res.send({ status: true, sellers: users })
		}, (err) => {
			console.log("error:", err)
			res.send({ status: false, message: err })
		})

})
module.exports = router;


