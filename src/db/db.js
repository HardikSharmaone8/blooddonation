var mongoose = require("mongoose");

mongoose
    .connect(
        process.env.MONGODB_URL ||
        "mongodb+srv://hardik_sharma_one8:Om$hiv12@newcluster.3tmykg1.mongodb.net/?retryWrites=true&w=majority" ||
        "mongodb://localhost:27017/donordatabase"
    )
    .then(() => {
        console.log("Database connection successful establised");
    });