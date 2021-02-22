const express = require('express');
const router = express.Router();

const indexController = require('../Controllers/bankAccounts');

router.post('', indexController.createBankAccount);
router.get('', indexController.getBankAccounts);
router.get('/:id', indexController.getOneBankAccount);
router.delete('/:id', indexController.deleteBankAccount);

module.exports = router;