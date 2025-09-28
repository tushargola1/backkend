const mongoose = require('mongoose')

function dbConnection(){
    //ab idhar hame direct url nhi de skte kyuki production pe dikat aa skti he hame kya karenge ki environment variable banayenge .env file bana ke jo bahut hi jyda safe rakhni hoti he and .env file ke saath ek package install hoga npm i dotenv and then setup krna hoga app.js main file me

    mongoose.connect(process.env.MONGO_URI).then(() =>{
        console.log('connected to db');
    })
    
}

// requie in app.js file
module.exports = dbConnection