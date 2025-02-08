const express = require('express');
const app = express();
const port = 3000;

app.use('/',(req, res, next) => {
    console.log("peticion al server");
    next();
},(req, res, next) => {
    console.log("2da peticion al middleware");
    next();
    });

app.get('/Alumnos', (req, res) => {
    console.log(req.query);
    res.sendFile( __dirname + '/public/index.html');
    });

app.post('/sistemas/:control', (req, res) => {
    console.log(req.params);
    res.send('Got a POST request');
});


app.patch('/maestros', (req, res) => {
    console.log(req.body);
    res.send('Got a PATCH request');
});

//Middleware incorporado en express
app.use(express.json());

app.post('/', (req, res) => {
    console.log(req.body);
    res.send('Got a POST request');
    }
);

app.use((req,res,) => {
    res.status(404);
    res.send('Error 404');
    });

app.get('/', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.sendFile( __dirname + '/public/index.html');
    });

app.post('/', (req, res) => {
    res.send('Got a POST request');
    });

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    });
