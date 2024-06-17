import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import {
  getHouses,
  getHouseById,
  createHouse,
  updateHouse,
  deleteHouse,
  updateHouseImages,
  newHouseImages,
} from '../controllers/houseController.js';

const router = Router();

// Configuración de Multer
const storage = multer.diskStorage({
  destination: '../uploads',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

const upload = multer({ storage });

// Rutas
router.get('/houses', getHouses);
router.get('/house/:id', getHouseById);
router.get('/gama/:name', getHouses);
router.get('/zone/:name', getHouses);
router.post('/new-house', createHouse);
router.post('/new-house-images', upload.fields([
  { name: 'input-background', maxCount: 1 },
  { name: 'input-photos', maxCount: 25 }
]), newHouseImages);
router.patch('/house/:id', updateHouse);
router.patch('/house-images/:id', upload.fields([
  { name: 'input-background', maxCount: 1 },
  { name: 'input-photos', maxCount: 25 }
]), updateHouseImages);
router.delete('/house/:id', deleteHouse);

export default router;
