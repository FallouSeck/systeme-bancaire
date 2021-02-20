const express = require('express');
const router = express.Router();

const indexController = require('../Controllers/director');

router.post('', indexController.createDirector);
router.get('', indexController.getDirector);
router.delete('/:id', indexController.deleteDirector);

module.exports = router;