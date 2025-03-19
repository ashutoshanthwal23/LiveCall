
const MeetingModal = ({isOpen, onClose, title, buttonText, handleClick}) => {
  return (
    <div className="backdrop-blur-md w-full h-screen flex justify-center items-center fixed inset-0 z-[101]">
        <div className="w-11/12 sm:w-9/12 md:w-6/12 xl:w-4/12 bg-[#101828] rounded-lg px-3 sm:px-5 pb-8 pt-3 flex flex-col">
            <button className="text-white font-semibold text-xl self-end cursor-pointer" onClick={onClose}>X</button>
            <div className="space-y-3 text-center">
                <h3 className="text-xl sm:text-2xl font-bold text-white">{title}</h3>
                <button 
                className="w-full cursor-pointer pointer-events-auto bg-[#155dfc] text-white font-semibold rounded-sm py-2 hover:bg-[#1e2939]"
                onClick={handleClick}
                >{buttonText}</button>
            </div>
        </div>
    </div>
  )
}

export default MeetingModal