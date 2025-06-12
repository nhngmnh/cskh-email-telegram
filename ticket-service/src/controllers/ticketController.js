import { ticket } from "../models/ticketDB.js";

export const getPaginatedTickets = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const totalTickets = await ticket.count();
    const totalPages = Math.ceil(totalTickets / limit);

    const tickets = await ticket.findAll({
      order: [['updatedAt', 'DESC']], // sắp xếp mới nhất lên đầu
      offset,
      limit
    });

    return res.json({
      page,
      totalPages,
      tickets
    });
  } catch (err) {
    console.error('[getPaginatedTickets] Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
