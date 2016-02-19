/// <reference path="./typings/tsd.d.ts" />
var GeneralRoutes = require("./routes/general");
var MobileRoutes = require("./routes/mobile");
var express = require("express");
var path = require("path");
var Firebase = require('firebase');
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var app = express();
app.set("port", process.env.PORT || 8000);
var staticDIR = path.resolve(__dirname, "./static");
app.use(express.static(staticDIR));
app.use(bodyParser.json());
app.locals.ref = new Firebase("https://demosmartsellers.firebaseio.com/");
app.use("/api", GeneralRoutes);
app.use("/mobile", MobileRoutes);
app.get("*", function (req, res) {
    var indexViewPath = path.resolve(__dirname, "./static/adminPortal/index.html");
    res.sendFile(indexViewPath);
});
app.listen(app.get("port"), function () {
    console.log("Server in listening state on " + app.get("port"));
});
mongoose.connect("mongodb://localhost:27017/smartSeller");
