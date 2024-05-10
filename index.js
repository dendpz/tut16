// Required modules 
const express = require("express");
const app = express();
const dblib = require("./dblib.js");

const multer = require("multer");
const upload = multer();

// Add middleware to parse default urlencoded form
app.use(express.urlencoded({ extended: false }));

// Setup EJS
app.set("view engine", "ejs");

// Enable CORS (see https://enable-cors.org/server_expressjs.html)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

// Application folders
app.use(express.static("public"));

// Start listener
app.listen(process.env.PORT || 3000, () => {
    console.log("Server started (http://localhost:3000/) !");
});

// Setup routes
app.get("/", (req, res) => {
    //res.send("Root resource - Up and running!")
    res.render("index");
});

// Search using regular post method
app.get("/search", async (req, res) => {
    // Omitted validation check
    const totRecs = await dblib.getTotalRecords();
    //Create an empty product object (To populate the form with values)
    const prod = {
        prod_id: "",
        prod_name: "",
        prod_desc: "",
        prod_price: ""
    };
    res.render("search", {
        type: "get",
        totRecs: totRecs.totRecords,
        prod: prod
    });
});

app.post("/search", async (req, res) => {
    // Omitted validation check
    //  Can get totRecs from the page rather than using another DB call.
    //  Add it as a hidden form value.
    const totRecs = await dblib.getTotalRecords();

    // TESTING - WHAT CAME IN FROM THE FORM
    console.log("============ SEARCH - POST ============")
    console.log("============ SEARCH - POST - req.body ======")
    console.log(req.body);

    dblib.findProducts(req.body)
        .then(result => {
            res.render("search", {
                type: "post",
                totRecs: totRecs.totRecords,
                result: result,
                prod: req.body
            })
        })
        .catch(err => {
            res.render("search", {
                type: "post",
                totRecs: totRecs.totRecords,
                result: `Unexpected Error: ${err.message}`,
                prod: req.body
            });
        });
});

// -----------------------------------------------------------------------
/* Below is the code from Tut16
// Add packages
const dblib = require("./dblib.js");

dblib.getTotalRecords()
    .then(result => {
        if (result.msg.substring(0, 5) === "Error") {
            console.log(`Error Encountered.  ${result.msg}`);
        } else {
            console.log(`Total number of database records: ${result.totRecords}`);
        };
    })
    .catch(err => {
        console.log(`Error: ${err.message}`);
    });

////

const producta = [200,'Book', 'The JS Way', 9.99];
dblib.insertProduct(producta)
    .then(result => {
        if (result.trans === "fail") {
            console.log("ERROR OCCURED");
            console.log(result.msg);
        } else {
            console.log("Insert Successful");
            console.log(result.msg);
        }
    });


// Product array
const products = [
  {
      prod_id: 110,
      prod_name: 'Charger',
      prod_desc: 'USB',
      prod_price: 22.50
  },
  {
      prod_id: 200,
      prod_name: 'Book',
      prod_desc: 'The JS Way',
      prod_price: 9.99
  },
  {
      prod_id: 201,
      prod_name: 'Large Clips',
      prod_desc: 'Large binder clips',
      prod_price: 4.25
  },
  {
      prod_id: 202,
      prod_name: 'Medium Clips',
      prod_desc: 'Medium binder clips',
      prod_price: 3.25
  },
  {
      prod_id: 203,
      prod_name: 'Small Clips',
      prod_desc: 'Small binder clips',
      prod_price: 2.25
  }
];

// Declare variables
let numFailed = 0;
let numInserted = 0;
let errorMessage = "";

// Loop to insert - using async () function and await
// Not using try catch block
(async () => {
  console.log("--- STEP 1: Pre-Loop");
  for (prod of products) {
      console.log("--- STEP 2: In-Loop Before Insert");
      const result = await dblib.insertProduct(prod);
      console.log("--- STEP 3: In-Loop After Insert");
      console.log("result is: ", result);
      if (result.trans === "success") {
          numInserted++;
      } else {
          numFailed++;
          errorMessage += `${result.msg} \r\n`;
      };
  };    
  console.log("--- STEP 4: After-Loop");
  console.log(`Records processed: ${numInserted + numFailed}`);
  console.log(`Records successfully inserted: ${numInserted}`);
  console.log(`Records with insertion errors: ${numFailed}`);
  if(numFailed > 0) {
      console.log("Error Details:");
      console.log(errorMessage);
  };
})();
*/