const Contact = require('./contactSchema');

exports.getAllContacts = (req, res) => {
	Contact.find()
		.then((contacts) => {
			res.json(contacts);
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
	let { name, phone, email } = req.body;

	let contact = new Contact({ name, phone, email });

	contact
		.save()
		.then((data) => {
			res.json(data);
		})
		.catch((err) => {
			console.log(err);
			res.json({ message: 'server error' });
		});
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
		.then((data) => {
			res.json(data);
		})
		.catch((err) => {
			console.log(err);
			res.json({ message: 'server error' });
		});
};
