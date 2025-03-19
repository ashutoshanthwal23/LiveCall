import { io } from "socket.io-client";
import config from "../config";

export const socketInit = () => {
    return io(config.backendUrl, {
        withCredentials: true,
        transports: ["websocket"]
    });
}

