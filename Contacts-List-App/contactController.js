const contacts = require('./Contact');

exports.getAllContacts = (req, res) => {
	res.json(contacts.getAllContacts());
};

exports.createContact = (req, res) => {
	let { name, phone, email } = req.body;
	let contact = contacts.createContact({
		name,
		phone,
		email
	});

	res.json(contact);
};

exports.getContactByID = (req, res) => {
	let { id } = req.params;
	id = parseInt(id);

	let contact = contacts.getAllContactsByID(id);
	res.json(contact);
};

exports.updatedContact = (req, res) => {
	let { id } = req.params;
	id = parseInt(id);

	let { name, phone, email } = req.body;
	let contact = contacts.updateContactByID(id, {
		name,
		phone,
		email
	});

	res.json(contact);
};

exports.deleteContact = (req, res) => {
	let { id } = req.params;
	id = parseInt(id);

	let { name, phone, email } = req.body;
	let contact = contacts.deleteContactByID(id);

	res.json(contact);
};
