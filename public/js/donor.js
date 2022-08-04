var obj = new Date();
var days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thusday",
    "Friday",
    "Satuarday",
];
var day = days[obj.getDay()];
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
var month = months[obj.getMonth()];
var date = obj.getDate();
var year = obj.getFullYear();
var hour = obj.getHours();
var minute = obj.getMinutes();
if (date < 10) {
    date = `0${date}`;
}
if (hour <= 11) {
    hour = hour;
    var data = "am";
} else {
    hour = hour - 12;
    var data = "pm";
}
if (hour < 10) {
    hour = `0${hour}`;
}
if (minute < 10) {
    minute = `0${minute}`;
} else {
    minute = minute;
}

document.getElementById("date").firstElementChild.innerHTML = `${date}
${month},${year}`;

document.getElementById("time").innerHTML = `${hour}:${minute}${data}`;

document.getElementById("camp").firstElementChild.innerHTML = `40`;

document.getElementById("getDate").value = `${date}${month},${year}`;

//for the validation of phone number

document.getElementById("phone").addEventListener("change", () => {
    var phone = document.getElementById("phone").value;
    console.log(phone);
    if (phone == "") {
        alert("Please enter Your Phone Number");
    } else if (phone.length != 10) {
        alert("Phone Number Must Be 10 characters");
    } else if (
        phone.charAt(0) == 1 ||
        phone.charAt(0) == 2 ||
        phone.charAt(0) == 3 ||
        phone.charAt(0) == 4 ||
        phone.charAt(0) == 5
    ) {
        alert("Phone Number Is not a valid");
    }
});

//validation of date of birth

document.getElementById("birthdate").addEventListener("change", () => {
    var date = document.getElementById("birthdate").value;

    if (date > 31) {
        alert("Please check the Date of Birth of the donor ");
    }
});

document.getElementById("birthmonth").addEventListener("change", () => {
    var month = document.getElementById("birthmonth").value;

    if (month > 12) {
        alert("Please check the Date of Birth of the donor ");
    }
});

//for the prefix
function getoptionvalue() {
    var prefix = document.getElementById("prefix").value;

    if (prefix == "Mr") {
        document.getElementById("relation").innerHTML = `Father Name*`;
    } else if (prefix == "Mrs") {
        document.getElementById("relation").innerHTML = `Husband Name*`;
    } else {
        document.getElementById("relation").innerHTML = `Father Name*`;
    }
}

//to print the age automatically when admin enter the date of birth of the donor

document.getElementById("birthyear").addEventListener("change", () => {
    var d = document.getElementById("birthdate").value;
    var m = document.getElementById("birthmonth").value;
    var y = document.getElementById("birthyear").value;

    var object = new Date();
    var date = object.getDate();
    var month = object.getMonth() + 1;
    var year = object.getFullYear();
    var month_name = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if (d > date) {
        date = date + month_name[month - 1];
        month = month;
    }

    if (m > month) {
        month = month + 12;
        year = year - 1;
    }

    var tarikh = date - d;
    var mahina = month - m;
    var getyear = year - y;

    console.log(`${tarikh} ${mahina} ${getyear}`);

    document.getElementById("age").value = `${getyear}`;
});

//to show the sweet alert to the admin when click on save button
// document.getElementById("print").addEventListener("click", () => {
//     swal({
//         title: "Success",
//         text: "Data Successfully saved into the Database",
//         icon: "success",
//     });
// });

//to show the print details to the admin
function myPrint(myfrm) {
    var printdata = document.getElementById("myfrm");
    newin = window.open("");
    newin.document.write(printdata.outerHTML);
    newin.print();
    newin.close();
}