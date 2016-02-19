/// <reference path="./typings/tsd.d.ts" />

var GeneralRoutes = require("./routes/general");
var MobileRoutes = require("./routes/mobile")
import express = require("express");
import path = require("path");
import Firebase = require('firebase')
import bodyParser = require("body-parser");
import mongoose = require("mongoose");

let app = express();
app.set("port", process.env.PORT || 8000);


let staticDIR = path.resolve(__dirname, "./static");
app.use(express.static(staticDIR));
app.use(bodyParser.json());
app.locals.ref = new Firebase("https://demosmartsellers.firebaseio.com/");

app.use("/api", GeneralRoutes);

app.use("/mobile", MobileRoutes);

app.get("*", (req: express.Request, res: express.Response) => {
    let indexViewPath = path.resolve(__dirname, "./static/adminPortal/index.html");
    res.sendFile(indexViewPath);
});


app.listen(app.get("port"), () => {
    console.log("Server in listening state on " + app.get("port"));
});
mongoose.connect("mongodb://localhost:27017/smartSeller");