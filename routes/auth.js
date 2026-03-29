const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();

// Middleware to redirect if already logged in
const redirectIfLoggedIn = (req, res, next) => {
  if (req.session.userId) {
    if (req.session.userRole === 'student') {
      return res.redirect('/student');
    } else if (req.session.userRole === 'admin') {
      return res.redirect('/admin');
    }
  }
  next();
};

// Login page
router.get('/login', redirectIfLoggedIn, (req, res) => {
  res.render('auth/login', { error: null });
});

// Login POST
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.render('auth/login', { error: 'Invalid email or password' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.render('auth/login', { error: 'Invalid email or password' });
    }

    // Set session
    req.session.userId = user._id;
    req.session.userRole = user.role;
    req.session.userName = user.name;

    // Redirect based on role
    if (user.role === 'student') {
      res.redirect('/student');
    } else if (user.role === 'admin') {
      res.redirect('/admin');
    }
  } catch (error) {
    console.error('Login error:', error);
    res.render('auth/login', { error: 'An error occurred. Please try again.' });
  }
});

// Signup page
router.get('/signup', redirectIfLoggedIn, (req, res) => {
  res.render('auth/signup', { error: null, success: null });
});

// Signup POST
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role } = req.body;

    // Validation
    if (!name || !email || !password || !confirmPassword || !role) {
      return res.render('auth/signup', { 
        error: 'All fields are required', 
        success: null 
      });
    }

    if (password.length < 6) {
      return res.render('auth/signup', { 
        error: 'Password must be at least 6 characters long', 
        success: null 
      });
    }

    if (password !== confirmPassword) {
      return res.render('auth/signup', { 
        error: 'Passwords do not match', 
        success: null 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.render('auth/signup', { 
        error: 'Email already registered', 
        success: null 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role
    });

    res.render('auth/signup', { 
      error: null, 
      success: 'Account created successfully! Please login.' 
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.render('auth/signup', { 
      error: 'An error occurred. Please try again.', 
      success: null 
    });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/login');
  });
});

module.exports = router;