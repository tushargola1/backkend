const express = require('express')
const userModel = require('../models/user.model')
const router = express.Router()
const { body, validationResult } = require('express-validator')

// npm i bcrypt to convert our login and otehr important data into hash forms 
const bcrypt = require('bcrypt')

// jwt
const jwt = require('jsonwebtoken')

router.get('/register', (req, res) => {
    res.render('register')
})
router.post('/register',

    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Must be a valid email')
        .isLength({ min: 10 }).withMessage('Email must be at least 10 characters'),

    body('password')
        .trim()
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),

    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'invalid data'
            })
        }
        const { name, email, password } = req.body

        // neeche wala code hamara data database me save karega but password direct nnhi bhejte to isliye hum bcrypt use karenge 

        // const newUser = await userModel.create({
        //     email, name , password
        // })

        // after bcrypt
        const hashPassword = await bcrypt.hash(password, 10)
        const newUser = await userModel.create({
            email, name, password: hashPassword
        })

        res.json(newUser)
    });

// login

router.get('/login', (req, res) => {
    res.render('login')
})
router.post('/login',

    body('email')
        .trim()
        .notEmpty().withMessage('email is required')
        .isEmail().withMessage('must be a valid email')
        .isLength({ min: 10 }).withMessage('email must be of 10 characters at least'),

    body('password')
        .trim()
        .notEmpty().withMessage('password is required')
        .isLength({ min: 10 }).withMessage('atleast of 10'),

    async (req, res) => {

        const error = validationResult(req)
        if (!error.isEmpty()) {
            return res.status(400).json({
                error: error.array(),
                message: 'invalid data'
            })
        }

        const { email, password } = req.body

        const user = await userModel.findOne({
            email: email
        })

        if (!user) {
            return res.status(400).json({
                message: "username or password is incorrect"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({
                message: "username or password is incorrect"
            })
        }

        // now if user login successfully then we generate a token using a package npm i jsonwebtoken

        const token = jwt.sign({
            userId: user._id,
            email: user.email,
            name: user.name
        },
            // ek secret key ayegi which is important 
            process.env.JWT_SECRET
        )

        // here i got the token but we save trhis token as cookies using this package npm i cookie-parser and then require it in app.js i mean in the main file
     
        res.cookie('token' , token)
        res.send('logged in ')


    }
)

module.exports = router
