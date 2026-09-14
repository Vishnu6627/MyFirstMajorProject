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


app.get("/", (req, res) => {
  res.send("Hi, I am root");
});
// Index : the main thing that lists everything

app.use("/listings", listings);

app.all("/{*splat}", (req,res,next)=>{
    next(new ExpressError(404, "Page Not Found"));
});
app.use((err ,req , res, next)=>{
    let {statusCode = 500, message = "Something went Wrong da!!!"} = err;
    res.status(statusCode).send(message);
});


app.listen(3000);