// src/controllers/authController.js
const { User } = require('../models');
const bcrypt = require('bcryptjs');

exports.signup = async (req, res) => {
    const { username, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, password: hashedPassword, role });
        res.status(201).json({ message: 'User created successfully', user });
    } catch (err) {
        res.status(500).json({ message: 'Error creating user', error: err });
    }
};

exports.signin = (req, res) => {
    res.status(200).json({ message: 'Signed in successfully', user: req.user });
};

exports.signout = (req, res) => {
    req.logout();
    res.status(200).json({ message: 'Signed out successfully' });
};
