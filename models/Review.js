const mongoose = require("mongoose");


const ReviewSchema = new mongoose.Schema({
    comment: String,
    rating: {
        type: Number,
        min: 0,
        max: 5
    },
    createdAt : {
        type: Date,
        default: Date.now()
    }
});

const Review = mongoose.model("Review", ReviewSchema);
module.exports = Review;