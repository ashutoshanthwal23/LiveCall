import { useWebRTC } from "./hooks/useWebRTC"

const MeetingParticipants = ({ setParticipantsModal}) => {
    
    const {participants} = useWebRTC();

    return (
    <div>
        <div className="flex items-center justify-between mb-4">
            <span>{`Participants (${participants.length})`}</span>
            <button className="cursor-pointer mr-3 font-bold border px-2" onClick={() => setParticipantsModal(false)}>X</button>
        </div>

        <div className="w-full rounded-full bg-black px-2 flex justify-between items-center">
            <input className="w-[90%]  py-2 outline-none" placeholder="Search" />
            <button className="cursor-pointer"><img src="/icons/search-icon.png" className="w-5" /></button>
        </div>

        <div className=" mt-7 h-[80%] scrollbar-hide overflow-y-scroll">
            {
                participants.map(element => {
                    return (
                        <div 
                        key={element.id}
                        className="my-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <img src="/images/avatar.png" className="w-10" />
                                <span>{element.name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                {
                                element.isMicDisabled ? 
                                <img src="/icons/mute-microphone.png" className="w-4" /> 
                                : 
                                <img src="/icons/microphone.svg" className="w-4" />
                                }

                                {
                                    element.isVideoDisabled ?
                                    <img src="/icons/stop-video2.png" className="w-4" />
                                    :
                                    <img src="/icons/Video.svg" className="w-4" />
                                }
                            </div>
                        </div>
                    )
                })
            }

        </div>
    </div>
  )
}

export default MeetingParticipants