var mongoose = require("mongoose");
var validator = require("validator");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
require("dotenv").config();

var adminObj = new mongoose.Schema({
    Email: {
        type: String,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email");
            }
        },

        lowerCase: true,
    },
    Password: {
        type: String,
        minLength: 6,
    },
    Date: {
        type: Date,
        default: Date.now,
    },
    Tokens: [{
        token: {
            type: String,
            required: true,
        },
    }, ],
});

adminObj.methods.generateToken = async function() {
    //it must be normal function
    var tokengeneration = await jwt.sign({ _id: this._id.toString() },
        process.env.secreatKey
    );
    console.log("Schema part Token Generate for Admin: " + tokengeneration);
    this.Tokens = this.Tokens.concat({ token: tokengeneration });
    await this.save();
    return tokengeneration;
};

adminObj.pre("save", async function(next) {
    //this function must be normal
    if (this.isModified("Password")) {
        this.Password = await bcrypt.hash(this.Password, 10);
    }
    next();
});

var Admin = new mongoose.model("admindata", adminObj); //admindata is the name of the collection..

module.exports = Admin;