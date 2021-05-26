const router = require('express').Router();

const { getAllContacts, createContact, getContactByID, updatedContact, deleteContact } = require('./contactController');

router.get('/', getAllContacts);
router.post('/', createContact);
router.get('/:id', getContactByID);
router.put('/:id', updatedContact);
router.delete('/:id', deleteContact);

module.exports = router;
