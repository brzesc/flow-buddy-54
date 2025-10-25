import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

// GET /api/v1/orders
router.get('/', async (req, res) => {
  try {
    const { status, search, page = '1', limit = '20' } = req.query;

    const where: any = {};
    
    if (status && status !== 'all') {
      where.status = String(status).charAt(0).toUpperCase() + String(status).slice(1);
    }

    if (search) {
      where.OR = [
        { number: { contains: String(search), mode: 'insensitive' } },
        { customer: { email: { contains: String(search), mode: 'insensitive' } } },
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        customer: true,
        emails: { where: { isUnread: true } },
        invoices: true,
      },
      orderBy: { orderDate: 'desc' },
      take: Number(limit),
      skip: (Number(page) - 1) * Number(limit),
    });

    const total = await prisma.order.count({ where });

    res.json({
      data: orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET /api/v1/orders/:id
router.get('/:id', async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        customer: true,
        emails: { orderBy: { receivedAt: 'desc' } },
        invoices: true,
        events: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// PATCH /api/v1/orders/:id/status
router.patch('/:id/status', async (req, res) => {
  try {
    const statusSchema = z.object({
      status: z.enum(['New', 'Processing', 'Fulfilled', 'Cancelled', 'OnHold']),
    });

    const { status } = statusSchema.parse(req.body);

    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status },
    });

    // Log event
    await prisma.event.create({
      data: {
        orderId: order.id,
        type: 'StatusChanged',
        payload: { oldStatus: order.status, newStatus: status },
      },
    });

    res.json(order);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

export default router;
