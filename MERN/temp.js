const express = require("express");
const db = require("./config/db");
const userModel = require("./models/user");

const app = express();

// use of ejs
//  applications to generate HTML markup with JavaScript
// and using ejs we need to craete a folder name exact views with file name of index.ejs not index.html but the code is same exact same as html

app.set("view engine", "ejs");

// to get the post data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// to get the post data

// to link static files
app.use(express.static("public"));

app.use((req, res, next) => {
  console.log("i am middleware");
  return next();
});

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/about", (req, res) => {
  res.end("i am about  ");
});
app.post("/contact", (req, res) => {
  console.log(req.body);
  res.send("your data recived");
});

app.get("/register", (req, res) => {
  res.render("userRegister");
});
app.post("/register", async(req, res) => {


  const { username, email } = req.body;

 await userModel.create({
    username: username,
    email: email,
  });

  res.send("user registered successfullly");

});

// crud operations

// ================ read ============

//using find will give [] empty array if nothing is there and if we want only one to find then we use findOne but findOne will give null if nothing is there so we prefer to use find normally
app.get('/get-user' , (req , res) =>{
    userModel.find({
        username:'tushar'
    }).then((users) =>{
        res.send(users)
    })
})

// ================ update ============


// ye ek async operation he to async await lagega 

app.get('/update-user' , async(req , res) =>{
     await userModel.findAndUpdate({
        username:'tushar'
    },
    {
        email:'sonaliji@gmail.com'
    }

)
res.send('user updated')
})

// ================ delete ============


// ye ek async operation he to async await lagega 

app.get('/delete-user' , async(req , res) =>{
     await userModel.findOneAndDelete({
        username:'tushar'
    }
)
res.send('user deleted')
})


app.listen(3000);
