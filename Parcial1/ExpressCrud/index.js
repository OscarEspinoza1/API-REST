const express = require('express');
const path = require('node:path');
const xmlparser = require('express-xml-bodyparser');
const multer = require('multer'); 
const fs = require('node:fs'); 
const mysql = require('mysql2');
const app = require("./init");
//const port = 3000;


const http = require("http");
require("dotenv").config();

let port = process.env.PORT;

const connection = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'THICC6722',
    port:'3306',
    database: 'usuarios'
})

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



//el metodo get de la base de datos
app.get('/usuarios', (req, res) => {
    console.log(req.query.id_usuario);
    let consulta = ''
    if (typeof (req.query.id_usuario) == 'undefined') {
        consulta = `select * from usuarios`
    } else {
        consulta = `select * from usuarios where id_usuario=${req.query.id_usuario}`
    }
    console.log(consulta);

    connection.query(
        consulta,
        function (err, results, fields) {
            if (results.length == 0) {
                res.json({ mensaje: "Este usuario no esta registrado" });
            }
            else {
                res.json(results);
            }
        }
    );
});

//el metodo de modificacion PUT
app.put('/usuarios', (req, res) => {
    console.log(req.query);
    let sentenciaSQL = '';
    if (typeof (req.query.id_usuario) == 'undefined' || typeof (req.query.nombre) == 'undefined' || typeof (req.query.ocupacion) == 'undefined') {
        res.json({
            status: 0,
            mensaje: "Completa todos los campos por favor",
            datos: {}
        });
    }
    else {
        sentenciaSQL = `UPDATE usuarios SET nombre = '${req.query.nombre}',  ocupacion = '${req.query.ocupacion}' WHERE id_usuario = ${req.query.id_usuario}`;
        console.log(sentenciaSQL);
        connection.query(
            sentenciaSQL,
            function (err, results, fields) {
                console.log(results);
                if (results && results.affectedRows == 1) {
                    res.json({
                        status: 1,
                        mensaje: "Registro modificado exitosamente",
                        datos: {}
                    });
                } else {
                    res.json({
                        status: 0,
                        mensaje: "Hubo un error al modificar el usuario",
                        datos: {}
                    });
                }
            }
        )
    }
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


