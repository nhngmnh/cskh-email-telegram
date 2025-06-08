import { createContext, useEffect,useState } from "react";
import axios from 'axios'
import {toast} from "react-toastify"
export const AppContext=createContext()
const AppContextProvider=(props)=>{
    
    const backendurl=import.meta.env.VITE_BACKEND_URL
    const [userData,setUserData]=useState(false)
    const [token,setToken]=useState(localStorage.getItem('token')?localStorage.getItem('token'):false);
    
    
    const value={
        token,setToken,
        
    }
    
    useEffect(() => {
        const fetchInitialData = async () => {
          try {
            
          } catch (error) {
            console.error("Error fetching initial data", error);
          }
        };
      
        fetchInitialData();
      }, []);
      
      useEffect(() => {
        const fetchUserData = async () => {
          
        };
      
        fetchUserData();
      }, [token]);
    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}
export default AppContextProvider