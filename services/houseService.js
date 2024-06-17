import { pool } from '../config/database.js';

export const getHousesService = async (name, id) => {
  let query = 'SELECT * FROM houses';
  let params = [];

  if (name) {
    query += ' WHERE gama = ? OR zone = ?';
    params.push(name, name);
  } else if (id) {
    query += ' WHERE id = ?';
    params.push(id);
  }

  const [rows] = await pool.query(query, params);
  return rows;
};

export const getHouseByIdService = async (id) => {
  const [rows] = await pool.query('SELECT * FROM houses WHERE id = ?', [id]);
  return rows[0];
};

export const createHouseService = async (houseData) => {
  const [result] = await pool.query(
    'INSERT INTO houses (name, gama, sold, price, videoURL, description, type, zone) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [
      houseData.name,
      houseData.gama,
      houseData.sold,
      houseData.price,
      houseData.video,
      houseData.description,
      houseData.type,
      houseData.zone,
    ]
  );
  return result;
};

export const updateHouseService = async (id, houseData) => {
  await pool.query(
    'UPDATE houses SET name = ?, gama = ?, sold = ?, price = ?, videoURL = ?, description = ?, type = ?, zone = ? WHERE id = ?',
    [
      houseData.name,
      houseData.gama,
      houseData.sold,
      houseData.price,
      houseData.video,
      houseData.description,
      houseData.type,
      houseData.zone,
      id,
    ]
  );
};

export const deleteHouseService = async (id) => {
  await pool.query('DELETE FROM houses WHERE id = ?', [id]);
};

export const updateHouseImagesService = async (id, images) => {
  let bg = null;
  let pics = null;

  if (images['input-background']) {
    bg = images['input-background'][0].path.replace(/\\/g, '/');
  }

  if (images['input-photos']) {
    pics = images['input-photos']
      .map((file) => file.path.replace(/\\/g, '/'))
      .join(',');
  }

  const query = `
    UPDATE houses
    SET ${bg ? 'background = ?' : ''} ${pics ? ', photos = ?' : ''}
    WHERE id = ?
  `;
  const params = [bg, pics, id].filter((param) => param !== null);

  await pool.query(query, params);
};

export const newHouseImagesService = async (images, body) => {
  const id = body.id;

  let bg = null;
  let pics = null;

  if (!id) throw new Error('ID no presente en la solicitud');

  if (images['input-background']) {
    bg = images['input-background'][0].path.replace(/\\/g, '/');
  }

  if (images['input-photos']) {
    pics = images['input-photos']
      .map((file) => file.path.replace(/\\/g, '/'))
      .join(',');
  }

  const query = `
    UPDATE houses
    SET ${bg ? 'background = ?' : ''} ${pics ? ', photos = ?' : ''}
    WHERE id = ?
  `;
  const params = [bg, pics, id].filter((param) => param !== null);

  await pool.query(query, params);
};
