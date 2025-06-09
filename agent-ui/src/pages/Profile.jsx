import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { UserCircle, Mail, CalendarDays, BadgeInfo } from "lucide-react";

const Profile = () => {
  const { userData } = useContext(AppContext);

  if (!userData) {
    return <div className="p-4 text-gray-600">Đang tải thông tin cá nhân...</div>;
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 mt-6 bg-white shadow-xl rounded-2xl">
      {/* Header */}
      <div className="flex items-center gap-4 border-b pb-4 mb-6">
        <UserCircle size={64} className="text-blue-500" />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{userData.username}</h2>
          <p className="text-sm text-gray-500">Mã nhân viên: {userData.id}</p>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700 text-sm">
        <div className="flex items-center gap-2">
          <Mail className="text-gray-400" size={18} />
          <span className="font-medium w-28">Số điện thoại:</span>
          <span>{userData.phoneNumber || "Chưa cập nhật"}</span>
        </div>
        <div className="flex items-center gap-2">
          <BadgeInfo className="text-gray-400" size={18} />
          <span className="font-medium w-28">Họ tên:</span>
          <span>{userData.name || "Chưa cập nhật"}</span>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays className="text-gray-400" size={18} />
          <span className="font-medium w-28">Ngày tạo:</span>
          <span>
  {(() => {
    const date = new Date(userData.createdAt);
    const dayPart = date.toLocaleDateString(); // VD: "6/9/2025"
    const timePart = date.toLocaleTimeString(); // VD: "14:30:25"
    return `${dayPart} - ${timePart}`;
  })()}
</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
