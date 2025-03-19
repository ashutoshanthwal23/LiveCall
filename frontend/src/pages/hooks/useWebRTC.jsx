import { createContext, useContext, useEffect, useRef, useState } from "react";
import { socketInit } from "../../socket/socket.js";
import { ACTIONS } from "../../socket/actions.js";
import { useStateWithCallback } from "./useStateWithCallback.js";
import freeice from 'freeice'

const WebRTCContext = createContext();

export const WebRTCProvider = ({children}) => {
    const roomId = 55;
    const [meetingSetup, setMeetingSetup] = useState(false);
    const userRef = useRef(null);
    const localMediaStream = useRef(null);
    const localScreenStream = useRef(null);
    const videoRef = useRef(null);
    const [isMicrophoneMute, setIsMicrophoneMute] = useState(false);
    const [isVideoDisabled, setIsVideoDisabled] = useState(false);
    const videoElements = useRef({});
    const [participants, setParticipants] = useStateWithCallback([]);
    const socket = useRef();
    const [socketInstance, setSocketInstance] = useState(false);
    const peerConnections = useRef({});
    const [messages, setMessages] = useState([]);
    const userMapRef = useRef(new Map());
    const [screenshare, setScreenShare] = useState(false);



    const startScreenShare = async () => {
      try {
        let screenStream;
    
        if (navigator.mediaDevices.getDisplayMedia) {
          screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        } else if (navigator.mediaDevices.getUserMedia) {
          screenStream = await navigator.mediaDevices.getUserMedia({
            video: {
              mediaSource: 'screen', // Crucial for Android compatibility
            },
          });
        } else {
          throw new Error("Screen sharing is not supported in this browser.");
        }
    
        localScreenStream.current = screenStream;
        videoElements.current[userRef.current.id].srcObject = screenStream;
    
        Object.values(peerConnections.current).forEach(peerConnection => {
          const videoSender = peerConnection.getSenders().find(s => s.track.kind === "video");
          if (videoSender) {
            videoSender.replaceTrack(screenStream.getVideoTracks()[0]);
          }
        });
    
        screenStream.getVideoTracks()[0].onended = restoreWebcam;
    
      } catch (err) {
        console.log("Screen share failed", err);
        setScreenShare(false);
        localScreenStream.current = null;
      }
    };
    
    const restoreWebcam = () => {
      if (localMediaStream.current) {
        videoElements.current[userRef.current.id].srcObject = localMediaStream.current;
  
        Object.values(peerConnections.current).forEach(peerConnection => {
          const videoSender = peerConnection.getSenders().find(s => s.track.kind === "video");
          if (videoSender) {
            videoSender.replaceTrack(localMediaStream.current.getVideoTracks()[0]);
          }
        });
      }

      localScreenStream.current = null
      setScreenShare(false);
    };

    useEffect(() => {
        if(screenshare){
          startScreenShare()
        }
    }, [screenshare])

    const muteUnmuteAudio = (isMute, userId) => {
      if(localMediaStream.current){
        localMediaStream.current.getAudioTracks().forEach(track => {
          track.enabled = !isMute;
        })
      }
      setIsMicrophoneMute(isMute)
      if(userId){
        socket.current.emit(ACTIONS.TOGGLE_MIC, {
          roomId,
          userId,
          isMute
        })
      } 
    }

    const pauseResumeVideo = (isPaused, userId) => {
      if(localMediaStream.current){
        localMediaStream.current.getVideoTracks().forEach(track => {
          track.enabled = !isPaused
        })
      }
      setIsVideoDisabled(isPaused)
  
      if(userId){
        socket.current.emit(ACTIONS.TOGGLE_VIDEO, {
          roomId,
          userId,
          isPaused
        })
      }
    }

    const startMedia = async (setup = false, user={}) => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (stream) {
          localMediaStream.current = stream;
        }
        if (videoRef.current) {
          videoRef.current.srcObject = localMediaStream.current;
          videoRef.current.muted = true;
        } else {
          setTimeout(() => {
            if (videoRef.current) {
              videoRef.current.srcObject = localMediaStream.current;
              videoRef.current.muted = true;
            }
          }, 500);
        }

        if(setup){
          userRef.current = user;
          setMeetingSetup(true)
        }

      } catch (error) {
        console.log(error);
      }
    };
   
    useEffect(() => {
      if(meetingSetup){
        init(userRef.current);
        setMeetingSetup(false);
      }
    }, [meetingSetup])

    const stopMedia = () => {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
  
      if (localMediaStream.current) {
        localMediaStream.current.getTracks().forEach((track) => {
          track.stop();
          track.onended = null;
        });
  
        localMediaStream.current = null;
      }
  
      if (!videoRef.current) {
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.srcObject = null;
           
          }
        }, 500);
      }
    };
  
    const addNewParticipant = (user, cb) => {
      if(!userMapRef.current.has(user.id)){
        userMapRef.current.set(user.id, { name: user.name })
      }

      setParticipants(prev => {
        const isFound = prev.some(elem => elem.id === user.id);
        if(!isFound){
          return [...prev, user]
        }
        else{
          return prev
        }
      }, cb)
    }


const init = (user) => {
  socket.current = socketInit();
  setSocketInstance(true);
  addNewParticipant({...user, isMicDisabled: isMicrophoneMute || false, isVideoDisabled: isVideoDisabled || false}, () => {
    setTimeout(() => {
      const localVideoElement = videoElements.current[user.id];
      if(localVideoElement){
        localVideoElement.srcObject = localMediaStream.current;
        localVideoElement.muted = true;
      }
    }, 0)
  });

  socket.current.emit(ACTIONS.JOIN, {
    roomId,
    user: {...user, isMicDisabled: isMicrophoneMute || false, isVideoDisabled: isVideoDisabled || false}
  })

}


const handleMuteUnmuteAudio = (isMute, userId) => {
  if(userId){
    setParticipants(prev => 
      prev.map(elem => elem.id === userId ? { ...elem, isMicDisabled: isMute } : elem)
    )
  } 
}

const handlePauseResumeVideo = (isPaused, userId) => {
  if(userId){
    setParticipants(prev => 
      prev.map(elem => elem.id === userId ? { ...elem, isVideoDisabled: isPaused } : elem)
    )
  }
}

const handleSdpAnswer = async ({ peerId, answer }) => {
  if(!peerId || !answer){
    return
  }
  peerConnections.current[peerId].setRemoteDescription(new RTCSessionDescription(answer)).catch(error => {
    console.error(`failed to set SDP answer for peer ${peerId}:`, error)
  });
}

const handleSdpOffer = async ({ peerId, sdp }) => {
  try{
    const peerConnection = peerConnections.current[peerId];
    if(peerConnection){
      await peerConnection.setRemoteDescription(new RTCSessionDescription(sdp));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      socket.current.emit(ACTIONS.RELAY_SDP_ANSWER, {
        peerId,
        answer
      })
    }
  } catch(error){
    console.error(`Failed to create answer for peer ${peerId}:`, error);
  }
}

const handleIceCandidate = async ({ peerId, iceCandidate }) => {
  const peerConnection = peerConnections.current[peerId];
  if(peerConnection){
    try{
      await peerConnection.addIceCandidate(iceCandidate)
    } catch(error){
      console.error(`Failed to add ICE candidate for ${peerId}:`, error);
    }
  }
}


const handleAddNewPeer = async ({ peerId, user: remoteUser, createOffer }) => {
  if(peerId in peerConnections.current){
    return;
  }

  peerConnections.current[peerId] = new RTCPeerConnection({
    iceServers: freeice()
  })

  // Gather ICE candidates and send them to the remote peer via the signaling server.
  peerConnections.current[peerId].onicecandidate = (event) => {
    if(event.candidate){
      socket.current.emit(ACTIONS.RELAY_ICE_CANDIDATE, {
        peerId,
        iceCandidate: event.candidate
      })
    }
  }

  // Add local track to remote connection

  if(localMediaStream.current){
    localMediaStream.current.getTracks().forEach(track => {
      peerConnections.current[peerId].addTrack(track, localMediaStream.current)
    })
  }

  // Add remote user's media stream to their video element
  peerConnections.current[peerId].ontrack = (event) => {
    addNewParticipant(remoteUser, () => {
      setTimeout(() => {
        const remoteVideoElem = videoElements.current[remoteUser.id];
        if(remoteVideoElem){
          remoteVideoElem.srcObject = event.streams[0]
        }
      }, 0)
    })
  }

  // Create SDP offer and send it to the remote peer
  if(createOffer){
    try{
      const peerConnection = peerConnections.current[peerId];
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      socket.current.emit(ACTIONS.RELAY_SDP_OFFER, {
        peerId,
        sdp: offer
      });

    } catch(error){
      console.error(`Failed to send/create offer for peer ${peerId}:`, error);
    }
  }

  if(localScreenStream.current){
    Object.values(peerConnections.current).forEach(peerConnection => {
      const videoSender = peerConnection.getSenders().find(s => s.track.kind === "video");
      if (videoSender) {
        videoSender.replaceTrack(localScreenStream.current.getVideoTracks()[0]);
      }
    });
  }
}

const handleRemovePeer = ({ peerId, userId }) => {
  console.log(peerId, userId);
  if(peerConnections.current[peerId]){
    peerConnections.current[peerId].close();
    delete peerConnections.current[peerId];
  }

  delete videoElements.current?.[userId];

  userMapRef.current?.delete(userId);

  setParticipants(prev => prev.filter(client => client.id !== userId));
  console.log('removed');
}

function handleSetMessages({clientId, message}){
  setMessages(prev => [...prev, {clientId, name: userMapRef.current.get(clientId).name, message}])
}



useEffect(() => {
  if(!socket.current) return;
  if(!socketInstance) return;

  socket.current.on(ACTIONS.TOGGLE_MIC, ({ userId, isMute }) => handleMuteUnmuteAudio(isMute, userId));
  socket.current.on(ACTIONS.TOGGLE_VIDEO, ({ userId, isPaused }) => handlePauseResumeVideo(isPaused, userId));
  socket.current.on(ACTIONS.RECEIVE_MSG, handleSetMessages);
  socket.current.on(ACTIONS.ADD_PEER, handleAddNewPeer);
  socket.current.on(ACTIONS.RELAY_ICE_CANDIDATE, handleIceCandidate);
  socket.current.on(ACTIONS.RELAY_SDP_OFFER, handleSdpOffer);
  socket.current.on(ACTIONS.RELAY_SDP_ANSWER, handleSdpAnswer);
  socket.current.on(ACTIONS.REMOVE_PEER, handleRemovePeer);

  return () => {
    if(!socket.current) return;
    if(!socketInstance) return

    if (localMediaStream.current) {
      localMediaStream.current.getTracks().forEach((track) => {
        track.stop();
        track.onended = null; 
      });
      localMediaStream.current = null;
    }

    if (localScreenStream.current) {
    localScreenStream.current.getTracks().forEach(track => track.stop());
    localScreenStream.current = null;
    }

    socket.current.emit(ACTIONS.LEAVE_ROOM, {roomId})
    socket.current.off(ACTIONS.ADD_PEER);
    socket.current.off(ACTIONS.RELAY_ICE_CANDIDATE)
    socket.current.off(ACTIONS.RELAY_SDP_OFFER)
    socket.current.off(ACTIONS.RELAY_SDP_ANSWER)
    socket.current.off(ACTIONS.TOGGLE_MIC)
    socket.current.off(ACTIONS.TOGGLE_VIDEO)
    socket.current.off(ACTIONS.RECEIVE_MSG)
    // socket.current.disconnect();
    socket.current = null;
    setSocketInstance(false)

  }

}, [socketInstance])


const provideVideoRef = (instance, userId) => {
  videoElements.current[userId] = instance;
}

const sendMessageToPeers = (clientId, message) => {
  socket.current.emit(ACTIONS.SEND_MSG, {
    clientId,
    message
  })
}

      return (
        <WebRTCContext.Provider
          value={{
            videoRef,
            isMicrophoneMute,
            setIsMicrophoneMute,
            isVideoDisabled,
            setIsVideoDisabled,
            startMedia,
            stopMedia,
            muteUnmuteAudio,
            pauseResumeVideo,
            provideVideoRef,
            participants,
            sendMessageToPeers,
            messages,
            userMapRef,
            setScreenShare,
          }}
        >
          {children}
        </WebRTCContext.Provider>
      );
    
}

export const useWebRTC = () => {
  return useContext(WebRTCContext);
};

