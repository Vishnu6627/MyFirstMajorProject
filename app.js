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

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.send("Hi, I am root");
});
// Index : the main thing that lists everything
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("index.ejs", { allListings });
});
//Creating new data route
app.get("/listings/new",(req,res)=>{
    res.render("new.ejs");
});


//editing 
app.get("/listings/edit/:id",async (req,res)=>{
    const {id} = req.params;
    const data = await Listing.findById(id);
    res.render("edit.ejs", {data});
})
//update
app.put( "/listings/editing" , async (req,res)=>{
    const {id}= req.body.Data;
    await Listing.findByIdAndUpdate(id, req.body.Data);
    res.redirect(`/listings/${id}`);
});
// Showing the individual thing
app.get("/listings/:id", async (req,res)=>{
    const {id} = req.params;
    const object = await Listing.findById(id);
    res.render("alone.ejs", {object})
});

//posting a new data
app.post("/listings",async (req,res)=>{
    const {Data} = req.body;
    const news = new Listing(Data);
    await news.save().then(()=>{
        console.log("saved");
    });
    res.redirect("/listings");

});


app.listen(3000);