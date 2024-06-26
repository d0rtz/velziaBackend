import {
  getHousesService,
  getHouseByIdService,
  createHouseService,
  updateHouseService,
  deleteHouseService,
  updateHouseImagesService,
  newHouseImagesService,
} from '../services/houseService.js';

export const getHouses = async (req, res) => {
  console.log('Executing getHouses...');
  console.log(`Request params: ${JSON.stringify(req.params)}`);
  try {
    const houses = await getHousesService(req.params.name, req.params.id);
    console.log(`Houses fetched: ${JSON.stringify(houses)}`);
    res.status(200).json({ houses });
  } catch (error) {
    console.log(`Error fetching houses: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

export const getHouseById = async (req, res) => {
  console.log('Executing getHouseById...');
  console.log(`Request params: ${JSON.stringify(req.params)}`);
  try {
    const { id } = req.params;
    console.log(`Fetching house with ID: ${id}`);
    const house = await getHouseByIdService(id);
    console.log(`House fetched: ${JSON.stringify(house)}`);
    res.status(200).json({ house });
  } catch (error) {
    console.log(`Error fetching house: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

export const createHouse = async (req, res) => {
  console.log('Executing createHouse...');
  console.log(`Request body: ${JSON.stringify(req.body)}`);
  try {
    const house = await createHouseService(req.body);
    console.log(`House created with ID: ${house.insertId}`);
    res.status(201).json({ message: 'House created', id: house.insertId });
  } catch (error) {
    console.log(`Error creating house: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

export const updateHouse = async (req, res) => {
  console.log('Executing updateHouse...');
  console.log(`Request params: ${JSON.stringify(req.params)}`);
  console.log(`Request body: ${JSON.stringify(req.body)}`);
  try {
    const { id } = req.params;
    console.log(`Updating house with ID: ${id}`);
    await updateHouseService(id, req.body);
    console.log('House updated successfully');
    res.status(200).json({ message: 'House updated' });
  } catch (error) {
    console.log(`Error updating house: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

export const updateHouseImages = async (req, res) => {
  console.log('Executing updateHouseImages...');
  console.log(`Request params: ${JSON.stringify(req.params)}`);
  console.log(`Request files: ${JSON.stringify(req.files)}`);
  try {
    const { id } = req.params;
    const images = req.files;
    console.log(`Updating images for house with ID: ${id}`);
    await updateHouseImagesService(id, images);
    console.log('House images updated successfully');
    res.status(200).json({ message: 'House images updated' });
  } catch (error) {
    console.log(`Error updating house images: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

export const newHouseImages = async (req, res) => {
  console.log('Executing newHouseImages...');
  console.log(`Request files: ${JSON.stringify(req.files)}`);
  console.log(`Request body: ${JSON.stringify(req.body)}`);
  try {
    const images = req.files;
    const body = req.body;
    console.log('Adding new images to house');
    await newHouseImagesService(images, body);
    console.log('House images added successfully');
    res.status(200).json({ message: 'House images added' });
  } catch (error) {
    console.log(`Error adding house images: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

export const deleteHouse = async (req, res) => {
  console.log('Executing deleteHouse...');
  console.log(`Request params: ${JSON.stringify(req.params)}`);
  try {
    const { id } = req.params;
    console.log(`Deleting house with ID: ${id}`);
    await deleteHouseService(id);
    console.log('House deleted successfully');
    res.status(200).json({ message: 'deleted' });
  } catch (error) {
    console.log(`Error deleting house: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};
