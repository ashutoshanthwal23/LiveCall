import { useState } from "react";
import HomeCard from "../components/HomeCard";
import MeetingModal from "./MeetingModal";
import { useNavigate } from "react-router";
import { ToastError, ToastSuccess } from "./toast/ToastContainer";
import { v4 as uuidv4 } from "uuid";

const MeetingTypeList = () => {
  const [meetingstate, setMeetingState] = useState(undefined);
  const navigate = useNavigate();

  const createMeeting = () => {
  }

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4 w-full">
      <HomeCard
        img="/icons/add-meeting.svg"
        title="New Meeting"
        description="Start an instant meeting"
        className="bg-[#FF6900]"
        handleClick={() => setMeetingState("isInstantMeeting")}
      />

      <HomeCard
        img="/icons/join-meeting.svg"
        title="Join Meeting"
        description="via invitation link"
        className="bg-[#2B7FFF]"
        handleClick={() => setMeetingState('isJoiningMeeting')}
      />

      <HomeCard
        img="/icons/schedule.svg"
        title="Schedule Meeting"
        description="plan your meeting"
        className="bg-[#7F22FE]"
        handleClick={() => setMeetingState('isScheduleMeeting')}
      />

      <HomeCard
        img="/icons/recordings.svg"
        title="View Recordings"
        description="Meeting Recordings"
        className="bg-[#FF6900]"
      />

      {meetingstate && (
        <MeetingModal
          isOpen={meetingstate === "isInstantMeeting"}
          onClose={() => setMeetingState(undefined)}
          title='Start an Instant Meeting'
          buttonText='Start Meeting'
          handleClick={createMeeting}
        />
      )}
    </section>
  );
};

export default MeetingTypeList;
