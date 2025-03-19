import { Server } from "socket.io";
import config from "../config/config.js";
import { ACTIONS } from "./actions.js";

export const connectToSocketIO = (server) => {
    const io = new Server(server, {
        cors: {
            origin: config.frontendUrl,
            credentials: true
        },
    });

    const socketUserMapping = new Map();

    io.on('connection', (socket) => {
        console.log('socket is connected', socket.id);

        const handleJoinRoom = ({ roomId, user }) => {
            socketUserMapping.set(socket.id, user);
            const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);

            clients.forEach(clientId => {
                io.to(clientId).emit(ACTIONS.ADD_PEER, {
                    peerId: socket.id,
                    user, 
                    createOffer: false
                })

                socket.emit(ACTIONS.ADD_PEER, {
                    peerId: clientId,
                    user: socketUserMapping.get(clientId),
                    createOffer: true
                })
            });

            socket.join(roomId);
        }

        const handleToggleMic = ({ roomId, userId, isMute }) => {
            const existingClient = socketUserMapping.get(socket.id);
            existingClient.isMicDisabled = isMute;

            const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
            clients.forEach(clientId => {
                io.to(clientId).emit(ACTIONS.TOGGLE_MIC, {
                    userId,
                    isMute
                });
            })
        }

        const handleToggleVideo = ({ roomId, userId, isPaused }) => {
            const existingClient = socketUserMapping.get(socket.id);
            existingClient.isVideoDisabled = isPaused;
            
            const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
            clients.forEach(clientId => {
                io.to(clientId).emit(ACTIONS.TOGGLE_VIDEO, {
                    userId,
                    isPaused
                })
            })
        }

        const leaveRoomHandler = ({roomId}) => {
            const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
            clients.forEach(clientId => {
                io.to(clientId).emit(ACTIONS.REMOVE_PEER, {
                    peerId: socket.id,
                    userId: socketUserMapping.get(socket.id).id
                })
            })

            socketUserMapping.delete(socket.id);
            socket.leave(roomId)
        }

        const relaySdpOffer = ({ peerId, sdp }) => {
            io.to(peerId).emit(ACTIONS.RELAY_SDP_OFFER, {
                peerId: socket.id,
                sdp
            })
        }

        const relayIceCandidate = ({ peerId, iceCandidate }) => {
            io.to(peerId).emit(ACTIONS.RELAY_ICE_CANDIDATE, {
                peerId: socket.id,
                iceCandidate
            })
        }

        const relaySdpAnswer = ({ peerId, answer }) => {
            io.to(peerId).emit(ACTIONS.RELAY_SDP_ANSWER, {
                peerId: socket.id,
                answer
            })
        }

        const sendMsgHandler = ({clientId, message}) => {
            io.emit(ACTIONS.RECEIVE_MSG, {
                clientId, message
            })
        }

        socket.on(ACTIONS.JOIN, handleJoinRoom);
        socket.on(ACTIONS.TOGGLE_MIC, handleToggleMic);
        socket.on(ACTIONS.TOGGLE_VIDEO, handleToggleVideo);
        socket.on(ACTIONS.RELAY_SDP_OFFER, relaySdpOffer)
        socket.on(ACTIONS.RELAY_ICE_CANDIDATE, relayIceCandidate)
        socket.on(ACTIONS.RELAY_SDP_ANSWER, relaySdpAnswer);
        socket.on(ACTIONS.LEAVE_ROOM, leaveRoomHandler)
        socket.on(ACTIONS.SEND_MSG, sendMsgHandler)

        socket.on('disconnect', () => {
            console.log("socket disconnected");
            socketUserMapping.delete(socket.id);
        })
    })

    return io;
}