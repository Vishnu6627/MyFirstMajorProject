const mongoose = require("mongoose");
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
const dt = require("./data.js");
const List  = require("../models/Listing.js");
async function initDb()
{
    await List.deleteMany({});
    await List.insertMany(dt.data);
}
initDb();