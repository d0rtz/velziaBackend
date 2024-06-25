
const House = require('../models/House');

// Servicio para obtener todas las casas
const getAllHouses = async () => {
    try {
        const houses = await House.find({});
        console.log('HouseService: fetched all houses');
        return houses;
    } catch (error) {
        console.error(`HouseService: error fetching houses: ${error.message}`);
        throw new Error('Error fetching houses');
    }
};

// Servicio para obtener una casa por ID
const getHouseById = async (id) => {
    try {
        const house = await House.findById(id);
        console.log(`HouseService: fetched house with ID: ${id}`);
        return house;
    } catch (error) {
        console.error(`HouseService: error fetching house with ID ${id}: ${error.message}`);
        throw new Error('Error fetching house');
    }
};

// Servicio para crear una nueva casa
const createHouse = async (data) => {
    try {
        const newHouse = new House(data);
        const savedHouse = await newHouse.save();
        console.log(`HouseService: created new house: ${savedHouse._id}`);
        return savedHouse;
    } catch (error) {
        console.error(`HouseService: error creating house: ${error.message}`);
        throw new Error('Error creating house');
    }
};

// Servicio para actualizar una casa
const updateHouse = async (id, data) => {
    try {
        const house = await House.findById(id);
        if (house) {
            house.set(data);
            const updatedHouse = await house.save();
            console.log(`HouseService: updated house with ID: ${id}`);
            return updatedHouse;
        } else {
            console.warn(`HouseService: house with ID: ${id} not found`);
            throw new Error('House not found');
        }
    } catch (error) {
        console.error(`HouseService: error updating house with ID ${id}: ${error.message}`);
        throw new Error('Error updating house');
    }
};

// Servicio para eliminar una casa
const deleteHouse = async (id) => {
    try {
        const house = await House.findById(id);
        if (house) {
            await house.remove();
            console.log(`HouseService: deleted house with ID: ${id}`);
            return { message: 'House removed' };
        } else {
            console.warn(`HouseService: house with ID: ${id} not found`);
            throw new Error('House not found');
        }
    } catch (error) {
        console.error(`HouseService: error deleting house with ID ${id}: ${error.message}`);
        throw new Error('Error deleting house');
    }
};

module.exports = {
    getAllHouses,
    getHouseById,
    createHouse,
    updateHouse,
    deleteHouse
};
