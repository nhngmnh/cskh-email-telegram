import { createContext, useEffect, useState } from "react";
import axios from 'axios';
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const backendurl = import.meta.env.VITE_BACKEND_URL;

  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);

// login
const logout = () => {
  localStorage.removeItem('token');
  setToken('');
  setUserData(null);
  toast.success("Đăng xuất thành công");
};
  const login = async (username, password) => {
    try {
      const res = await axios.post(`${backendurl}/login`, {
        username,
        password,
      });

      if (res.data?.token) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        toast.success("Đăng nhập thành công");
      } else {
        toast.error("Đăng nhập thất bại");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Lỗi đăng nhập");
    }
  };

// dki
  const register = async (formData) => {
    try {
      const res = await axios.post(`${backendurl}/register`, formData);
      toast.success("Đăng ký thành công");
    } catch (error) {
      console.error("Register error:", error);
      toast.error("Lỗi đăng ký");
    }
  };

// phan trang
  const getData = async (page , limit) => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await axios.get(`${backendurl}/ticket-data`, {
        headers: {
          token
        },
        params: {
          page,
          limit
        }
      });
      setDataList(res.data?.data || []);
    } catch (error) {
      console.error("Error fetching paginated data:", error);
      toast.error("Lỗi khi lấy dữ liệu");
    } finally {
      setLoading(false);
    }
  };
  const fetchUserData = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${backendurl}/agent-info`, {
        headers: {
          token
        }
      });
      setUserData(res.data.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error(error.message);
    }
  };
  useEffect(() => {
    if (token) {
      fetchUserData()
    }
  }, [token]);

  const value = {
    token,
    setToken,
    userData,
    dataList,
    loading,
    login,
    register,
    getData,backendurl,
    logout
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
