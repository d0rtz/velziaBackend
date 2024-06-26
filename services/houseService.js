import { pool } from '../config/database.js';

export const getHousesService = async (name, id) => {
  console.log('Executing getHousesService...');
  let query = 'SELECT * FROM houses';
  let params = [];

  if (name) {
    console.log(`Name provided: ${name}`);
    query += ' WHERE gama = ? OR zone = ?';
    params.push(name, name);
  } else if (id) {
    console.log(`ID provided: ${id}`);
    query += ' WHERE id = ?';
    params.push(id);
  }

  console.log(`Query: ${query}`);
  console.log(`Params: ${JSON.stringify(params)}`);

  const [rows] = await pool.query(query, params);
  console.log(`Rows fetched: ${JSON.stringify(rows)}`);
  return rows;
};

export const getHouseByIdService = async (id) => {
  console.log('Executing getHouseByIdService...');
  console.log(`Fetching house with ID: ${id}`);
  const [rows] = await pool.query('SELECT * FROM houses WHERE id = ?', [id]);
  console.log(`House fetched: ${JSON.stringify(rows[0])}`);
  return rows[0];
};

export const createHouseService = async (houseData) => {
  console.log('Executing createHouseService...');
  console.log(`House data: ${JSON.stringify(houseData)}`);
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
  console.log(`House created with ID: ${result.insertId}`);
  return result;
};

export const updateHouseService = async (id, houseData) => {
  console.log('Executing updateHouseService...');
  console.log(`Updating house with ID: ${id}`);
  console.log(`House data: ${JSON.stringify(houseData)}`);
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
  console.log('House updated successfully');
};

export const deleteHouseService = async (id) => {
  console.log('Executing deleteHouseService...');
  console.log(`Deleting house with ID: ${id}`);
  await pool.query('DELETE FROM houses WHERE id = ?', [id]);
  console.log('House deleted successfully');
};

export const updateHouseImagesService = async (id, images) => {
  console.log('Executing updateHouseImagesService...');
  console.log(`Updating images for house with ID: ${id}`);
  console.log(`Images: ${JSON.stringify(images)}`);
  let bg = null;
  let pics = null;

  if (images['input-background']) {
    bg = images['input-background'][0].path.replace(/\\/g, '/').replace("/usr/share/nginx/html/velzia", ".");
    console.log(`Background image path: ${bg}`);
  }

  if (images['input-photos']) {
    pics = images['input-photos']
      .map((file) => file.path.replace(/\\/g, '/').replace("/usr/share/nginx/html/velzia", "."))
      .join(',');
    console.log(`Photos paths: ${pics}`);
  }

  const query = `
    UPDATE houses
    SET ${bg ? 'background = ?' : ''} ${bg && pics ? ', photos = ?' : pics ?' photos = ?' : ''}
    WHERE id = ?
  `;
  const params = [bg, pics, id].filter((param) => param !== null);

  console.log(`Query: ${query}`);
  console.log(`Params: ${JSON.stringify(params)}`);

  await pool.query(query, params);
  console.log('House images updated successfully');
};

export const newHouseImagesService = async (images, body) => {
  console.log('Executing newHouseImagesService...');
  console.log(`Request body: ${JSON.stringify(body)}`);
  console.log(`Images: ${JSON.stringify(images)}`);
  const id = body.id;

  let bg = null;
  let pics = null;

  if (!id) throw new Error('ID no presente en la solicitud');

  if (images['input-background']) {
    bg = images['input-background'][0].path.replace(/\\/g, '/').replace("/usr/share/nginx/html/velzia", ".");
    console.log(`Background image path: ${bg}`);
  }

  if (images['input-photos']) {
    pics = images['input-photos']
      .map((file) => file.path.replace(/\\/g, '/').replace("/usr/share/nginx/html/velzia", "."))
      .join(',');
    console.log(`Photos paths: ${pics}`);
  }

  const query = `
    UPDATE houses
    SET ${bg ? 'background = ?' : ''} ${bg && pics ? ', photos = ?' : pics ?' photos = ?' : ''}
    WHERE id = ?
  `;
  const params = [bg, pics, id].filter((param) => param !== null);

  console.log(`Query: ${query}`);
  console.log(`Params: ${JSON.stringify(params)}`);

  await pool.query(query, params);
  console.log('House images added successfully');
};
