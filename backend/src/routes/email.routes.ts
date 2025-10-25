import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/v1/emails
router.get('/', async (req, res) => {
  try {
    const { orderId, unread } = req.query;

    const where: any = {};
    
    if (orderId) {
      where.orderId = String(orderId);
    }
    
    if (unread === 'true') {
      where.isUnread = true;
    }

    const emails = await prisma.email.findMany({
      where,
      include: {
        order: {
          include: {
            customer: true,
          },
        },
      },
      orderBy: { receivedAt: 'desc' },
    });

    res.json(emails);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch emails' });
  }
});

// PATCH /api/v1/emails/:id/read
router.patch('/:id/read', async (req, res) => {
  try {
    const { isUnread } = req.body;

    const email = await prisma.email.update({
      where: { id: req.params.id },
      data: { isUnread: Boolean(isUnread) },
    });

    // Update order's emailUnread flag
    if (email.orderId) {
      const unreadCount = await prisma.email.count({
        where: { orderId: email.orderId, isUnread: true },
      });

      await prisma.order.update({
        where: { id: email.orderId },
        data: { emailUnread: unreadCount > 0 },
      });
    }

    res.json(email);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update email' });
  }
});

export default router;
