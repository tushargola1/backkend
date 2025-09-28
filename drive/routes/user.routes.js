const express = require('express')
const userModel = require('../models/user.model')
const router = express.Router()
const {body , validationResult} = require('express-validator')

router.get('/register' , (req , res) =>{
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

(req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
            message: 'invalid data'
        })
    }
 console.log(req.body);
    res.send('user registered')
});


module.exports = router