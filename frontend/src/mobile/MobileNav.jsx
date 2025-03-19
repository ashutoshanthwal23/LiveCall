import { Link, useLocation, useNavigate } from "react-router";
import { sidebarLinks } from "../constants";

const MobileNav = ({ isHamburgerOpen, setIsHamburgerOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navigateTo = (url) => {
    setIsHamburgerOpen(false);
    setTimeout(() => {
      navigate(url);
    }, 100);
  };

  return (
    <section
      className="sm-bgColor sm:bg-gray-800 w-[90%] sm:hidden h-screen text-white  font-bold px-5 fixed top-0 left-0 flex justify-between "
      style={{
        transform: isHamburgerOpen ? "translateX(0)" : "translateX(-100%)",
        transition: ".3s",
      }}
    >
      <div className="flex flex-col gap-6 mt-10 lg:mt-30 w-full">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex gap-1 items-center ">
            <img src="/icons/logo.svg" className="w-8 h-8" />
            <p className="text-white text-xl font-bold ">ClickChat</p>
          </Link>
          <button
            className="border cursor-pointer px-2 font-normal"
            onClick={() => setIsHamburgerOpen(false)}
          >
            X
          </button>
        </div>
        {sidebarLinks.map((link) => {
          const isActive = location.pathname === link.route;
          return (
            <Link
              key={link.label}
              onClick={() => navigateTo(link.route)}
              className={`flex items-center py-3 rounded-sm px-3 gap-3 ${
                isActive && "bg-[#155dfc]"
              }`}
            >
              <img src={link.imgUrl} alt={link.label} className="w-4 h-4" />
              <p className="text-sm ">{link.label}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default MobileNav;
