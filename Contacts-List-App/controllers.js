const Contact = require('./contactSchema');

exports.getAllContacts = (req, res) => {
	Contact.find()
		.then((contacts) => {
			res.render('index', { contacts, error: {} });
		})
		.catch((err) => {
			console.log(err);
			res.json({ message: 'server error' });
		});
};

exports.getSingleContact = (req, res) => {
	let { id } = req.params;

	Contact.findById(id)
		.then((contact) => {
			res.json(contact);
		})
		.catch((err) => {
			console.log(err);
			res.json({ message: 'server error' });
		});
};

exports.createContact = (req, res) => {
	let { name, phone, email, id } = req.body;

	let error = {};

	if (!name) {
		error.name = 'Please provide your name';
	}

	if (!phone) {
		error.phone = 'Please provide your phone';
	}

	if (!email) {
		error.email = 'Please provide your email';
	}

	let isError = Object.keys(error).length > 0;

	if (isError) {
		Contact.find()
			.then((contacts) => {
				return res.render('index', { contacts, error });
			})
			.catch((err) => {
				console.log(err);
				return res.json({ message: 'server error' });
			});
	} else {
		if (id) {
			Contact.findOneAndUpdate(
				{ _id: id },
				{
					$set: { name, phone, email }
				}
			)
				.then(() => {
					Contact.find().then((contacts) => {
						return res.render('index', { contacts, error: {} });
					});
				})
				.catch((err) => {
					console.log(err);
					res.json({ message: 'server error' });
				});
		} else {
			let contact = new Contact({ name, phone, email });

			contact
				.save()
				.then(() => {
					Contact.find().then((contacts) => {
						return res.render('index', { contacts, error: {} });
					});
				})
				.catch((err) => {
					console.log(err);
					return res.json({ message: 'server error' });
				});
		}
	}
};

exports.updatedContact = (req, res) => {
	let { name, email, phone } = req.body;
	let { id } = req.params;

	Contact.findOneAndUpdate(
		{ _id: id },
		{
			$set: { name, phone, email }
		},
		{
			new: true
		}
	)
		.then((data) => {
			res.json(data);
		})
		.catch((err) => {
			console.log(err);
			res.json({ message: 'server error' });
		});
};

exports.deleteContact = (req, res) => {
	let { id } = req.params;

	Contact.findOneAndDelete({ _id: id })
		.then(() => {
			Contact.find().then((contacts) => {
				res.render('index', { contacts, error: {} });
			});
		})
		.catch((err) => {
			console.log(err);
			res.json({ message: 'server error' });
		});
};
