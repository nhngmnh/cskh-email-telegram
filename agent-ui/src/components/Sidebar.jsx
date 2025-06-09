import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';

const Sidebar = ({ onSelectTicket }) => {
  const { token, backendurl } = useContext(AppContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendurl}/ticket-data`, {
        headers: { token },
        params: {
          page: 1,
          limit: 10
        }
      });
      setTickets(res.data?.data || []);
      console.log(res.data);
      
    } catch (err) {
      console.error('Lỗi lấy ticket:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [token]);

  const unAnswered = tickets.filter(t => !t.agentResponse);
  const answered = tickets.filter(t => t.agentResponse);

  return (
    <div className="w-72 bg-gray-50 border-r h-full p-4 overflow-y-auto">
      <h2 className="font-semibold text-gray-700 mb-2">Chưa trả lời</h2>
      {unAnswered.map(ticket => (
        <div key={ticket.id} onClick={() => onSelectTicket(ticket)} className="cursor-pointer p-2 bg-white rounded shadow mb-2 hover:bg-blue-50">
          <p className="text-sm font-medium">{ticket.subject || 'No Subject'}</p>
          <p className="text-xs text-gray-500">Cập nhật: {new Date(ticket.updatedAt).toLocaleString()}</p>
        </div>
      ))}

      <h2 className="font-semibold text-gray-700 mt-6 mb-2">Đã trả lời</h2>
      {answered.map(ticket => (
        <div key={ticket.id} onClick={() => onSelectTicket(ticket)} className="cursor-pointer p-2 bg-white rounded shadow mb-2 hover:bg-green-50">
          <p className="text-sm font-medium">{ticket.subject || 'No Subject'}</p>
          <p className="text-xs text-gray-500">Trả lời lúc: {new Date(ticket.updatedAt).toLocaleString()}</p>
        </div>
      ))}

      {loading && <p className="text-center text-sm mt-4 text-gray-400">Đang tải...</p>}
    </div>
  );
};

export default Sidebar;
