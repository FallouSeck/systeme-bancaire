const express = require('express');
const router = express.Router();

const indexController = require('../Controllers/securityRounds');

router.post('', indexController.createSecurityRound);
router.get('', indexController.getSecurityRounds);
router.get('/:id', indexController.getOneSecurityRound);

module.exports = router;