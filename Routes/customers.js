const express = require('express');
const router = express.Router();

const indexController = require('../Controllers/customers');

router.post('', indexController.createCustomer);
router.get('', indexController.getCustomers);
router.get('/:id', indexController.getOneCustomer);
router.delete('/:id', indexController.deleteCustomer);

module.exports = router;