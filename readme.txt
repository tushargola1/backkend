1. Set up Express and EJS:
const express = require("express");

const app = express();

// Set EJS as the view engine
app.set("view engine", "ejs");

// Use JSON and URL-encoded parser middleware to handle POST data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from 'public' folder
app.use(express.static("public"));
Key Notes:
•	Create a folder named views and inside it, place the index.ejs file (not index.html).
•	The .ejs file works similarly to HTML, but you can insert JavaScript logic and variables inside it.
________________________________________
2. Set up MongoDB Connection:
2.1 Install MongoDB and Mongoose:
Make sure you have mongoose installed via npm:
npm install mongoose
2.2 Database Configuration (db.js):
Create a folder named config, then inside it, create a file named db.js:
const mongoose = require('mongoose');

// Connect to MongoDB
const connection = mongoose.connect('mongodb://0.0.0.0:27017/mydatabase')
  .then(() => {
    console.log('Database connected');
  })
  .catch(err => {
    console.log('Database connection failed:', err);
  });

module.exports = connection;
Key Notes:
•	mongoose.connect() is used to connect to the MongoDB database.
•	Replace 'mydatabase' with the actual name of your database.
•	You should handle errors in case the connection fails.
________________________________________
3. Create Models (e.g., user.js):
Inside a folder named models, create a file like user.js to define the schema and model for MongoDB:
const mongoose = require('mongoose');

// Create schema for user data
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  age: Number,
  gender: {
    type: String,
    enum: ['male', 'female'], // Only 'male' or 'female' allowed
  },
});

// Create a model using the schema
const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
Key Notes:
•	The userSchema defines the fields for the User collection in MongoDB.
•	enum is used to limit the gender field to specific values (in this case, 'male' or 'female').
________________________________________
4. Main Application File (app.js):
In the main file (usually app.js), include your configurations and models:
const express = require("express");
const db = require("./config/db"); // MongoDB connection
const userModel = require('./models/user'); // User model

const app = express();

// Set EJS as the view engine
app.set("view engine", "ejs");

// Use JSON and URL-encoded parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' folder
app.use(express.static("public"));

// Example route to render a page
app.get('/', (req, res) => {
  res.render('index', { title: 'Home Page' });
});

// Example route to create a new user
app.post('/createUser', async (req, res) => {
  try {
    const user = new userModel(req.body); // Create a new user with data from the form
    await user.save(); // Save user to DB
    res.redirect('/'); // Redirect after saving
  } catch (err) {
    console.log(err);
    res.status(500).send('Error creating user');
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
Key Notes:
•	Route Example: / renders the index.ejs file. You can pass data like title to it.
•	POST route /createUser handles creating a new user and saves it to the database.
________________________________________
5. 6. Add User Registration Routes:
6.1 GET Route to Render Registration Form:
app.get("/register", (req, res) => {
  // Render the 'userRegister.ejs' form where users can enter registration details
  res.render("userRegister");
});
•	This route renders an EJS template named userRegister.ejs (make sure this file is inside your views folder).
________________________________________
6.2 POST Route to Handle Registration Form Submission:
app.post("/register", async (req, res) => {
  const { username, email } = req.body;

  try {
    // Create a new user document in MongoDB
    await userModel.create({
      username: username,
      email: email,
    });

    // Send success message
    res.send("User registered successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error registering user");
  }
});
•	This route receives form data, saves it to the database, and sends a response.
•	Always wrap asynchronous DB operations in try-catch to handle errors properly.
________________________________________
7. Create userRegister.ejs form:
Inside your views folder, create a file called userRegister.ejs with a simple registration form:
<!DOCTYPE html>
<html>
<head>
  <title>User Registration</title>
</head>
<body>
  <h1>Register User</h1>

  <form action="/register" method="POST">
    <label>Username:</label>
    <input type="text" name="username" required /><br />

    <label>Email:</label>
    <input type="email" name="email" required /><br />

    <button type="submit">Register</button>
  </form>
</body>
</html>
________________________________________
Summary of New Addition:
•	GET /register — Displays the registration form.
•	POST /register — Handles form submission and saves the user to MongoDB.
•	Ensure the form’s action matches the POST route (/register), and method is POST.
 
CRUD Operations with Mongoose
________________________________________
1. Read Data
// Find all users with username 'tushar'
// find() returns an array (empty if no data found)
app.get('/get-user', (req, res) => {
  userModel.find({ username: 'tushar' })
    .then((users) => {
      res.send(users);
    });
});
•	find() returns an array of matching documents.
•	If nothing is found, it returns an empty array [].
•	To find only one document, you can use findOne(), but it returns null if nothing is found.
•	Using find() is generally preferred unless you want exactly one document.
________________________________________
2. Update Data
// Update user email where username is 'tushar'
// This is an async operation, so we use async/await

app.get('/update-user', async (req, res) => {
  await userModel.findOneAndUpdate(
    { username: 'tushar' },
    { email: 'sonaliji@gmail.com' }
  );

  res.send('User updated');
});
•	findOneAndUpdate() updates the first document matching the filter.
•	This is asynchronous (takes time), so we use async function + await to wait for the operation to finish before sending a response.
________________________________________
3. Delete Data
// Delete a user where username is 'tushar'
// Async operation with async/await

app.get('/delete-user', async (req, res) => {
  await userModel.findOneAndDelete({ username: 'tushar' });

  res.send('User deleted');
});
•	findOneAndDelete() deletes the first document matching the filter.
•	Also asynchronous, so we use async/await.
________________________________________
Why Use async/await?
•	Database operations are asynchronous, meaning they take time to complete.
•	Without await, the server may send a response before the database finishes the operation.
•	Using async (to declare the function asynchronous) and await (to wait for the operation) ensures the operation completes before proceeding.
•	It makes your code easier to read compared to using .then() chains.
________________________________________
Summary
Operation	Mongoose Method	Returns	Notes
Read	find()	Array of docs	Empty array if none found
Read one	findOne()	Single doc or null	Returns null if none found
Update	findOneAndUpdate()	Updated doc	Use with async/await
Delete	findOneAndDelete()	Deleted doc	Use with async/await
Project learning

Why Use express.Router?
•	Express Router is a mini version of the Express app that helps organize your routes better.
•	Instead of defining all your routes directly in the main app.js file, you can split them into multiple files using express.Router().
•	This makes your code cleaner, more modular, and easier to maintain—especially as your app grows bigger.
________________________________________
Key Benefits:
1.	Separation of Concerns:
o	Group related routes together in separate files (e.g., userRoutes.js, productRoutes.js).
o	Keeps your main app file simple.
2.	Reusability:
o	You can import and use the router in different parts of your app if needed.
3.	Middleware Scoped to Router:
o	Apply middleware only to specific routes or groups of routes instead of globally.
________________________________________
Example:
// userRoutes.js
const express = require('express');
const router = express.Router();

router.get('/register', (req, res) => {
  res.send('User registration page');
});

router.post('/register', (req, res) => {
  // Register user logic here
  res.send('User registered');
});

module.exports = router;
// app.js
const express = require('express');
const app = express();

const userRoutes = require('./userRoutes');

// Use the userRoutes for all paths starting with /user
app.use('/user', userRoutes);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});



Folder Structure:
Here’s what your project folder structure might look like:
/project-folder
  ├── /config
  │    └── db.js           // MongoDB connection
  ├── /models
  │    └── user.js         // User model
  ├── /public              // Static files (CSS, JS, images)
  ├── /views
  │    └── index.ejs       // EJS template file
  ├── app.js               // Main Express app
  └── package.json         // Project dependencies
________________________________________
Summary:
•	EJS: Used as the templating engine to embed JavaScript into HTML.
•	Express: Framework to set up the server and handle routing.
•	MongoDB: NoSQL database to store user data.
•	Mongoose: Library to interact with MongoDB.

