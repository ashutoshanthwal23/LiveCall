import { useState } from "react";
import { useNavigate } from "react-router";
import { v4 as uuidv4 } from "uuid";

const Lobby = () => {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  const createNewRoom = () => {
    if(!userName){
      return
    }
    const id = uuidv4();
    navigate(`/meeting/${id}`, {state: {name: userName}})
  }

  const joinRoom = () => {
    if(!userName){
      return
    }
    navigate(`/meeting/${roomId}`, {state: {name: userName}})
  }

  return (
    <div className=" flex flex-col items-center justify-center  bg-[#101828] text-white">
      <div className="w-11/12 sm:w-4/12 flex flex-col items-center">
      
        <h1 className="text-3xl font-bold mb-6 text-center">
          Make or Join a Room
        </h1>

        <input
          type="text"
          required
          placeholder="Enter name"
          onChange={(e) => setUserName(e.target.value)}
          className="w-full p-2 mb-4  rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="w-full p-2 mb-4  rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
        className="w-full p-2 bg-[#155dfc] hover:bg-[#1447e6] rounded-lg font-semibold cursor-pointer"
        onClick={joinRoom}
        >
          Join Room
        </button>
        <span className="my-5">OR</span>

        <button 
        className="w-full p-2 bg-[#155dfc] hover:bg-[#1447e6] rounded-lg font-semibold cursor-pointer"
        onClick={createNewRoom}
        >
          Create new Room
        </button>
      </div>
    </div>
  );
};

export default Lobby;
