const express = require('express');
const router = express.Router();

const indexController = require('../Controllers/advisors');

router.post('', indexController.createAdvisor);
router.get('', indexController.getAllAdvisors);
router.get('/:id', indexController.getOneAdvisor);
router.delete('/:id', indexController.deleteOneAdvisor);

module.exports = router;