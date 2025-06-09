import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { Paperclip, Reply, Send } from "lucide-react";

const DetailTicket = () => {
  const { id } = useParams(); // id = ticketServerId
  const { dataList } = useContext(AppContext);
  const [responseText, setResponseText] = useState("");

  const ticket = dataList.find((t) => String(t.ticketServerId) == String(id));

  if (!ticket) {
    return <div className="p-4 text-gray-600">Không tìm thấy ticket phù hợp.</div>;
  }

  const handleSendResponse = () => {
    if (responseText.trim()) {
      console.log("Gửi phản hồi:", responseText);
      // TODO: Gọi API gửi phản hồi tại đây nếu cần
      setResponseText("");
    }
  };

  return (
    <div className="w-full h-[calc(100vh-64px)] flex flex-col bg-gray-100">
      {/* Vùng chia 2 cột */}
      <div className="flex flex-1 overflow-hidden">
        {/* Bên trái: hội thoại + nội dung */}
        <div className="w-3/4 flex flex-col">
          {/* Tiêu đề bên trái */}
          <div className="p-4 border-b bg-white">
            <h2 className="text-xl font-bold text-blue-600 text-center">Nội dung Ticket</h2>
          </div>

          {/* Khu vực hiển thị nội dung */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
            {/* Email gốc */}
            <div className="max-w-lg bg-white p-4 rounded-lg shadow border border-gray-200">
              <p className="text-gray-600 text-sm mb-2">Khách hàng gửi:</p>
              <div
                className="prose max-w-none text-gray-800"
                dangerouslySetInnerHTML={{ __html: ticket.html || ticket.text }}
              />
            </div>

            {/* File đính kèm */}
            {ticket.attachments?.length > 0 && (
              <div className="max-w-lg bg-white p-4 rounded-lg shadow border border-gray-200">
                <div className="flex items-center gap-2 text-gray-700 mb-2 font-medium">
                  <Paperclip size={18} /> Đính kèm:
                </div>
                <ul className="list-disc list-inside text-blue-600 text-sm">
                  {ticket.attachments.map((file, i) => (
                    <li key={i}>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {file.filename}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Phản hồi của Agent */}
            {ticket.agentResponse && (
              <div className="max-w-lg bg-blue-50 p-4 rounded-lg border border-blue-100 shadow-sm ml-auto">
                <div className="flex items-center gap-2 text-blue-700 mb-2 font-medium">
                  <Reply size={18} /> Phản hồi từ Agent:
                </div>
                <div className="text-sm text-gray-800 whitespace-pre-wrap">
                  {ticket.agentResponse}
                </div>
              </div>
            )}
          </div>

          {/* Thanh nhập liệu */}
          <div className="border-t p-4 flex items-center gap-2 bg-white">
            <input
              type="text"
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder="Nhập phản hồi..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
            />
            <button
              onClick={handleSendResponse}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-1"
            >
              <Send size={16} /> Gửi
            </button>
          </div>
        </div>

        {/* Bên phải: Chi tiết Ticket */}
        <div className="w-1/4 bg-white border-l p-4 overflow-y-auto text-sm text-gray-700 space-y-3">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Chi tiết Ticket</h3>
          <div>
            <span className="font-medium">Mã Ticket:</span> {ticket.ticketServerId}
          </div>
          <div>
            <span className="font-medium">Tiêu đề:</span> {ticket.subject || "Không có"}
          </div>
          <div>
            <span className="font-medium">Ngày tạo:</span>{" "}
            {new Date(ticket.createdAt).toLocaleString()}
          </div>
          <div>
            <span className="font-medium">Ngày cập nhật:</span>{" "}
            {new Date(ticket.updatedAt).toLocaleString()}
          </div>
          <div>
            <span className="font-medium">Agent xử lý:</span>{" "}
            {ticket.assignedTo || "Chưa phân công"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailTicket;
