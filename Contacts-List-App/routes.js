const router = require('express').Router();

const { getAllContacts, getSingleContact,  createContact, updatedContact, deleteContact } = require('./controllers');

router.get('/', getAllContacts);
router.get('/:id', getSingleContact);
router.post('/', createContact);
router.put('/:id', updatedContact);
router.delete('/:id', deleteContact);

module.exports = router;
