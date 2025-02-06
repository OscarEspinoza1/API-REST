import express from 'express'
import cors from 'cors';
import { config } from 'dotenv';
import path from 'node:path'
import process from "node:process";

config({ path: "./config/.env" });

const app = express();

app.use(cors({
    origin: "http://localhost",
    methods: ["GET", "POST"]
}));

app.get('/inicio', (_req, res) => {
    res.sendFile(path.resolve('./public/index.html'));
});

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Servidor corriendo en el puerto ${ process.env.SERVER_PORT }`);
})