import React from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

const Layout = ({children}) => {
  return (
    <main className='relative '>
        {/* <Navbar /> */}

        <div className='flex flex-1 bg-[#101828]'>
            {/* <Sidebar /> */}

            <section className='w-full px-5 sm:px-10 py-26'>
                <div className='w-full min-h-screen'>
                    {children}
                </div>
            </section>
        </div>
    </main>
  )
}

export default Layout