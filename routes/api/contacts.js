const express = require('express')
const router = express.Router()
const Contacts = require('../../repository/index')
const {
  validateContact,
  validateStatusContact,
  validateContactId,
} = require('./validation')

const {
  getContact,
  getContacts,
  addContacts,
  removeContacts,
  updateContact,
  updateStatusContact,
} = require('../../controllers/contacts')

router.get('/', getContacts)

router.get('/:contactId', validateContactId, getContact)

router.post('/', validateContact, addContacts)

router.delete('/:contactId', validateContactId, removeContacts)

router.put('/:contactId', validateContactId, validateContact, updateContact)

router.patch(
  '/:contactId/favorite',
  validateContactId,
  validateStatusContact,
  updateStatusContact
)

module.exports = router
