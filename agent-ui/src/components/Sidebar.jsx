import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const { dataList, getData, totalPages } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); // all | unanswered | answered
  const [page, setPage] = useState(1);
  const limit = 10;

  const navigate = useNavigate();

  const fetchTickets = async () => {
    setLoading(true);
    try {
      await getData(page, limit, activeTab);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [activeTab, page]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(1); // Reset về trang đầu khi đổi tab
  };

  const renderPagination = () => {
    if (totalPages < 1) return null;

    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) {
        pages.push(i);
      } else if (
        (i === page - 2 && page - 3 > 1) ||
        (i === page + 2 && page + 3 < totalPages)
      ) {
        pages.push("...");
      }
    }

    const finalPages = [];
    let last = null;
    for (let p of pages) {
      if (p === "...") {
        if (last !== "...") finalPages.push(p);
      } else {
        finalPages.push(p);
      }
      last = p;
    }

    return (
      <div className="mt-2 flex justify-center items-center text-sm flex-wrap gap-1">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className="px-2 py-1 rounded border text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          disabled={page === 1 || loading}
        >
          Previous
        </button>

        {finalPages.map((item, idx) =>
          item === "..." ? (
            <span key={`dots-${idx}`} className="px-2 text-gray-400">
              ...
            </span>
          ) : (
            <button
              key={item}
              onClick={() => setPage(item)}
              className={`px-2 py-1 rounded border ${
                item === page
                  ? "bg-blue-600 text-white font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item}
            </button>
          )
        )}

        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          className="px-2 py-1 rounded border text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          disabled={page === totalPages || loading}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="w-72 bg-gray-50 border-r h-full flex flex-col">
      {/* Tabs */}
      <div className="p-4">
        <div className="flex justify-between mb-4">
          {[
            { key: "all", label: "Tất cả" },
            { key: "unanswered", label: "Chưa trả lời" },
            { key: "answered", label: "Đã trả lời" },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`text-sm px-2 py-1 rounded font-medium ${
                activeTab === tab.key
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
              onClick={() => handleTabChange(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets List */}
      <div className="flex-1 overflow-y-auto px-4">
        {loading ? (
          <p className="text-sm text-gray-400 text-center mt-4">Đang tải...</p>
        ) : (
          <>
            {dataList.length === 0 && (
              <p className="text-sm text-gray-500 text-center mt-4">Không có dữ liệu.</p>
            )}
            {dataList.map((ticket) => (
              <div
                key={ticket.ticketServerId}
                onClick={() => {
                  navigate(`/detail-ticket/${ticket.ticketServerId}`);
                  scrollTo(0, 0);
                }}
                className="cursor-pointer p-2 bg-white rounded shadow mb-2 hover:bg-blue-50"
              >
                <p className="text-sm font-medium">{ticket.subject || "No Subject"}</p>
                <p className="text-xs text-gray-500">
                  Cập nhật: {new Date(ticket.updatedAt).toLocaleString()}
                </p>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Pagination cố định cuối */}
      <div className="p-4 border-t">{renderPagination()}</div>
    </div>
  );
};

export default Sidebar;
