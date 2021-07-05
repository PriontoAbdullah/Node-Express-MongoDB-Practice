const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const router = express.Router();
const userSchema = require('./userSchema');
const jwt = require('jsonwebtoken');

const User = new mongoose.model('User', userSchema);

// Signup
router.post('/signup', async (req, res) => {
	try {
		const hashedPassword = await bcrypt.hash(req.body.password, 10);

		const newUser = new User({
			name: req.body.name,
			username: req.body.username,
			password: hashedPassword
		});

		await newUser.save();

		res.status(200).json({
			message: 'Signup was successful!'
		});
	} catch (err) {
		res.status(500).json({
			message: 'Signup Failed!'
		});
	}
});

// Login
router.post('/login', async (req, res) => {
	try {
		const user = await User.findOne({ username: req.body.username });

		if (user) {
			const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);

			if (isPasswordCorrect) {
				// generate token
				const token = jwt.sign(
					{
						username: user.username,
						userId: user._id
					},
					process.env.JWT_SECRET,
					{
						expiresIn: '2h'
					}
				);
				res.status(200).json({
					access_token: token,
					message: 'Login was successful!'
				});
			} else {
				res.status(401).json({
					message: 'Authentication Failed!'
				});
			}
		} else {
			res.status(401).json({
				message: 'Authentication Failed!'
			});
		}
	} catch (err) {
		res.status(500).json({
			message: 'Login Failed!'
		});
	}
});

module.exports = router;
