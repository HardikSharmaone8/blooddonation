var mongoose = require("mongoose");

mongoose
    .connect(
        "mongodb+srv://hardik_sharma_one8:Om$hiv12@newcluster.3tmykg1.mongodb.net/?retryWrites=true&w=majority"
    )
    .then(() => {
        console.log("Database connection successful establised");
    });