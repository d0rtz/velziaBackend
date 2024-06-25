
const express = require('express');
const {
    getHouses,
    getHouseById,
    createHouse,
    updateHouse,
    deleteHouse
} = require('../controllers/houseController');

const router = express.Router();

router.route('/')
    .get(getHouses)
    .post(createHouse);

router.route('/:id')
    .get(getHouseById)
    .put(updateHouse)
    .delete(deleteHouse);

module.exports = router;
