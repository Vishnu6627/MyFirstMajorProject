const express = require("express");
const app = express();

const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);


const methodOverride = require("method-override");

const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

const mongoose = require("mongoose");
const Listing = require("./models/Listing.js");
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

app.get("/", (req, res) => {
  res.send("Hi, I am root");
});
// Index : the main thing that lists everything
app.get("/listings", WrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("index.ejs", { allListings });
}));
//Creating new data route
app.get("/listings/new",(req,res)=>{
    res.render("new.ejs");
});


//editing 
app.get("/listings/edit/:id", WrapAsync(async (req,res)=>{
    const {id} = req.params;
    const data = await Listing.findById(id);
    res.render("edit.ejs", {data});
}));
//update
app.put( "/listings/editing" , WrapAsync(async (req,res)=>{
    const {id}= req.body.Data;
    await Listing.findByIdAndUpdate(id, req.body.Data);
    res.redirect(`/listings/${id}`);
}));
// Showing the individual thing
app.get("/listings/:id", WrapAsync(async (req,res)=>{
    const {id} = req.params;
    const object = await Listing.findById(id);
    res.render("alone.ejs", {object})
}));

//posting a new data
app.post("/listings",WrapAsync(async (req,res)=>{
    if(!req.body.Data)
    {
        throw new ExpressError(400 , "Enter the data firstof all.");
    }
    const {Data} = req.body;
    const news = new Listing(Data);
    await news.save().then(()=>{
        console.log("saved");
    });
    res.redirect("/listings");

}));
 
app.all("/{*splat}", (req,res,next)=>{
    next(new ExpressError(404, "Page Not Found"));
});
app.use((err ,req , res, next)=>{
    let {statusCode = 500, message = "Something went Wrong da!!!"} = err;
    res.status(statusCode).send(message);
});


app.listen(3000);