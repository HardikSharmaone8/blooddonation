var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/donordatabase").then(() => {
    console.log("Database connection successful establised");
});