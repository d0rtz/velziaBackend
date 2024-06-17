import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import mysql from "mysql2";

const storage = multer.diskStorage({
  destination: "../uploads/",
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({ storage });

const app = express();

app.use(express.json());
app.use(cors());

// connecting Database
const connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "velzia",
});

// post request
app.post(
  "/new-house-images",
  upload.fields([
    { name: "input-background", maxCount: 1 },
    { name: "input-photos", maxCount: 25 },
  ]),
  async (req, res) => {
    try {
      // Verificar si req.files y req.body están presentes
      if (!req.files || !req.body) {
        console.log("Archivos o datos no presentes");
        return res
          .status(400)
          .json({ message: "Archivos o datos no presentes" });
      }

      // Verificar si el campo id está presente
      const id = req.body.id;
      if (!id) {
        console.log("ID no presente en la solicitud");
        return res
          .status(400)
          .json({ message: "ID no presente en la solicitud" });
      }

      // Verificar si los archivos input-background y input-photos están presentes
      if (!req.files["input-background"] || !req.files["input-photos"]) {
        console.log("Archivos esperados no presentes");
        return res
          .status(400)
          .json({ message: "Archivos esperados no presentes" });
      }

      const bg = req.files["input-background"][0].path.replace(/\\/g, "/");
      const pics = req.files["input-photos"]
        .map((file) => file.path.replace(/\\/g, "/"))
        .join(",");

      console.log(`Actualizando casa con ID: ${id}`);
      console.log(`Background: ${bg}`);
      console.log(`Fotos: ${pics}`);

      await connection
        .promise()
        .query(`UPDATE houses SET background = ?, photos = ? WHERE id = ?`, [
          bg,
          pics,
          id,
        ]);

      res.status(202).json({
        message: "Success",
      });
    } catch (err) {
      console.error("Error en /new-house-images:", err);
      res.status(500).json({
        message: err.message,
      });
    }
  }
);

app.post("/new-house", async (req, res) => {
  try {
    const { name, gama, sold, price, video, description, type, zone } =
      req.body;
    const [{ insertId }] = await connection.promise().query(
      `INSERT INTO houses (name, gama, sold, price, videoURL, description, type, zone) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, gama, sold, price, video, description, type, zone]
    );
    res.status(202).json({
      message: "Success",
      id: insertId,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

app.get("/houses", async (req, res) => {
  try {
    const [data] = await connection.promise().query(`SELECT * FROM houses;`);
    res.status(200).json({
      houses: data,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

app.get("/gama/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const [data] = await connection
      .promise()
      .query(`SELECT * FROM houses WHERE gama = ?`, [name]);
    res.status(200).json({
      gama: data,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

app.get("/zone/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const [data] = await connection
      .promise()
      .query(`SELECT * FROM houses WHERE zone = ?`, [name]);
    res.status(200).json({
      zona: data,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

app.get("/house/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [data] = await connection
      .promise()
      .query(`SELECT * FROM houses WHERE id = ?`, [id]);
    res.status(200).json({
      house: data[0],
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

app.patch(
  "/house-images/:id",
  upload.fields([
    { name: "input-background", maxCount: 1 },
    { name: "input-photos", maxCount: 25 },
  ]),
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!req.files || (!req.files["input-background"] && !req.files["input-photos"])) {
        console.log("Archivos no presentes");
        return res.status(400).json({ message: "Archivos no presentes" });
      }

      // Variables para las rutas de los archivos
      let bg = null;
      let pics = null;

      // Verificar y actualizar la imagen de fondo
      if (
        req.files["input-background"] &&
        req.files["input-background"].length > 0
      ) {
        bg = req.files["input-background"][0].path.replace(/\\/g, "/");
      }

      // Verificar y actualizar las imágenes adicionales
      if (req.files["input-photos"] && req.files["input-photos"].length > 0) {
        pics = req.files["input-photos"]
          .map((file) => file.path.replace(/\\/g, "/"))
          .join(",");
      }

      // Si no hay ni imagen de fondo ni fotos adicionales, devolver un error
      if (!bg && !pics) {
        return res
          .status(400)
          .json({ message: "No se proporcionaron imágenes para actualizar" });
      }

      // Construir la consulta SQL y los valores
      let query = `UPDATE houses SET `;
      let queryParams = [];

      if (bg) {
        query += `background = ?, `;
        queryParams.push(bg);
      }

      if (pics) {
        query += `photos = ?, `;
        queryParams.push(pics);
      }

      // Eliminar la última coma y espacio, y agregar la condición WHERE
      query = query.slice(0, -2) + ` WHERE id = ?`;
      queryParams.push(id);

      console.log(`Actualizando imágenes de la casa con ID: ${id}`);
      console.log(`Consulta SQL: ${query}`);
      console.log(`Parámetros: ${queryParams}`);

      await connection.promise().query(query, queryParams);

      res.status(202).json({
        message: "Success",
      });
    } catch (err) {
      console.error("Error en /house-images/:id:", err);
      res.status(500).json({
        message: err.message,
      });
    }
  }
);

app.patch("/house/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, gama, sold, price, video, description, type, zone } =
      req.body;

    await connection
      .promise()
      .query(
        `UPDATE houses SET name = ?, gama = ?, sold = ?, price = ?, videoURL = ?, description = ?, type = ?, zone = ? WHERE id = ?`,
        [name, gama, sold, price, video, description, type, zone, id]
      );
    res.status(200).json({
      message: "updated",
    });
  } catch (err) {
    console.error("Error en /house/:id:", err);
    res.status(500).json({
      message: err.message,
    });
  }
});

app.delete("/house/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await connection.promise().query(`DELETE FROM houses WHERE id = ?`, [id]);
    res.status(200).json({
      message: "deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

app.listen(4999, () => {
  console.log("Server listening on http://localhost:4999");
});
