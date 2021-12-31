const express = require('express');
const user = require('./api/user')
const auth = require('./api/auth')
const goods = require('./api/goods')

const router = express.Router();

router.use('/user', user)
router.use('/auth', auth)
router.use('/goods', goods)

module.exports = router