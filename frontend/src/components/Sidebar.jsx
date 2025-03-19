import { sidebarLinks } from '../constants'
import { Link, useLocation } from 'react-router'

const Sidebar = () => {
const location = useLocation();

  return (
    <section className='bg-[#1E2939] w-fit h-screen text-white font-bold px-5 sticky top-0 left-0 flex justify-between max-sm:hidden'>
        <div className='flex flex-col gap-6 mt-25 lg:mt-30 w-fit lg:w-[160px]'>
            {sidebarLinks.map(link => {
                const isActive = location.pathname === link.route;
                return (
                    <Link 
                    key={link.label}
                    to={link.route}
                    className={`flex items-center py-3 rounded-sm px-3 gap-3 ${isActive && "bg-[#155DFC]"}`}
                    >
                        <img src={link.imgUrl} alt={link.label} className='w-4 h-4 max-xl:w-5 max-xl:h-5' />
                        <p className='text-sm hidden lg:block'>{link.label}</p>
                    </Link>
                )
            })}
        </div>
    </section>
  )
}

export default Sidebar