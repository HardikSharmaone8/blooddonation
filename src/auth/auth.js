var Admin = require("../model/adminschema");
var cookieParser = require("cookie-parser");
var jwt = require("jsonwebtoken");

var auth = async(req, res, next) => {
    try {
        var cookie = req.cookies.jwt;
        var comparecokie = jwt.verify(cookie, process.env.secreatKey);

        var adminuser = await Admin.findOne({ _id: comparecokie._id });
        // // console.log(
        //     `After finding the id of that admin who priviously login it will give output in authotication time: ${adminuser}`
        // );
        req.adminuser = adminuser;
        req.cookie = cookie;
        next();
    } catch (err) {
        res.status(401).render("err");
    }
};

module.exports = auth;