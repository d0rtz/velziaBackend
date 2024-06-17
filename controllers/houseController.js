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
    try {
      const houses = await getHousesService(req.params.name, req.params.id);
      res.status(200).json({ houses });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  export const getHouseById = async (req, res) => {
    try {
      const { id } = req.params;
      const house = await getHouseByIdService(id);
      res.status(200).json({ house });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  export const createHouse = async (req, res) => {
    try {
      const house = await createHouseService(req.body);
      res.status(201).json({ message: 'House created', id: house.insertId });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  export const updateHouse = async (req, res) => {
    try {
      const { id } = req.params;
      await updateHouseService(id, req.body);
      res.status(200).json({ message: 'House updated' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  export const updateHouseImages = async (req, res) => {
    try {
      const { id } = req.params;
      const images = req.files;
      await updateHouseImagesService(id, images);
      res.status(200).json({ message: 'House images updated' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  export const newHouseImages = async (req, res) => {
    try {
      const images = req.files;
      const body = req.body;
      await newHouseImagesService(images, body);
      res.status(200).json({ message: 'House images added' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  export const deleteHouse = async (req, res) => {
    try {
      const { id } = req.params;
      await deleteHouseService(id);
      res.status(200).json({ message: 'deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  