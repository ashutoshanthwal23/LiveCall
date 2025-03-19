import { useState } from "react";
import {useWebRTC} from "./hooks/useWebRTC";
import { useNavigate } from "react-router";

const CallControls = ({displayEmoji, user, handleMenuToggle}) => {
  const [isEmojiGrpOpen, setIsEmojiGrpOpen] = useState(false);
  const { isMicrophoneMute, setIsMicrophoneMute, isVideoDisabled,muteUnmuteAudio,pauseResumeVideo, setIsVideoDisabled,setScreenShare } = useWebRTC();
  const navigate = useNavigate();

  const emojiArray = [
    {
        label: 'raised-hand',
        url: "/icons/raised-hand.svg"
    },
    {
        label: 'party-popper',
        url: "/icons/party-popper.svg"
    },
    {
        label: 'red-heart',
        url: "/icons/red-heart.svg"
    },
    {
        label: 'thumbs-up',
        url: "/icons/thumbs-up.svg"
    }
  ]


  const handleDisplayEmoji = (name) => {
    displayEmoji(name);
    setTimeout(() => {
        displayEmoji(null)
    }, 1000)
  }

  return (
    <div className="flex justify-center items-center gap-2 relative flex-wrap">
      {/* <div 
      className={`bg-white cursor-pointer w-10 h-10 border-2 border-red-700 flex items-center justify-center rounded-full 
      relative ${isRecording && 'recordVideo-animate'}`}
      >
        <button 
        className="w-[80%] h-[80%] rounded-full bg-red-700 cursor-pointer"
        onClick={() => setIsRecording(prev => !prev)}
        ></button>
      </div> */}

      {/* <div className="bg-[#364153] w-10 h-10 flex items-center justify-center rounded-full">
        <button 
          className="w-full h-full cursor-pointer flex justify-center items-center"
          onClick={() => setIsEmojiGrpOpen((prev) => !prev)}
        >
          <img src="/icons/emoji-add.svg" className="w-6" />
        </button>

        {
        isEmojiGrpOpen && (
          <div className="bg-[#101828] px-2 py-2 rounded-full absolute left-1/2 -translate-x-1/2 -top-18 flex gap-2">
             <button className="bg-[#1e2939] p-2 rounded-full cursor-pointer" onClick={() => handleDisplayEmoji('dislike')}>
              <img src="/icons/dislike.svg" className="w-6 h-6" />
            </button>
            {
                emojiArray.map(elem => (
                    <button 
                    key={elem.label} 
                    className="bg-[#1e2939] p-2 w-10 h-10 rounded-full cursor-pointer"
                    onClick={() => handleDisplayEmoji(elem.label)}
                    >
                    <img src={elem.url} className="w-5 h-5" />
                  </button>
                ))
            }
           
          </div>
        )}
      </div> */}

      <button 
      className="bg-[#364153] cursor-pointer w-10 h-10 flex items-center justify-center rounded-full relative"
      onClick={() => setScreenShare(true)}
      >
        <img src="/icons/screen-share.svg" className="w-6" />
      </button>

      <div className="bg-[#364153] cursor-pointer w-10 h-10 flex items-center justify-center rounded-full relative">
        <img src={isMicrophoneMute ? "/icons/mute-microphone.png" : "/icons/microphone.svg"} className="w-5 h-5" onClick={() => muteUnmuteAudio(!isMicrophoneMute, user.id)} />
      </div>

      <div className="bg-[#364153] w-10 h-10 flex items-center cursor-pointer justify-center rounded-full ">
        <img src={isVideoDisabled ? "/icons/stop-video2.png" : "/icons/Video.svg"} className="w-5 h-5" onClick={() => pauseResumeVideo(!isVideoDisabled, user.id)} />
       
      </div>

      <button 
      className="w-10 h-10 bg-white border-none outline-none rounded-full cursor-pointer"
      onClick={() => navigate('/')}
      >
        <img src="/icons/end-call.svg" />
      </button>

      <button className="w-10 h-10 flex items-center justify-center bg-[#364153] rounded-full cursor-pointer" onClick={() => handleMenuToggle(1)}>
        <img src="/icons/participants.png" className="w-5" />
      </button>

      <button 
      className="w-10 h-10 flex items-center justify-center bg-[#364153] rounded-full cursor-pointer"
      onClick={() => handleMenuToggle(2)}
      >
        <img src="/icons/message.svg" className="w-6" />
      </button>

    </div>
  );
};

export default CallControls;
