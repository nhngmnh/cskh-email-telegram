import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate=useNavigate();
  const { userData, logout } = useContext(AppContext);  
  return (
    <div className="flex items-center justify-between p-4 bg-white border-b shadow-sm">
      <h1 onClick={()=>navigate('/')} className="text-xl font-semibold text-blue-600 hover:cursor-pointer">CSKH Dashboard</h1>

      <div className="flex items-center gap-4">
        {userData && (
          <span
  onClick={() => {
    navigate('/profile');
    window.scrollTo(0, 0);
  }}
  className="text-gray-700 cursor-pointer transform transition-transform duration-200 hover:scale-105"
>
  👤 {userData.username || 'Agent'}
</span>
        )}
        <button
          onClick={()=>{logout(); navigate('/',scrollTo(0,0))}}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default Navbar;
