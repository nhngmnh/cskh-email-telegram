import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {toast} from 'react-toastify'
const strategies = [
  { label: 'Round Robin', value: 'round-robin' },
  { label: 'Random', value: 'random' },
  { label: 'Least Tickets', value: 'least-tickets' },
];

const App = () => {
  const [selectedStrategy, setSelectedStrategy] = useState('');
  const [initialLoaded, setInitialLoaded] = useState(false);

  useEffect(() => {
    const syncStrategy = async () => {
      try {
        if (!initialLoaded) {
          const res = await axios.get(import.meta.env.VITE_ACD_SERVER_URL+'/api/get-strategy');
          console.log(res.data);
          
          setSelectedStrategy(res.data.strategy);
          setInitialLoaded(true);
        } else {
          const t= await axios.post(import.meta.env.VITE_ACD_SERVER_URL+'/api/set-strategy', {
            strategy: selectedStrategy,
          });
          console.log(t);
          toast.success("Đổi thuật phân phối thành công!")
        }
      } catch (err) {
        console.error('Lỗi xử lý strategy:', err);
        toast.error("Lỗi Server !")
      }
    };

    syncStrategy();
  }, [selectedStrategy]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">ACD Strategy Config</h1>

        {!initialLoaded ? (
          <p className="text-center text-gray-500">Đang tải...</p>
        ) : (
          <>
            <label htmlFor="strategy" className="block text-gray-700 mb-2">
              Chọn chiến lược phân phối:
            </label>
            <select
              id="strategy"
              value={selectedStrategy}
              onChange={(e) => setSelectedStrategy(e.target.value)}
              className="w-full p-3 border rounded-lg"
            >
              {strategies.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>

            <div className="mt-6 text-center text-gray-600">
              <p>Đang áp dụng: <strong>{selectedStrategy}</strong></p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
