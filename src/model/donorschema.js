var mongoose = require("mongoose");
var validator = require("validator");

var jwt = require("jsonwebtoken");

var obj = new mongoose.Schema({
    Phone: {
        type: Number,
        unique: true,
    },

    Name: {
        type: String,
        maxlength: 20,
        minlength: 2,
        uppercase: true,
    },
    FatherName: {
        type: String,
        maxlength: 20,
        minlength: 2,
        uppercase: true,
    },
    DateOfBirth: [{
        dd: { type: Number },
        mm: { type: Number },
        yy: { type: Number },
    }, ],
    Age: Number,
    Address: {
        type: String,
        uppercase: true,
    },
    City: {
        type: String,
        uppercase: true,
    },
    District: {
        type: String,
        uppercase: true,
    },

    Date: {
        type: String,
        default: new Date(),
    },
    CurrentDate: {
        type: String,
    },

    Tokens: [{
        token: {
            type: String,
            required: true,
        },
        date: {
            type: String,
            default: new Date(),
        },
    }, ],
});

obj.methods.generateToken = async function() {
    //it must be normal function
    var tokengeneration = await jwt.sign({ _id: this._id.toString() },
        process.env.secreatKey
    );
    console.log("Schema part Token Generate for Donor: " + tokengeneration);
    this.Tokens = this.Tokens.concat({ token: tokengeneration });
    await this.save();
    return tokengeneration;
};

var Donor = new mongoose.model("donordata", obj);

module.exports = Donor;