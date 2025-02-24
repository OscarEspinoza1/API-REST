//const express = require("express");
//const app= express();

//app.use(express.json);
//app.use(express.static);

//module.exports = app;

const express = require('express');
const app = express();
app.use(express.json()); // Para manejar JSON
module.exports = app;
