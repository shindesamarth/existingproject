"use strict";
let normalquery = [
  {
    id: 1,
    query: "Identify the total number of branches in each city.",
  },
  {
    id: 2,
    query: "Identify the total number of staff and the sum of their salaries.",
  },
  {
    id: 3,
    query:
      " Identify the total number of staff in each position at branches in Glasgow.",
  },
  {
    id: 4,
    query:
      " List the name of each Manager at each branch, ordered by branch address.",
  },
  {
    id: 5,
    query:
      " List the property number, address, type, and rent of all properties in Glasgow, ordered by rental amount.",
  },
  {
    id: 6,
    query:
      "Identify the total number of properties of each type at all branches.",
  },
  {
    id: 7,
    query:
      "Identify the details of private property owners that provide more than one property for rent.",
  },
  {
    id: 8,
    query:
      "Identify the total number of properties of each type at all branches.",
  },
  {
    id: 9,
    query:
      "Identify flats with at least three rooms and with a monthly rent no higher than £500 in Aberdeen.",
  },
  {
    id: 10,
    query:
      "Identify the properties that have been advertised more than the average number of times.",
  },
  {
    id: 11,
    query:
      "List the total number of leases with rental periods that are less than one year at branches in London.",
  },
  {
    id: 12,
    query:
      "List the total possible daily rental for property at each branch, ordered by branch number.",
  },
  {
    id: 13,
    query:
      "Identify properties located in Glasgow with rents no higher than £450.",
  },
  {
    id: 14,
    query:
      "List the details of properties that have not been rented out for more than three months.",
  },
];

let branchquery=[
  {
    id:15,
    query:"List the name, position, and salary of staff at a given branch, ordered by staff name."
  },
  {
    id:16,
    query:"Identify the total number of properties assigned to each member of staff at a given branch."
  },
  {
    id:17,
    query:"List the details of properties provided by business owners at a given branch."
  },
  {
    id:18,
    query:"List the number, name, and telephone number of clients and their property preferences at a given branch."
  },
  {
    id:19,
    query:"List the details of leases due to expire next month at a given branch."
  },
  {
    id:20,
    query:"List details of all Assistants alphabetically by name at the branch."
  },
  {
    id:21,
    query:"List the details of property (including the rental deposit) available for rent at the branch, along with the owner’s details."
  },
  {
    id:22,
    query:"List the clients registering at the branch and the names of the members of staff who registered the clients."
  },
  {
    id:23,
    query:"Identify the leases due to expire next month at the branch."
  },

];

let staffquery=[
  {
    id:24,
    query:"List the names of staff supervised by a named Supervisor."
  },
  {
    id:25,
    query:"List the details of properties for rent managed by a named member of staff."
  },
  {
    id:26,
    query:"List the details of properties managed by a named member of staff at the branch."
  },
  
];
let cityquery=[
  {
    id:27,
    query:"List the details of branches in a given city."
  }
];
let propertyrelated =[
  {
    id:28,
    query:"Identify the name and telephone number of an owner of a given property."
  },
  {
    id:29,
    query:"List the details of comments made by clients viewing a given property."
  },
  {
    id:30,
    query:"Display the names and phone numbers of clients who have viewed a given property but not supplied comments."
  },
  {
    id:31,
    query:"Display the details of a lease between a named client and a given property."
  }
];

























const express = require("express");
const ejs = require("ejs");
const bodyparser = require("body-parser");
const app = express();
const path = require("path");
const mysql = require("mysql");
const session = require("express-session");

//app.set("views", path.join(__dirname, "views"));
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);
function connectioni() {
  var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Tejas@1234",
    database: "dreamhouse",
  });
  return conn;
}

app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.get("/register", function (req, res) {
  res.render("register");
});
app.get("/", function (req, res) {
  res.render("index");
});

app.post("/register", function (req, res) {
  const name = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const c = connectioni();
  c.connect(function (err) {
    if (err) {
      console.log(err);
    } else {
      let sql = `SELECT * FROM users WHERE username='${name}'`;
      c.query(sql, function (err, result) {
        if (err) {
          console.log(err);
        } else {
          if (result.length > 0) {
            res.render("register", {
              error: "User with the same username already exists",
            });
          } else {
            sql = `INSERT INTO users(username, email, password) VALUES('${name}','${email}','${password}')`;
            c.query(sql, function (err, result) {
              if (err) {
                console.log(err);
              } else {
                console.log(result);
              }
            });
            c.end();
            res.render("index");
          }
        }
      });
    }
  });
});
app.post("/login", function (req, res) {
  const user = req.body.username;
  const pass = req.body.password;
  let re;
  const c = connectioni();
  c.connect(function (err) {
    if (err) {
      console.log(err);
    }
  });

  let sql = `select * from users where username='${user}' and password='${pass}'`;

  c.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      if (result.length != 0) {
        //console.log(result[0].id,result[0].username);
        req.session.user = { id: result[0].id, name: result[0].username };
        c.end();
        res.render("home");
      } else {
        console.log(result);
        c.end();
        res.render("error");
      }
    }
  });
});
// function to check if user is logged in or not
function requiredlogin(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.redirect("/");
  }
}
// function to generate client number automatically
// function genereateclientnumber(){
//   const c = connectioni();
//   c.connect(function(err){
//     if(err){
//       console.log(err);
//     }
//     else{
//       let sql =
//     }
//   })

// }

app.post("/adminreg", function (req, res) {
  const staffno =req.body.staffno;
  const name=req.body.fullname;
  const dob=req.body.dat;
  const gender=req.body.gender;
  const branchnumber=req.body.branchnumber;
  
});

app.listen(3000, function (req, res) {
  console.log("started");
});
app.get("/home", requiredlogin, function (req, res) {
  res.render("home");
});
app.get("/propertyregister", requiredlogin, function (req, res) {
  res.render("propertyregister");
});
app.get("/view-property", requiredlogin, function (req, res) {
  res.render("propertyregister");
});
app.get("/clientregister", requiredlogin, function (req, res) {
  res.render("clientregister");
});
app.get("/secret/admin", function (req, res) {
  res.render("adminregister");
});
app.get("/secret", function (req, res) {
  res.render("adminlogin");
});
app.get("/secret/adminhome", function (req, res) {
  res.render("adminhome");
});
app.get("/secret/normalquery", function (req, res) {
  res.render("normalquery", { obj: normalquery });
});
app.get("/secret/branchquery", function (req, res) {
  res.render("branchquery", { obj: branchquery });
});
app.get("/secret/staffquery", function (req, res) {
  res.render("staffquery", { obj: staffquery });
});
app.get("/secret/cityquery", function (req, res) {
  res.render("cityquery", { obj: cityquery });
});
app.get("/secret/propertyquery", function (req, res) {
  res.render("propertyquery", { obj: propertyrelated});
});
