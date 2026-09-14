const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const Listing = require("../models/Listing.js");
const Review = require("../models/Review.js");
const {listingSchema , reviewSchema} = require("../schema.js");

const WrapAsync = require("../utils/WrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const validateReview = (req, res, next)=>{
    console.log("VALIDATE REVIEW REACHED");
    let { error } = reviewSchema.validate(req.body);
    console.log("VALIDATE REVIEW REACHED");
    if(error)
    {
        console.log("there is error")
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errmsg);
    }else{
        next();
    }
};

router.get("/", WrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("index.ejs", { allListings });
}));
//Creating new data route
router.get("/new",(req,res)=>{
    res.render("new.ejs");
});


//editing 
router.get("/edit/:id", WrapAsync(async (req,res)=>{
    const {id} = req.params;
    const data = await Listing.findById(id);
    res.render("edit.ejs", {data});
}));
//update
router.put( "/editing" , WrapAsync(async (req,res)=>{
    const {id}= req.body.Data;
    await Listing.findByIdAndUpdate(id, req.body.Data);
    res.redirect(`/listings/${id}`);
}));
// Showing the individual thing
router.get("/:id", WrapAsync(async (req,res)=>{
    const {id} = req.params;
    const object = await Listing.findById(id).populate("reviews");
    res.render("alone.ejs", {object})
}));

//posting a new data
router.post("/", WrapAsync(async (req, res) => {

    let { error } = listingSchema.validate(req.body.Data);

    if (error) {
        throw new ExpressError(400, error.details[0].message);
    }

    const { Data } = req.body;

    const news = new Listing(Data);
    await news.save();

    res.redirect("/listings");
}));
//delete
router.delete("/:id", async (req,res)=>{
    const {id} = req.params;

    console.log("DELETE ROUTE RUNNING");

    await Listing.findByIdAndDelete(id);

    res.redirect("/listings");
});

//reviews
//post a new review
router.post("/:id/reviews", validateReview, WrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    console.log("it saved");
    res.redirect(`/listings/${listing._id}`);
}));
//delte route
router.delete(
  "/:id/reviews/:reviewId",
  WrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
  })
);
module.exports = router;