const express = require("express");
const app = express();

const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);


const methodOverride = require("method-override");

const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

const mongoose = require("mongoose");
const Listing = require("./models/Listing.js");
const Review = require("./models/Review.js");
const {listingSchema , reviewSchema} = require("./schema.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/User.js");

const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

main()
.then(()=>{
    console.log("DB connected");
})
.catch(()=>{
    console.log("DB not connected");
})
async function main()
{
    await mongoose.connect("mongodb://127.0.0.1:27017/project1");
}
const WrapAsync = require("./utils/WrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const listings = require("./routes/listing.js");
const signuprouter = require("./routes/user.js");

app.get("/", (req, res) => {
  res.send("Hi, I am root");
});


app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Index : the main thing that lists everything

app.use("/listings", listings);
app.use("/", signuprouter);

app.all("/{*splat}", (req,res,next)=>{
    next(new ExpressError(404, "Page Not Found"));
});
app.use((err ,req , res, next)=>{
    let {statusCode = 500, message = "Something went Wrong da!!!"} = err;
    res.status(statusCode).send(message);
});


app.listen(3000);