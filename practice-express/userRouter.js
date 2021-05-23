const userRouter = require('express').Router();
const { getAllReview, signupAuth } = require('./getController');

userRouter.get('/login', (req, res) => {
	res.send('I am login router');
});

userRouter.get('/logout', (req, res) => {
	res.send('I am logout router');
});

userRouter.get('/signup', signupAuth);

userRouter.get('/:userID/reviews/:reviewID', getAllReview);

module.exports = userRouter;
