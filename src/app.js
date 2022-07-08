require("dotenv").config();
require("./db/db");
var Admin = require("./model/adminschema"); //100
var Donor = require("./model/donorschema"); //100
var auth = require("./auth/auth");
var autho = require("./auth/autho");
var express = require("express");
var app = express();
var path = require("path");
var hbs = require("hbs");
var bcrypt = require("bcrypt");
var cookieParser = require("cookie-parser");
var port = process.env.PORT || 8000;

var templatePath = path.join(__dirname, "../template");
var imgPath = path.join(__dirname, "../public");
var partialPath = path.join(__dirname, "../partial");

app.set("view engine", "hbs");
app.set("views", templatePath);

app.use(express.static(imgPath)); //to display background image
app.use(express.urlencoded({ extended: false })); //converts object data into array or string //ye line user jab registration form  ko fill krega usse baad save button pr click krega to wo sara data object form me hoga...
app.use(express.json()); //100
app.use(cookieParser());
hbs.registerPartials(partialPath);

app.post("/register", async(req, res) => {
    try {
        var admindata = new Admin({
            Email: req.body.email,
            Password: req.body.password,
        });

        var token = await admindata.generateToken();
        console.log("Token Generate at the time of register:" + token);

        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 10000 * 60),
            httpOnly: true,
        });

        await admindata.save();
        res.render("login");
    } catch (err) {
        res.send(err);
        console.logg(err);
    }
});

//when Admin login into this portal then he will be able to enter the new register id..otherwise page not found
app.get("/register", (req, res) => {
    res.render("adminreg");
});

app.post("/login", async(req, res) => {
    try {
        emailid = req.body.email;
        Password = req.body.password;

        var checkemail = await Admin.findOne({ Email: emailid });
        // console.log(
        //     "At login time Check that Email is in the database" + checkemail
        // );
        var passwordcompare = await bcrypt.compare(Password, checkemail.Password); //if the password match then it return true otherwise false..

        var token = await checkemail.generateToken();
        console.log("TOken Generete At the Time of Login" + token);
        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 10000 * 60),
            httpOnly: true,
        });

        if (passwordcompare == true) {
            res.render("home");
        } else {
            res.status(500).render("error", {
                ErrorText: "Please Check Your Login Details..",
            });
        }
    } catch (err) {
        res.status(500).render("error", {
            ErrorText: "Please Check Your Login Details..",
        });
    }
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/home", auth, async(req, res) => {
    try {
        res.status(200).render("home");
    } catch (err) {
        res.send(err);
    }
});
app.post("/donor", async(req, res) => {
    try {
        var donorsdata = new Donor({
            Phone: req.body.phonenumber,
            Name: req.body.name,
            FatherName: req.body.fathername,
            DateOfBirth: {
                dd: req.body.date,
                mm: req.body.month,
                yy: req.body.year,
            },
            Age: req.body.age,
            Address: req.body.Address,
            City: req.body.city,
            District: req.body.district,
            CurrentDate: req.body.currentdate,
        });

        console.log("Donor Details" + donorsdata);
        console.log("before save the donors data in to the database");

        //token generation
        var token = await donorsdata.generateToken();
        console.log("Token Generate at the time of register:" + token);

        //coookie generation
        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 10000 * 60), //cookie delete automatically afther the 10 min
            httpOnly: true,
        });

        var donor = await donorsdata.save();
        console.log("donor registriaon output: " + donor);

        var obj = new Date("July 6 2022");
        var months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "June",
            "July",
            "Aug",
            "Sept",
            "Oct",
            "Nov",
            "Dec",
        ];
        var getDate = `${obj.getDate()}${
      months[obj.getMonth()]
    },${obj.getFullYear()}`;

        res.status(200).render("donorregistration", {
            phone: donorsdata.Phone,
            name: donorsdata.Name,
            fathername: donorsdata.FatherName,
            date: donorsdata.DateOfBirth[0].dd,
            month: donorsdata.DateOfBirth[0].mm,
            year: donorsdata.DateOfBirth[0].yy,
            age: donorsdata.Age,
            address: donorsdata.Address,
            city: donorsdata.City,
            district: donorsdata.District,
            count: donorsdata.Tokens.length,
        });
    } catch (err) {
        console.log(`Donor data add into database error: ${err}`);
        res.send(`Donor data add into database error: ${err}`);
    }
});

//to count the donor donation in our camp

app.get("/donor", auth, async(req, res) => {
    var obj = new Date("July 06 2022");
    var months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "June",
        "July",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec",
    ];

    var date = obj.getDate();
    if (date < 10) {
        date = `0${date}`;
    }
    var getDate = `${date}${months[obj.getMonth()]},${obj.getFullYear()}`;

    var totalReg = await Donor.find({ CurrentDate: getDate });
    console.log(
        "jdsjafsdjfsklfjkjfjaskljdksljjasljjflasjfjsdflksajflsjfksdjjlk;fksdajsdjfsdjffkjsdajsdjkjfjsadfjsdfkjsf;kjdljsfklsdjsdfjksjsfjl;ksadjfoiroiwqrsdfjksdlaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaf" +
        totalReg
    );

    res.render("donorregistration", { new: totalReg.length });
});
app.get("/donor/:phone", async(req, res) => {
    var phoneNumber = req.params.phone;
    var verifyUser = await Donor.findOne({ Phone: phoneNumber });
    res.send("Succressuly found that user:" + verifyUser);
});
app.post("/verify", async(req, res) => {
    try {
        var phoneNumber = req.body.phonenumber;
        var checkUser = await Donor.findOne({ Phone: phoneNumber });

        var obj = new Date("July 6 2022");
        var months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "June",
            "July",
            "Aug",
            "Sept",
            "Oct",
            "Nov",
            "Dec",
        ];
        var date = obj.getDate();
        if (date < 10) {
            date = `0${date}`;
        }
        var getDate = `${date}${months[obj.getMonth()]},${obj.getFullYear()}`;

        var totalReg = await Donor.find({ CurrentDate: getDate });

        var token = await checkUser.generateToken();
        console.log("TOken Generete At the Time of Login" + token);

        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 10000 * 60),
            httpOnly: true,
        });

        if (checkUser != null) {
            res.render("verifydonor", {
                phone: checkUser.Phone,
                name: checkUser.Name,
                fathername: checkUser.FatherName,
                date: checkUser.DateOfBirth[0].dd,
                month: checkUser.DateOfBirth[0].mm,
                year: checkUser.DateOfBirth[0].yy,
                age: checkUser.Age,
                address: checkUser.Address,
                city: checkUser.City,
                district: checkUser.District,
                lastdonation: checkUser.Tokens[checkUser.__v].date,
                count: checkUser.Tokens.length,
                new: totalReg.length,
            });
        }
    } catch (err) {
        res.send(
            `<h1 style="color:red;">Can't Find The Donor Details...Please Register Donor First</h1>
            <center><a href="/donor"style="text-decoration:none;height:40px;width:140px;background:linear-gradient(to left,gold,purple);border-radius:5px;display:block;color:white;font-size:22px;font-weight:bold;padding-top:8px;box-sizing:border-box;">Register</a></center>`
        );
    }
});

app.get("/verify", autho, (req, res) => {
    res.render("verifydonor");
});

app.post("/info", async(req, res) => {
    try {
        var phoneNumber = req.body.phonenumber;

        var checkPhone = await Donor.findOne({ Phone: phoneNumber });
        console.log("Node Found the Id" + checkPhone);
        res.render("search", {
            lastdonation: checkPhone.Tokens[checkPhone.__v].date,
            phone: checkPhone.Phone,
            name: checkPhone.Name,
            fathername: checkPhone.FatherName,
            date: checkPhone.DateOfBirth[0].dd,
            month: checkPhone.DateOfBirth[0].mm,
            year: checkPhone.DateOfBirth[0].yy,
            age: checkPhone.Age,
            address: checkPhone.Address,
            city: checkPhone.City,
            district: checkPhone.District,
            totaldonation: checkPhone.Tokens.length,
        });
    } catch (err) {
        console.log(err);

        res.render("error", {
            ErrorText: "Phone Number Not Found On Our DataBase...Please Enter Valid Phone Number." +
                err,
        });
    }
});

app.get("/info", auth, async(req, res) => {
    res.status(200).render("search");
});

app.get("/update/:Phone", auth, async(req, res) => {
    try {
        var searchphone = req.params.Phone;

        var finduser = await Donor.findOne({ Phone: searchphone });

        res.render("update", {
            phone: finduser.Phone,
            name: finduser.Name,
            fathername: finduser.FatherName,
            date: finduser.DateOfBirth[0].dd,
            month: finduser.DateOfBirth[0].mm,
            year: finduser.DateOfBirth[0].yy,
            age: finduser.Age,
            address: finduser.Address,
            city: finduser.City,
            district: finduser.District,
            currentdate: finduser.CurrentDate,
        });

        app.post("/update", auth, async(req, res) => {
            try {
                var getDonor = await Donor.findOne({ Phone: finduser.Phone });
                console.log("finding the phone number form the database:" + getDonor);

                var result = await Donor.updateOne({ Phone: getDonor.Phone }, {
                    $set: {
                        Phone: req.body.newphonenumber,
                        Name: req.body.name,
                        FatherName: req.body.fathername,
                        DateOfBirth: {
                            dd: req.body.date,
                            mm: req.body.month,
                            yy: req.body.year,
                        },
                        Age: req.body.age,
                        Address: req.body.Address,
                        City: req.body.city,
                        District: req.body.district,
                        CurrentDate: req.body.currentdate,
                    },
                }, { new: true });

                res.render("update");
            } catch (err) {
                console.log("Erro ocure occure ocuure occure occurfe ocuure" + err);
            }
        });
    } catch (e) {
        console.log("jklsdjds update errir" + e);
    }
});

app.get("/update", auth, async(req, res) => {
    res.render("update");
});

app.get("/newregistration_details", auth, async(req, res) => {
    try {
        var obj = new Date("July 6 2022");
        var months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "June",
            "July",
            "Aug",
            "Sept",
            "Oct",
            "Nov",
            "Dec",
        ];
        var date = obj.getDate();
        if (date < 10) {
            date = `0${date}`;
        }
        var getDate = `${date}${months[obj.getMonth()]},${obj.getFullYear()}`;

        var newReg = await Donor.find({ CurrentDate: getDate }, { _id: 0, Name: 1, FatherName: 1, Phone: 1 });

        res.send(newReg);
    } catch (err) {
        console.log(err);
    }
});

app.get("/logout", auth, async(req, res) => {
    try {
        res.clearCookie("jwt"); //this line delete the cookie//"jwt" is the name of the cookie

        //now to want that when user click logoout button that current token will also delete form the data base
        console.log("admin user at the time of logout: " + req.adminuser);
        req.adminuser.Tokens = req.adminuser.Tokens.filter((value) => {
            return value.token != req.cookie;
        });

        await req.adminuser.save();
        res.render("login");
    } catch (err) {
        res.status(403).send("Field to logout: " + err);
    }
});

app.get("/", (req, res) => {
    res.render("login");
});

app.get("*", (req, res) => {
    res.status(500).render("err");
});

app.get("/*", (req, res) => {
    res.status(500).render("err");
});

app.get("login/*", (req, res) => {
    res.status(500).render("err");
});
app.get("donor/*", (req, res) => {
    res.status(500).render("err");
});
app.get("home/*", (req, res) => {
    res.status(500).render("err");
});
app.get("info/*", (req, res) => {
    res.status(500).render("err");
});

app.listen(port, () => {
    console.log("Listening Your Request at the Port Number..." + port);
});