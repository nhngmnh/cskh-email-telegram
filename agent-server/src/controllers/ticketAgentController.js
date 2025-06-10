import { ticket_agent,agent } from "../models/ticket-agentDB.js";
import { Op }from 'sequelize'; // Import để dùng toán tử
import {v2 as cloudinary} from 'cloudinary'
import { producer } from "../config/kafkaConfig.js";
await producer.connect();
const getAgentTicketById = async (req, res) => {
  try {
    const agentId = req.body?.agentId;
    if (!agentId) {
      return res.status(401).json({
        success: false,
        message: 'Chưa xác thực tư vấn viên!',
      });
    }

    // Lấy các tham số phân trang và bộ lọc từ query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const filter = req.query.filter || 'all'; // all | unanswered | answered

    // Điều kiện tìm kiếm cơ bản: của agent hiện tại
    const whereCondition = { assignedEmployee: agentId };

    // Thêm điều kiện lọc theo filter
    if (filter === 'unanswered') {
      whereCondition.agentResponse = null;
    } else if (filter === 'answered') {
      whereCondition.agentResponse = { [Op.ne]: null };
    }

    // Truy vấn dữ liệu theo điều kiện
    const { count, rows: tickets } = await ticket_agent.findAndCountAll({
      where: whereCondition,
      order: [['updatedAt', 'DESC']],
      limit,
      offset,
    });    
    // Trả kết quả về frontend
    return res.json({
      success: true,
      data: tickets,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count/ limit),
      },
    });

  } catch (error) {
    console.error('Lỗi khi lấy ticket của agent:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy ticket.',
    });
  }
};


const getAgentInfo = async (req, res) => {
  try {
    const agentId = req.body.agentId; // Gán từ middleware xác thực

    if (!agentId) {
      return res.json({
        success: false,
        message: "Không xác định được agent.",
      });
    }

    const foundAgent = await agent.findByPk(agentId, {
      attributes: { exclude: ['password'] }, 
    });

    if (!foundAgent) {
      return res.json({
        success: false,
        message: "Không tìm thấy thông tin tư vấn viên.",
      });
    }

    return res.json({
      success: true,
      data: foundAgent,
    });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin agent:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy thông tin tư vấn viên.",
    });
  }
};

const handleReply = async (req, res) => {
  try {
    const { message, ticketServerId, to, from,subject } = req.body;
    console.log(message+ ticketServerId);
    
    const fileUrls = [];

    // Upload tất cả file nếu có
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "tickets",
          resource_type: "auto",
        });
        fileUrls.push(result.secure_url);
      }
    }

    // Gộp message + attachments thành một chuỗi text (tuỳ bạn định dạng)
    let agentResponse = message;
    if (fileUrls.length > 0) {
      const formattedAttachments = fileUrls.map((url) => `[file]${url}`).join("\n");
      agentResponse += `\n\n${formattedAttachments}`;
    }

    // Cập nhật bản ghi ticket_agent
    await ticket_agent.update(
      { agentResponse },
      { where: { ticketServerId } }
    );

    // Tạo payload gửi Kafka
    const payload = {
      subject: `Re: ${subject}`,
      ticketId: ticketServerId,
      from,
      to,
      message: agentResponse,
    };

    await producer.send({
      topic: "agent-responses",
      messages: [{ value: JSON.stringify(payload) }],
    });

    return res.json({ success: true, message: "Đã gửi phản hồi và cập nhật DB" });
  } catch (err) {
    console.error("Lỗi khi gửi phản hồi:", err);
    return res.status(500).json({ error: "Không thể gửi phản hồi" });
  }
};
const handleIgnore = async (req, res) => {
  try {
    const { agentId, ticketId } = req.body;
    console.log(agentId + " " + ticketId);

    // 1. Xoá bản ghi chứa ticketServerId = ticketId
    await ticket_agent.destroy({ where: { ticketServerId: ticketId } });

    // 2. Tạo payload gửi Kafka
    const payload = {
      agentId,
      ticketId,
    };

    await producer.send({
      topic: "ignore-ticket",
      messages: [{ value: JSON.stringify(payload) }],
    });

    return res.json({
      success: true,
      message: "Đã xoá ticket và gửi phản hồi Kafka",
    });
  } catch (err) {
    console.error("Lỗi khi xử lý từ chối ticket:", err);
    return res.status(500).json({ error: "Không thể xử lý yêu cầu" });
  }
};
export {
    getAgentTicketById, getAgentInfo,handleReply,handleIgnore
}

