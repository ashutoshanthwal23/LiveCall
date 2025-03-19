import { useRef, useState } from "react";
import { useWebRTC } from "../hooks/useWebRTC";

const ChatBox = ({ setMessagePanel, user }) => {

  const { sendMessageToPeers, messages, userMapRef } = useWebRTC();
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    if (!message) {
      return;
    }
    sendMessageToPeers(user.id, message);
    setMessage("");
  };

  return (
    <div>
      <div className="w-full flex items-center justify-between bg-[#d1d5dc] p-2 sticky top-0 left-0">
        <p className="font-bold text-sm">Chat to others</p>
        <button
          className="font-bold text-xl mr-2 cursor-pointer"
          onClick={() => setMessagePanel(false)}
        >
          X
        </button>
      </div>

      <div className="py-10 h-[90vh] overflow-y-scroll">

        {
        messages.map((elem, idx) => {
          return (
            <div
              key={idx + 1}
              className="bg-[#e5e7eb] my-5 px-2 py-3 w-[90%] mx-auto rounded-sm"
            >
              <div className="bg-[#6a7282] text-white text-xs px-3 py-2 w-fit rounded-full">
                {userMapRef.current.get(elem.clientId).name}
              </div>
              <p className="px-2">{elem.message}</p>
            </div>
          );
        })
        }

        {/* <div className="bg-gray-200 px-2 py-3 w-[90%] mx-auto rounded-sm">
          <div className="bg-gray-500 text-white text-xs px-3 py-2 w-fit rounded-full">
            ashutosh
          </div>
          <p className="px-2">
            hello Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Dolores animi reiciendis voluptatibus molestiae quis suscipit
            aperiam doloremque adipisci tempore, architecto nihil deserunt
            quisquam laborum. Omnis ad aliquam voluptatem beatae obcaecati?
          </p>
        </div>

        <div className="bg-gray-200 px-2 py-3 w-[90%] mx-auto rounded-sm">
          <div className="bg-gray-500 text-white text-xs px-3 py-2 w-fit rounded-full">
            ashutosh
          </div>
          <p className="px-2">
            hello Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Dolores animi reiciendis voluptatibus molestiae quis suscipit
            aperiam doloremque adipisci tempore, architecto nihil deserunt
            quisquam laborum. Omnis ad aliquam voluptatem beatae obcaecati?
          </p>
        </div>

        <div className="bg-gray-200 px-2 py-3 w-[90%] mx-auto rounded-sm">
          <div className="bg-gray-500 text-white text-xs px-3 py-2 w-fit rounded-full">
            ashutosh
          </div>
          <p className="px-2"> hi kese ho bhailogo</p>
        </div>

        <div className="bg-gray-200 px-2 py-3 w-[90%] mx-auto rounded-sm">
          <div className="bg-gray-500 text-white text-xs px-3 py-2 w-fit rounded-full">
            ashutosh
          </div>
          <p className="px-2"> hi kese ho bhailogo</p>
        </div> */}
      </div>

      <div className=" rounded-sm bg-[#d1d5dc] absolute bottom-0 w-full left-0  flex items-center justify-between">
        <textarea
          className="w-[90%] p-1 resize-none outline-none border-none"
          placeholder="Send message..."
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
        
        <button className="cursor-pointer mr-1" onClick={sendMessage}>
          <img src="/icons/send.svg" className="w-5" />
        </button>
      </div>

    </div>
  );
};

export default ChatBox;
