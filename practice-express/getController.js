exports.getAllReview = (req, res) => {
	res.send(`I am user ID of ${req.params.userID} of review ${req.params.reviewID}`);
};

exports.signupAuth = (req, res) => {
	res.send('I am signup router');
};
