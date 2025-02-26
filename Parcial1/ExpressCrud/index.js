const express = require('express');
const path = require('node:path');
const xmlparser = require('express-xml-bodyparser');
const multer = require('multer'); 
const fs = require('node:fs'); 
const mysql2 = require('mysql2');
const app = require("./init");
//const port = 3000;


const http = require("http");
require("dotenv").config();

let port = process.env.PORT;

const connection = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    port:'3309',
    database: 'usuariosCRUD'
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
app.get('/usuariosCRUD', (req, res) => {
    console.log(req.query.id_usuarios);

    let consulta = '';
    let valores = [];

    if (typeof req.query.id_usuarios === 'undefined') {
        consulta = `SELECT * FROM usuarios`;
    } else {
        consulta = `SELECT * FROM usuarios WHERE id_usuarios = ?`;
        valores = [req.query.id_usuarios];
    }

    console.log(consulta);

    connection.query(consulta, valores, (err, results, fields) => {
        if (err) {
            console.error('Error en la consulta:', err);
            return res.status(500).json({ error: 'Error en la base de datos' });
        }

        if (!results || results.length === 0) {
            return res.json({ mensaje: "Este usuario no está registrado" });
        }

        res.json(results);
    });
});


//el metodo de modificacion PUT
app.put('/usuariosCRUD', (req, res) => {
    console.log(req.query);
    let sentenciaSQL = '';
    if (typeof (req.query.id_usuarios) == 'undefined' || typeof (req.query.nombre) == 'undefined' || typeof (req.query.ocupacion) == 'undefined') {
        res.json({
            status: 0,
            mensaje: "Completa todos los campos por favor",
            datos: {}
        });
    }
    else {
        sentenciaSQL = `UPDATE usuarios SET nombre = '${req.query.nombre}',  ocupacion = '${req.query.ocupacion}' WHERE id_usuarios = ${req.query.id_usuarios}`;
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

//el metodo delete de la base de datos
app.delete('/usuariosCRUD', (req, res) => {
    console.log(req.query.id_usuarios);
    let sentenciaSQL = ''
    if (typeof (req.query.id_usuarios) == 'undefined') {
        res.json({
            status: 0,
            mensaje: "Ingresa el ID de el usuario que deseas borrar",
            datos: {}
        });
    }
    else {
        sentenciaSQL = `DELETE FROM usuarios WHERE id_usuarios = ${req.query.id_usuarios}`;
    }
    console.log(sentenciaSQL);
    connection.query(
        sentenciaSQL,
        function (err, results, fields) {
            console.log(results);
            if (results.affectedRows == 1) {
                res.json({
                    status: 1,
                    mensaje: "Usuario eliminado",
                    datos: {}
                });
            }
            else {
                res.json({
                    status: 0,
                    mensaje: "Este Usuario no esta registrado, intente con otro ID por favor",
                    datos: {}
                });
            }
        }
    )
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


