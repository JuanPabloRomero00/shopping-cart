const express = require('express');
const router = express.Router();
const { createPermissionHandler, getPermissionsHandler } = require('../handlers/permissions.handler');

router.post('/', createPermissionHandler);
router.get('/', getPermissionsHandler);

module.exports = router;
