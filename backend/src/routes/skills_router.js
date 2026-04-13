const express = require('express')
const { getAllSkills } = require('../controllers/skills_controller')

const router = express.Router();

router.get('/', getAllSkills)

module.exports = router