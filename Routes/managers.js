const express = require('express');
const router = express.Router();

const indexController = require('../Controllers/managers');

router.post('', indexController.createManager);
router.get('', indexController.getAllManagers);
router.get('/:id', indexController.getOneManager);
router.delete('/:id', indexController.deleteManager);

module.exports = router;