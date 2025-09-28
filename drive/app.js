const express = require('express');
const dotenv = require('dotenv');
dotenv.config(); // ✅ Load env variables BEFORE using them

const connectToDb = require('./config/db');
connectToDb(); // ✅ Now this will have access to MONGO_URI

const app = express();

const userRoute = require('./routes/user.routes');

// ejs
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/user', userRoute);

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(3000, () => {
    console.log('route is working');
});
