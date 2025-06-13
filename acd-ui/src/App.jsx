import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const strategies = [
  { label: 'Round Robin', value: 'round-robin' },
  { label: 'Random', value: 'random' },
  { label: 'Least Tickets', value: 'least-tickets' },
];

const App = () => {
  const [selectedStrategy, setSelectedStrategy] = useState(localStorage.getItem('strategy')||'Round Robin');
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [ticketDistribution, setTicketDistribution] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Đồng bộ chiến lược phân phối
  useEffect(() => {
    const syncStrategy = async () => {
      try {
        if (!initialLoaded) {
          const res = await axios.get(import.meta.env.VITE_ACD_SERVER_URL + '/api/get-strategy');
        //  setSelectedStrategy(res.data.strategy);
          setInitialLoaded(true);
        } else {
          await axios.post(import.meta.env.VITE_ACD_SERVER_URL + '/api/set-strategy', {
            strategy: selectedStrategy,
          });
          toast.success("Đổi thuật phân phối thành công!");
        }
      } catch (err) {
        console.error('Lỗi xử lý strategy:', err);
        toast.error("Lỗi Server !");
      }
    };
    syncStrategy();
  }, [selectedStrategy]);

  // Lấy ticket khi đổi trang
  useEffect(() => {
    const getDistributionTickets = async (page) => {
      try {
        const res = await axios.get(
          import.meta.env.VITE_TICKET_SERVICE_URL + '/api/get-distribution',
          { params: { page, limit: 10 } }
        );
        setTicketDistribution(res.data.tickets);
        setTotalPages(res.data.totalPages);
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      }
    };

    getDistributionTickets(currentPage);
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cột trái: cấu hình chiến lược */}
        <div className="bg-white p-6 rounded-2xl shadow-md col-span-1 h-fit">
          <h1 className="text-xl font-bold mb-4 text-center">Cấu hình chiến lược</h1>
          {!initialLoaded ? (
            <p className="text-center text-gray-500">Đang tải...</p>
          ) : (
            <>
              <label htmlFor="strategy" className="block text-gray-700 mb-2">
                Chọn chiến lược:
              </label>
              <select
                id="strategy"
                value={selectedStrategy}
               onChange={(e) => {
  setSelectedStrategy(e.target.value);
  localStorage.setItem('strategy', e.target.value);
}}

                className="w-full p-3 border rounded-lg text-sm"
              >
                {strategies.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <div className="mt-4 text-center text-gray-600 text-sm">
                <p>Đang dùng: <strong>{selectedStrategy}</strong></p>
              </div>
            </>
          )}
        </div>

        {/* Cột phải: danh sách ticket phân phối */}
        <div className="bg-white p-6 rounded-2xl shadow-md col-span-2">
          <h2 className="text-xl font-semibold mb-4">Danh sách ticket phân phối</h2>
          {ticketDistribution.length === 0 ? (
            <p className="text-gray-500 text-center">Không có ticket nào.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
              {ticketDistribution.map((ticket) => (
                <div
                  key={ticket.id}
                  className="border rounded-lg p-4 bg-gray-50 hover:bg-white shadow"
                >
                  <p><strong>ID:</strong> {ticket.ticketId}</p>
                  <p><strong>Subject:</strong> {ticket.subject}</p>
                  <p><strong>Phân phối đến:</strong> {ticket.assignedEmployee || 'Chưa phân phối'}</p>
                  <p><strong>Từ chối tư vấn:</strong> {ticket.ignoredEmployee || 'Không có ai'}</p>
                  <p><strong>Thao tác gần nhất:</strong> {new Date(ticket.updatedAt).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}

          {/* Phân trang */}
          <div className="flex justify-center items-center gap-2 mt-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Trang trước
            </button>
            <span>Trang {currentPage} / {totalPages}</span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Trang sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
