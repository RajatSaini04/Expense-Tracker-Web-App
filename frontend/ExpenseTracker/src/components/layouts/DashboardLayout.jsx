import React, { useContext, useState } from 'react';
import SideMenu from './SideMenu';
import { UserContext } from '../../context/UserContext.jsx'; // ✅ Correct import
import Navbar from './Navbar';


const DashboardLayout = ({ children, activeMenu }) => {
  const { user } = useContext(UserContext);
  return (
    <div className="flex  flex-col gap-5 bg-white border border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30">
      <Navbar activeMenu={activeMenu} />

      {user && (
        <div className='flex '>
          <div className='max-[1080px]:hidden'>
            <SideMenu activeMenu={activeMenu} />
          </div>
          <div className='grow mx-5'>{children}</div>
        </div>
      )}
    </div>
  );
};




export default DashboardLayout;
