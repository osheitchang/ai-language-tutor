require('dotenv').config();

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); //importing the user model
const authMiddleware = require('../middleware/authmiddleware');
const router = express.Router(); //Create a router
const Joi = require('joi');

const signupSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
})

// Now you can use the variables
console.log(process.env.PORT);        // "5000"
console.log(process.env.MONGODB_URI); // "mongodb+srv://..."
console.log(process.env.JWT_SECRET);  // "mysupersecretkey"

//User Sign up Route
router.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    const { error } = signupSchema.validate(req.body)

    //Check if the email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'Email already exists' })
    }

    //hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create new user
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    //Send response 
    res.status(201).json({ message: 'User registered successfully' });
})

// User Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    //find the user by email
    const user = await User.findOne({ email })

    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' })
    }

    //Generate a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token })
})


// Sample use of the middleware
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        // Use req.user.userId instead of req.user
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Optionally remove password from response
        const userWithoutPassword = {
            _id: user._id,
            email: user.email,
            password: user.password
            // Add other fields you want to return
        };
        console.log(req.user)
        res.json(userWithoutPassword);
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});



module.exports = router;