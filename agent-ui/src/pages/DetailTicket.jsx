import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { Paperclip, Reply, Send, X } from "lucide-react";

const DetailTicket = () => {
  const { id } = useParams(); // id = ticketServerId
  const navigate = useNavigate();
  const { dataList, replyToTicket, handleIgnore, status, setStatus } = useContext(AppContext);
  const [responseText, setResponseText] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showIgnoreModal, setShowIgnoreModal] = useState(false);

  const ticket = dataList.find((t) => String(t.ticketServerId) === String(id));

  if (!ticket) {
    return <div className="p-4 text-gray-600 text-center">Danh sách trống</div>;
  }

  const handleConfirmSend = async () => {
    const formData = new FormData();
    formData.append("message", responseText);
    formData.append("ticketServerId", ticket.ticketServerId);
    formData.append("to", ticket.from);
    formData.append("from", ticket.to);
    formData.append("subject", ticket.subject);
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    await replyToTicket(formData);
    setResponseText("");
    setSelectedFiles([]);
    setShowModal(false);
    setStatus((prev) => !prev);
  };

  const handleConfirmIgnore = async () => {
    await handleIgnore(ticket);
    setStatus((prev) => !prev);
    navigate("/");
  };

  return (
    <div className="w-3/4 h-[calc(100vh-64px)] flex flex-col bg-gray-100">
      <div className="flex flex-1 overflow-hidden">
        {/* Left side: Ticket content */}
        <div className="w-3/4 flex flex-col">
          <div className="p-4 border-b bg-white">
            <h2 className="text-xl font-bold text-blue-600 text-center">Nội dung Ticket</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
            <div className="w-full bg-white p-4 rounded-lg shadow border border-gray-200">
              <p className="text-gray-600 text-sm mb-2">Khách hàng gửi:</p>
              <div
                className="prose max-w-none text-gray-800"
                dangerouslySetInnerHTML={{ __html: ticket.html || ticket.text }}
              />
            </div>

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

            {ticket.agentResponse && (
              <div className="max-w-lg bg-blue-50 p-4 rounded-lg border border-blue-100 shadow-sm ml-auto">
                <div className="flex items-center gap-2 text-blue-700 mb-2 font-medium">
                  <Reply size={18} /> Phản hồi từ Agent:
                </div>
                <div className="text-sm text-gray-800 space-y-1">
                  {ticket.agentResponse.split("\n").map((line, idx) => {
                    if (line.startsWith("[file]")) {
                      const url = line.replace("[file]", "").trim();
                      return (
                        <div key={idx}>
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline hover:text-blue-800"
                          >
                            {url}
                          </a>
                        </div>
                      );
                    } else {
                      return <div key={idx}>{line}</div>;
                    }
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Reply box */}
          <div className="border-t p-4 bg-white">
            {ticket.agentResponse ? (
              <div className="text-gray-500 text-sm italic">
                Ticket này đã được phản hồi. Bạn không thể gửi thêm phản hồi mới.
              </div>
            ) : (
              <>
                {selectedFiles.length > 0 && (
                  <div className="mb-2 text-sm text-gray-700 bg-gray-100 border p-2 rounded">
                    <div className="font-medium mb-1">File đính kèm:</div>
                    <ul className="space-y-1">
                      {selectedFiles.map((file, i) => (
                        <li
                          key={i}
                          className="flex items-center justify-between bg-white px-3 py-1 rounded border text-sm"
                        >
                          <span className="truncate max-w-[80%]">{file.name}</span>
                          <button
                            onClick={() => setSelectedFiles((prev) => prev.filter((_, idx) => idx !== i))}
                            className="text-red-500 hover:text-red-700"
                            title="Xoá file"
                          >
                            <X size={16} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Nhập phản hồi..."
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
                  />

                  <label htmlFor="fileInput" className="cursor-pointer text-gray-600 hover:text-blue-600">
                    <Paperclip size={18} />
                  </label>
                  <input
                    id="fileInput"
                    type="file"
                    multiple
                    onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
                    className="hidden"
                  />

                  <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-1"
                  >
                    <Send size={16} /> Gửi
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right side: Ticket info */}
        <div className="w-1/4 bg-white border-l p-4 overflow-y-auto text-sm text-gray-700 space-y-3">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Chi tiết Ticket</h3>
          <div><span className="font-medium">Mã Ticket:</span> {ticket.ticketServerId}</div>
          <div><span className="font-medium">Tiêu đề:</span> {ticket.subject || "Không có"}</div>
          <div><span className="font-medium">Ngày tạo:</span> {new Date(ticket.createdAt).toLocaleString()}</div>
          <div><span className="font-medium">Ngày cập nhật:</span> {new Date(ticket.updatedAt).toLocaleString()}</div>
          <div><span className="font-medium">Agent xử lý:</span> {ticket.assignedEmployee || "Chưa phân công"}</div>
          {!ticket.agentResponse && (
            <button
              onClick={() => setShowIgnoreModal(true)}
              className="p-2 bg-red-400 rounded-lg text-white hover:bg-red-700 hover:scale-105 transition-transform duration-150 cursor-pointer"
            >
              Từ chối tư vấn
            </button>
          )}
        </div>
      </div>

      {/* Modal xác nhận gửi phản hồi */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Xác nhận gửi phản hồi?</h3>
            <p className="text-sm text-gray-600 mb-6">Bạn có chắc chắn muốn gửi phản hồi này kèm theo file đính kèm?</p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded"
                onClick={() => setShowModal(false)}
              >
                Đóng
              </button>
              <button
                className="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded"
                onClick={handleConfirmSend}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal xác nhận từ chối tư vấn */}
      {showIgnoreModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Xác nhận từ chối tư vấn?</h3>
            <p className="text-sm text-gray-600 mb-6">Bạn có chắc chắn muốn từ chối xử lý ticket này?</p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded"
                onClick={() => setShowIgnoreModal(false)}
              >
                Đóng
              </button>
              <button
                className="px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-700 rounded"
                onClick={handleConfirmIgnore}
              >
                Từ chối
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailTicket;
