const express = require('express');
const router = express.Router();

const indexController = require('../Controllers/securityAgent');

router.post('', indexController.createSecurityAgent);
router.get('', indexController.getSecurityAgent);
router.delete('/:id', indexController.deleteSecurityAgent);

module.exports = router;