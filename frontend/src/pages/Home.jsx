import MeetingTypeList from "./MeetingTypeList";

const Home = () => {
  const dateNow = new Date();

  const time = dateNow.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const date = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "full",
  }).format(dateNow);

  return (
    <section className="w-full flex flex-col gap-10">
      <div className="h-[300px] sm:h-[220px] rounded-lg w-full bg-[#364153] bg-[url('/images/hero-background.png')] bg-cover">
        <div className="h-full p-5 flex flex-col justify-between">
          <h2 className="text-white w-fit bg-[#6a7282] rounded-sm p-3">
            Upcoming Meeting at 12:30 PM
          </h2>

          <div className="space-y-2">
            <p className="text-3xl sm:text-5xl font-bold text-white">{time}</p>
            <p className="text-lg font-semibold text-white">{date}</p>
          </div>
        </div>
      </div>

      <MeetingTypeList />
    </section>
  );
};

export default Home;
