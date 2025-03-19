import React from "react";

const HomeCard = ({ img, title, description, handleClick, className }) => {
  return (
    <div
      className={`${className} h-[250px] rounded-lg px-4 py-5 flex flex-col justify-between cursor-pointer`}
      onClick={handleClick}
    >
      <button className="bg-[rgba(255,255,255,0.3)] rounded-lg px-3 py-2 pointer-events-auto  w-fit cursor-pointer">
        <img src={img} className="w-5 h-5" />
      </button>

      <div className="space-y-1">
        <p className="text-2xl font-bold text-white">{title}</p>
        <p className="text-white xl:text-lg">{description}</p>
      </div>
    </div>
  );
};

export default HomeCard;
