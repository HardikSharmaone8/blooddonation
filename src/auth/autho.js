var jwt = require("jsonwebtoken");
var Donor = require("../model/donorschema");
var cookieParser = require("cookie-parser");

var autho = async(req, res, next) => {
    try {
        var cookie = req.cookies.jwt;

        var compare = await jwt.verify(cookie, process.env.secreatKey);

        var donorauthdata = await Donor.findOne({ _id: compare._id });

        req.donorauthdata = donorauthdata;
        req.cookie = cookie;
        next();
    } catch (err) {
        res.status(404).render("err");
    }
};

module.exports = autho;