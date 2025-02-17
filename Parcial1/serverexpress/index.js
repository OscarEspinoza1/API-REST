const express = require('express');
const path = require('node:path');
const xmlparser = require('express-xml-bodyparser');
const multer = require('multer'); 
const fs = require('node:fs'); 

const app = require("./init");
const port = 3000;

// Middleware de registro de solicitudes
app.use((req, res, next) => {
    console.log("Petición al servidor");
    next();
});

// Habilitar XML parser
app.use(xmlparser());

// Habilitar JSON parser
app.use(express.json());

// Rutas
app.post('/prefecto', (req, res) => {
    console.log(req.body);
    res.send('Got a POST request');
});

app.post('/', (req, res) => {
    console.log(req.body);
    res.send('Got a POST request');
});

// Configuración de subida de archivos
const uploadDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

app.post('/prefectoss', upload.single('archivo'), (req, res) => {
    const { nombre } = req.body;
    const archivo = req.file;

    if (!archivo) {
        return res.status(400).json({ mensaje: 'No se ha subido ningún archivo' });
    }

    console.log('Datos recibidos:', { nombre });
    console.log('Archivo recibido:', archivo);

    res.json({
        mensaje: 'Archivo recibido',
        datos: { nombre },
        archivo: {
            filename: archivo.filename,
            size: archivo.size,
            mimetype: archivo.mimetype
        }
    });
});

// Ruta para servir el archivo HTML
app.get('/', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Servidor escuchando
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});


