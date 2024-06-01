const db = require('../models');
const { User, Role } = db;
const bcrypt = require('bcryptjs');
const passport = require('../middleware/auth');

exports.signup = async (req, res) => {
	const { username, password, roleId } = req.body;
	let role = roleId ? await Role.findOne({ where: { id: roleId } }) : null;
	
	try {
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await User.create({ username, password: hashedPassword, roleId: role ? roleId : null });

		// Respond with the created user
		res.status(201).json({ message: 'User created successfully', user });
	} catch (err) {
		// Handle errors
		res.status(500).json({ message: 'Error creating user', error: err });
	}
};

exports.signin = (req, res, next) => {
	passport.authenticate('local', (err, user, info) => {
			if (err) {
					return next(err);
			}
			if (!user) {
					return res.status(401).json({ message: 'Unauthorized' });
			}
			
			req.login(user, (err) => {
					if (err) {
							return next(err);
					}
					return res.status(200).json({ message: 'Signed in successfully', user: user });
			});
	})(req, res, next);
};

exports.signout = (req, res, next) => {
	req.logout((err) => {
			if (err) {
					return next(err);
			}
			res.status(200).json({ message: 'Signed out successfully' });
	});
};
