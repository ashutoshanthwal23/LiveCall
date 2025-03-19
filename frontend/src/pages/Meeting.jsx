import { useState } from "react";
import { useLocation } from "react-router";
import MeetingSetup from "./MeetingSetup";
import MeetingCall from "./MeetingCall";


const Meeting = () => {
  const location = useLocation();
  const id = location.state?.id;
  
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  

  return !isSetupComplete ? (
    <MeetingSetup
      setIsSetupComplete={setIsSetupComplete}
    />
  ) : (
    <>
    <MeetingCall 
    />
    </>
  );
};

export default Meeting;
