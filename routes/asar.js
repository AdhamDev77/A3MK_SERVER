const express = require('express')
const Asar= require('../models/asarModel')
const requireAuth = require('../middleware/requireAuth')
const { getAsar, getOneAsar, createAsar, updateAsar, deleteAsar} = require("../Controllers/asarController")

const router = express.Router()

//router.use(requireAuth)

router.get('/', getAsar)

router.get('/:id', getOneAsar)

router.post('/', createAsar)

router.delete('/:id', deleteAsar)

router.patch('/:id', updateAsar)

module.exports = router