const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Email Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// signup
exports.signup = async (req, res) => {
    try {
        console.log('Received raw data:', req.body);
        const { name, email, phoneNumber, password } = req.body;
        console.log('Received data:', { name, email, phoneNumber, password });

        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }
        
        // Basic Validation
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(phoneNumber)) {
            return res.status(400).json({ message: 'Invalid phone number' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            phoneNumber,
            password: hashedPassword,
            isVerified: false // Set to false until the user verifies their email
        });

        await newUser.save();

        // Send verification email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Email Verification',
            text: `Please verify your email by clicking on the following link: \n\nhttp://localhost:8000/user/verify/${newUser._id}`
        };

        await transporter.sendMail(mailOptions);

        // Redirect to sign-in page after successful signup
        res.redirect('/user/signin');
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};



// signin
exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (!user.isVerified) {
            return res.status(400).json({ message: 'Email not verified' });
        }

        // Redirect to success page or dashboard
        res.redirect('/user/success'); // Change this URL to wherever you want to redirect
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


// Render admin panel
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users from the database
        console.log(users); // Log users to ensure data is fetched
        res.render('user/panel', { users }); // Render the admin panel view with user data
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};


// Email Verification
exports.verifyEmail = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        user.isVerified = true;
        await user.save();

        res.status(200).json({ message: 'Email verified successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
