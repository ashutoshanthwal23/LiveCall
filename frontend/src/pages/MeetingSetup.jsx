import { useEffect, useRef, useState } from "react";
import { useWebRTC } from "./hooks/useWebRTC";

const MeetingSetup = ({ setIsSetupComplete}) => {
  const isFirstRender = useRef(true);

  const [isMicCamToggleOn, setIsMicCamToggleOn] = useState(false);
  const { videoRef, muteUnmuteAudio, pauseResumeVideo, stopMedia, startMedia} = useWebRTC();

  const handleMicCamToggle = (checked) => {
    setIsMicCamToggleOn(checked); 
  };
  
  useEffect(() => {
    if(isFirstRender.current){
      isFirstRender.current = false;
      return;
    }

    muteUnmuteAudio(isMicCamToggleOn);
    pauseResumeVideo(isMicCamToggleOn);

    if (!isMicCamToggleOn) {
      startMedia();
    } else {
      stopMedia();
    }

  }, [isMicCamToggleOn, startMedia, stopMedia]);


  return (
    <div className="bg-[#101828] h-screen w-full flex flex-col items-center justify-center">
    <h3 className="text-white text-xl font-bold mb-2">Setup</h3>
    <div className="h-[300px] sm:w-[300px] w-full flex items-center justify-center bg-[#1e2939] border-t-5 border-t-blue-600 border-b-5 border-b-blue-600">
      {!isMicCamToggleOn ? (
        <video
          ref={videoRef}
          autoPlay
          className="w-full h-full object-cover"
        ></video>
      ) : (
        <p className="text-white">Video is disabled</p>
      )}
    </div>
    <div className="my-5 flex items-center justify-center gap-2">
      <input type="checkbox" onClick={(e) => handleMicCamToggle(e.target.checked)} className="cursor-pointer" />
      <p className="text-white">Join with mic and camera off</p>
    </div>

    <button 
    className="cursor-pointer bg-[#008236] hover:bg-[#008236e6] px-6 py-2 text-white rounded-sm"
    onClick={() => setIsSetupComplete(true)}
    >
      Join meeting
    </button>
  </div>
  )
}

export default MeetingSetup;