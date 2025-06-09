import { ticket_agent,agent } from "../models/ticket-agentDB.js";
const getAgentTicketById = async (req, res) => {
  try {
    const agentId = req.body?.agentId;
    if (!agentId) {
      return res.status(401).json({
        success: false,
        message: 'Chưa xác thực tư vấn viên!',
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: tickets } = await ticket_agent.findAndCountAll({
      where: { assignedEmployee:agentId },
      order: [['updatedAt', 'DESC']],
      limit,
      offset,
    });

    return res.json({
      success: true,
      data: tickets,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
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
export {
    getAgentTicketById, getAgentInfo
}

