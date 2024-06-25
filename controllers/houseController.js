
const House = require('../models/House');

// Obtener todas las casas
const getHouses = async (req, res) => {
    try {
        const houses = await House.find({});
        res.json(houses);
        console.log('Fetched all houses successfully');
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
        console.error(`Error fetching houses: ${error.message}`);
    }
};

// Obtener una casa por ID
const getHouseById = async (req, res) => {
    try {
        const house = await House.findById(req.params.id);
        if (house) {
            res.json(house);
            console.log(`Fetched house with ID: ${req.params.id}`);
        } else {
            res.status(404).json({ message: 'House not found' });
            console.warn(`House with ID: ${req.params.id} not found`);
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
        console.error(`Error fetching house with ID ${req.params.id}: ${error.message}`);
    }
};

// Crear una nueva casa
const createHouse = async (req, res) => {
    try {
        const { name, price, location } = req.body;
        const newHouse = new House({ name, price, location });
        const createdHouse = await newHouse.save();
        res.status(201).json(createdHouse);
        console.log(`Created new house: ${createdHouse._id}`);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
        console.error(`Error creating house: ${error.message}`);
    }
};

// Actualizar una casa
const updateHouse = async (req, res) => {
    try {
        const { name, price, location } = req.body;
        const house = await House.findById(req.params.id);

        if (house) {
            house.name = name || house.name;
            house.price = price || house.price;
            house.location = location || house.location;
            const updatedHouse = await house.save();
            res.json(updatedHouse);
            console.log(`Updated house with ID: ${req.params.id}`);
        } else {
            res.status(404).json({ message: 'House not found' });
            console.warn(`House with ID: ${req.params.id} not found`);
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
        console.error(`Error updating house with ID ${req.params.id}: ${error.message}`);
    }
};

// Eliminar una casa
const deleteHouse = async (req, res) => {
    try {
        const house = await House.findById(req.params.id);

        if (house) {
            await house.remove();
            res.json({ message: 'House removed' });
            console.log(`Deleted house with ID: ${req.params.id}`);
        } else {
            res.status(404).json({ message: 'House not found' });
            console.warn(`House with ID: ${req.params.id} not found`);
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
        console.error(`Error deleting house with ID ${req.params.id}: ${error.message}`);
    }
};

module.exports = {
    getHouses,
    getHouseById,
    createHouse,
    updateHouse,
    deleteHouse
};
