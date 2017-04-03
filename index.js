const http = require('http');
const express = require('express');
const path = require('path');
const session = require('express-session')
var dbUtil = require("./CoursesDB.js");

var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: "courses2103", resave: false, saveUninitialized: true }))

dbUtil.connectDB(function (err) {
    if (err) {
        console.log(err);
    }



    // Set views and view engine
    app.set("views", path.resolve(__dirname, "views"));
    app.set("view engine", "ejs");
    app.use(express.static(__dirname + '/public'));

    // Handle logins
    app.get("/login", function (req, res) {
        var action = req.query.action;
        var user = req.query.username;
        var pass = req.query.password;
        var db = dbUtil.getDB();

        // User is logging in
        if (action == "Login") {
            db.collection("users").findOne({ user: user }, function (err, doc) {
                if (!doc) {//No document
                    res.render("login", {
                        message: "Entry not found"
                    });
                }// if
                else if (doc.pass == pass) { // Successful login
                    req.session.user = user;
                    res.redirect('/');
                }// else if
                else {// Login not successful
                    res.render("login", {
                        message: "Password is incorrect"
                    });
                }// else
            })// db.collection.findOne
        }// If (action === Login)

        // User is creating account
        else if (action == "Create Account") {

            // Check if user or pass are empyt/null
            if (user === "" || user == null || pass === "" || pass == null) {
                res.render("login", {
                    message: "No username or password entered"
                });
            }// if
            else {
                db.collection("users").findOne({ user: user }, function (err, doc) {
                    if (doc) {// If username already exists in system
                        res.render("login", {
                            message: "That user already exists!"
                        });// res.render
                    }// if
                    else {// New user, add their information to the system
                        db.collection("users").insert({
                            user: user,
                            pass: pass
                        });
                        req.session.user = user;
                        res.redirect("/");
                    }// else
                });// db.users.findOne
            }// else
        }// if

        // Action not specified
        else {
            res.render("login", {
                message: "Welcome"
            });
        }// else
    });

    // Handle get requests
    app.get("/", function (req, res) {
        var db = dbUtil.getDB();
        var codes = []; var names = []; var profs = []; var rooms = []; var times = []; var days = [];

        // Check if no user in session
        if (!req.session.user) {
            res.redirect("/login");
        }

        // Get all items from given user
        db.collection("courses").find({ user: req.session.user }).toArray(function (err, docs) {
            if (docs) {
                res.render("index", {
                    course: docs
                });// res.render
            }// if
        });// db.collection.find
    });// app.get

    app.post("/", function (req, res) {
        var dayses;

        if (req.body.action === "Delete") {
            var coder = req.body.ccode;
            var db = dbUtil.getDB();

            db.collection("courses").deleteMany({ code: coder });
        }// if(deleting)
        else {
            // Check if the days returned an array or not
            if (!(req.body.days instanceof Array)) {// Returned int, put into array
                dayses = [req.body.days];
            }// if
            else {// returned array, it's fine to use
                dayses = req.body.days;
            }// else

            var db = dbUtil.getDB();
            db.collection("courses").insert({
                code: req.body.codes,
                name: req.body.names,
                prof: req.body.professors,
                room: req.body.rooms,
                time: req.body.times,
                days: dayses,
                user: req.session.user
            });

        }// else (not deleting)

        // Get all items from given user
        db.collection("courses").find({ user: req.session.user }).toArray(function (err, docs) {
            if (docs) {
                res.render("index", {
                    course: docs
                });
            }// if
        });// db.collection.find


    });// app.post

    // Set up webpage
    http.createServer(app).listen(3000);
    console.log('localhost:3000');
});//dbUtil.connectDB