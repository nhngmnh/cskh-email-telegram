import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const { dataList, getData } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        await getData(1, 10); // Mặc định page 1, limit 10
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const unAnswered = dataList.filter(t => !t.agentResponse);
  const answered = dataList.filter(t => t.agentResponse);

  return (
    <div className="w-72 bg-gray-50 border-r h-full p-4 overflow-y-auto">
      <h2 className="font-semibold text-gray-700 mb-2">Chưa trả lời</h2>
      {loading ? (
        <p className="text-sm text-gray-400 text-center mt-4">Đang tải...</p>
      ) : (
        <>
          {unAnswered.map(ticket => (
            <div
              key={ticket.ticketServerId}
              onClick={() => {
                navigate(`/detail-ticket/${ticket.ticketServerId}`);
                scrollTo(0, 0);
              }}
              className="cursor-pointer p-2 bg-white rounded shadow mb-2 hover:bg-blue-50"
            >
              <p className="text-sm font-medium">{ticket.subject || 'No Subject'}</p>
              <p className="text-xs text-gray-500">
                Cập nhật: {new Date(ticket.updatedAt).toLocaleString()}
              </p>
            </div>
          ))}

          <h2 className="font-semibold text-gray-700 mt-6 mb-2">Đã trả lời</h2>
          {answered.map(ticket => (
            <div
              key={ticket.ticketServerId}
              onClick={() => {
                navigate(`/detail-ticket/${ticket.ticketServerId}`);
                scrollTo(0, 0);
              }}
              className="cursor-pointer p-2 bg-white rounded shadow mb-2 hover:bg-green-50"
            >
              <p className="text-sm font-medium">{ticket.subject || 'No Subject'}</p>
              <p className="text-xs text-gray-500">
                Trả lời lúc: {new Date(ticket.updatedAt).toLocaleString()}
              </p>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default Sidebar;
