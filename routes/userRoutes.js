const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Routes
router.post('/signup', userController.signup);
router.post('/signin', userController.signin);
router.get('/verify/:id', userController.verifyEmail);

// Add route to render signup page
router.get('/signup', (req, res) => {
    res.render('user/signup');
});
router.get('/signin', (req, res) => {
    const message = req.query.message || '';
    res.render('user/signin');
});
// router.get('/panel', userController.getAllUsers);

router.get('/panel', (req, res) => {
    res.render('user/panel');
});

router.get('/success', (req, res) => {
    res.render('user/success', { message: 'Sign-in successful!' });
});


module.exports = router;
