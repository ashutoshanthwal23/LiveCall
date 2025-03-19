import express from 'express'
import cors from 'cors'
import config from './config/config.js';
import http from 'http'
import { connectToSocketIO } from './socket/socket.js';

const app = express();

app.use(cors({
    origin: config.frontendUrl
}));

app.use(express.json());

const server = http.createServer(app);
connectToSocketIO(server);

app.get("/", (req, res) => {
    res.send("hello")
})

server.listen(config.port, () => {
    console.log(`server is listening at port ${config.port}`);
})