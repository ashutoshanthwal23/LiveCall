import {  useEffect, useRef, useState } from "react";
import CallControls from "./CallControls";
import { useWebRTC } from "./hooks/useWebRTC";
import MeetingParticipants from "./MeetingParticipants";
import ChatBox from "./chat/ChatBox";
import { useLocation } from "react-router";


const MeetingCall = () => {
    const [emojiIcon, setEmojiIcon] = useState(null);

    const [participantsModal, setParticipantsModal] = useState(false);
    const [messagePanel, setMessagePanel] = useState(false);
    const [user, setUser] = useState(null);
    const isfirstRender = useRef(false);
    const [fullScreenId, setFullScreenId] = useState(null);
    const location = useLocation();

    const generateUser = () => {
      const str = 'ABCDEFGHIJKLmnopqrstuwxjz1234567890';
      const names = ['a', 'b', 'c', 'd'];
      let id = '';
      for(let i = 0; i < 5; i++){
        id += str.charAt(Math.floor((Math.random() * str.length)));
      }
      const name = names[Math.floor(Math.random() * names.length)]
      return { name, id, role: 1 }
    }

    const { startMedia, provideVideoRef, participants } = useWebRTC();
    const [optionsModal, setOptionsModal] = useState({}); 
    // const handleMuteAudio = () => {}
    // const handleMuteVideo = () => {}
    // const handleRemoveClient = () => {}

    const handleEnterFullscreen = (clientId) => {
      if(fullScreenId) setFullScreenId(null)
      else setFullScreenId(clientId)
      
    }

    const menuOptions = {
      1: [
        // {
        //   option: 'Mute audio',
        //   onClick: handleMuteAudio
        // },
        // {
        //   option: 'Mute video',
        //   onClick: handleMuteVideo
        // },
        // {
        //   option: 'Remove',
        //   onClick: handleRemoveClient
        // },
        {
          option: fullScreenId ? 'Exit fullscreen' : 'Enter fullscreen',
          onClick: handleEnterFullscreen
        }
      ],
      2: [
        {
          option: fullScreenId ? 'Exit fullscreen' : 'Enter fullscreen',
          onClick: handleEnterFullscreen
        }
      ]
    }

    const displayEmoji = (name) => {
        setEmojiIcon(name)
    }


    useEffect(() => {
      if(!isfirstRender.current){
        const client = generateUser();
        setUser({...client, name: location.state.name})
        startMedia(true, {...client, name: location.state.name})
        isfirstRender.current = true;
      }
      }, []) 

      
      useEffect(() => {
        const roleOptionToggle = {}
        participants.forEach(client => {
          roleOptionToggle[client.id] = false;
        })
       setOptionsModal(roleOptionToggle);
      }, [participants])

      const handleMenuToggle = (value) => {
        switch(value){
          case 1:
            setMessagePanel(false);
            setParticipantsModal(prev => !prev);
            break;

          case 2:
            setParticipantsModal(false);
            setMessagePanel(prev => !prev);
            break;
          
          default:
            break;
        }
      }

      return (
        <div className="bg-[#1e2939] h-screen w-full relative flex justify-between overflow-x-hidden ">
          <div 
          className={`flex justify-center items-center flex-wrap gap-3 py-3 h-[90vh] overflow-y-scroll w-full 
            ${participantsModal && 'sm:w-[calc(100%-300px)]'} duration-300 ${messagePanel && 'sm:w-[calc(100%-350px)]'}` }
          >

                {
                  participants.map(client => {
                    return (
                      <div 
                      key={client?.id}
                      className={`${fullScreenId === client.id ? 'w-[80vw] h-[80vh]' : 'w-[300px] sm:w-[400px] h-[300px]'} bg-white relative 
                      rounded-xl border-2 border-[#193cb8] overflow-hidden`}
                      >

                        <video 
                        ref={(instance) => provideVideoRef(instance, client.id)} 
                        autoPlay 
                        className="w-full h-full object-cover" />

                          {
                            client.isVideoDisabled && (
                              <div className=" absolute inset-0 bg-white w-full h-full">
                                <img src="/images/avatar.png" className="w-full h-full" /> 
                              </div>
                            )
                          }

                          <div className="w-10 h-10 absolute left-3 top-3 bg-[#1e2939] rounded-full flex items-center justify-center">
                            <button 
                            className="cursor-pointer w-full h-full flex items-center justify-center" 
                            onClick={() => setOptionsModal(prev => ({...prev, [client.id]: !prev[client.id]}))}>
                            <img src="/icons/three-dots.svg" className="rotate-90" />
                            </button>

                          {
                            optionsModal[client.id] && (
                                <div className="absolute z-1 top-12 left-0 w-[180px] rounded-3xl bg-black px-3 py-5">
                                  <ul className="flex flex-col gap-3 w-full text-white text-xs font-semibold">
                                    
                                    {
                                      menuOptions[client.role].map(elem => (
                                        <li
                                        key={elem.option}
                                        ><button 
                                        className="bg-[#1e2939]  rounded-full w-full py-2 px-4  cursor-pointer text-left"
                                        onClick={() => elem.onClick(client.id)}
                                        >{elem.option}</button></li>

                                      ))
                                    }
                                  </ul>
                              </div>
                            )
                          }

                          </div>

                          <div className="bg-black absolute left-0 bottom-0 rounded-tr-lg px-4 py-1 flex items-center gap-2">
                            <p className="text-white">{client.name}</p>
                            {
                              client.isMicDisabled ? <img src="/icons/mute-microphone.png" className="w-4" /> : <img src="/gifs/audio.gif" className="w-5" />
                            }
                            {
                              client.isVideoDisabled && <img src="/icons/stop-video2.png" className="w-5" />
                            }
                          </div>

                          {
                              emojiIcon && (
                                  <div className="absolute right-2 top-2 w-10 h-10">
                                      <img src={`/icons/${emojiIcon}.svg`} className="w-full h-full" />
                                  </div>
                              )
                          }
                        </div>
                    )
                  })
                }

              
          </div>

          <div className="fixed bottom-3 left-0 right-0">
            <CallControls 
            displayEmoji={displayEmoji} 
            user={user}  
            handleMenuToggle={handleMenuToggle}
            />
          </div>

          <div className={`fixed sm:relative right-0 top-0 h-screen text-white space-y-4 bg-[#364153] 
            ${participantsModal ? 'w-[250px] sm:w-[300px] px-2 py-5 ' : 'w-0'} duration-300`}>
            <MeetingParticipants setParticipantsModal={setParticipantsModal}  />
          </div>

        {
            <div className={`fixed sm:relative right-0 top-0 h-screen bg-[#f3f4f6] 
            ${messagePanel ? 'w-[300px] sm:w-[350px]' : 'w-0'} duration-300`}>
            <ChatBox setMessagePanel={setMessagePanel} user={user} />
          </div>
        }

        </div>
  );
};

export default MeetingCall;



