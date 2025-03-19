import { useState } from "react";
import { Link } from "react-router";
import MobileNav from "../mobile/MobileNav";

const Navbar = () => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [userModal, setUserModal] = useState(false);

  return (
    <>
    <nav className="sm-bgColor sm:bg-gray-800 w-full px-6 py-4 flex justify-between fixed top-0 left-0 z-50 flex-between lg:px-10 ">
      <Link to="/" className="flex gap-1 items-center ">
        <img src="/icons/logo.svg" className="w-8 h-8" />
        <p className="text-white text-xl font-bold max-sm:hidden">ClickChat</p>
      </Link>

      <div className="flex items-center gap-2 relative">
        <div className="relative">
        <button className="cursor-pointer" onClick={() => setUserModal(prev => !prev)}>
          <img src="/images/avatar-6.svg" className="w-6 h-6" />
        </button>

        {
          userModal && (
            <div className="absolute top-[40px] sm:right-0 -right-10 bg-[#364153] px-5 py-3 w-[260px] sm:w-[300px] rounded-sm space-y-5 text-white">

          <div className="flex items-center gap-4 ">
            <img src='/images/avatar-6.svg' className="w-5 h-5" />
            <div>
              <h3>avascripyt nodes</h3>
              <h5>nodehs</h5>
            </div>
          </div>

          <Link className="flex gap-4 items-center">
          <img src="/icons/setting.svg" className="w-5 h-5" />
          <p>Manage account</p>
          </Link>

          <Link className="flex gap-4 items-center">
          <img src="/icons/signout.svg" className="w-5 h-5" />
          <p>Sign out</p>
          </Link>
        </div>
          )
        }

        </div>

        <button className="cursor-pointer sm:hidden" onClick={() => setIsHamburgerOpen(true)}>
          <img src="/icons/hamburger.svg" />
        </button>
      </div>

      <MobileNav isHamburgerOpen={isHamburgerOpen} setIsHamburgerOpen={setIsHamburgerOpen} />
    </nav>
    
    </>
  );
};

export default Navbar;
