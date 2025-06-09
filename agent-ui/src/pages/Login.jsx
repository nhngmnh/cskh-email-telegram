import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true); // true = login, false = register
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const { setToken, backendurl } = useContext(AppContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
    
      const endpoint = isLogin ? '/login' : '/register';
      const payload = isLogin
        ? { username, password }
        : { username, password, name };
      console.log(backendurl + endpoint);
      const { data } = await axios.post(backendurl + endpoint, payload);
      
      if (data.success) {
        toast.success(`${isLogin ? 'Login' : 'Register'} successful!`);
        if (isLogin) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
        } else {
          setIsLogin(true); // Đăng ký xong chuyển sang login
        }
      } else {
        toast.error(data.message || 'Có lỗi xảy ra.');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-gray-600 text-sm shadow-lg'>
        <p className='text-2xl font-semibold m-auto'>
          <span className='text-primary'>Tư vấn viên</span> {isLogin ? 'đăng nhập' : 'đăng ký'}
        </p>

        {!isLogin && (
          <>
            <div className='w-full'>
              <p>Họ tên</p>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className='border border-gray-100 rounded w-full p-2 mt-1'
                type='text'
                required
              />
            </div>
            <div className='w-full'>
              <p>Số điện thoại (tùy chọn)</p>
              <input
                onChange={(e) => setPhoneNumber(e.target.value)}
                value={phoneNumber}
                className='border border-gray-100 rounded w-full p-2 mt-1'
                type='text'
              />
            </div>
          </>
        )}

        <div className='w-full'>
          <p>Username</p>
          <input
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            className='border border-gray-100 rounded w-full p-2 mt-1'
            type='text'
            required
          />
        </div>

        <div className='w-full'>
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className='border border-gray-100 rounded w-full p-2 mt-1'
            type='password'
            required
          />
        </div>

        <button className='bg-blue-500 text-white w-full py-2 rounded-md text-base mt-6'>
          {isLogin ? 'Login' : 'Register'}
        </button>

        <p className='text-center w-full mt-2 text-sm'>
          {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}{' '}
          <button
            type='button'
            onClick={() => setIsLogin(!isLogin)}
            className='text-blue-600 underline ml-1'
          >
            {isLogin ? 'Đăng ký' : 'Đăng nhập'}
          </button>
        </p>
      </div>
    </form>
  );
};

export default Login;
