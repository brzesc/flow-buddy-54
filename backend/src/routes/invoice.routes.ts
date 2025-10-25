import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/v1/invoices
router.get('/', async (req, res) => {
  try {
    const { orderId } = req.query;

    const where: any = {};
    if (orderId) {
      where.orderId = String(orderId);
    }

    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        order: {
          include: {
            customer: true,
          },
        },
      },
      orderBy: { issuedAt: 'desc' },
    });

    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

// POST /api/v1/invoices
router.post('/', async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { customer: true },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if invoice already exists
    const existingInvoice = await prisma.invoice.findFirst({
      where: { orderId },
    });

    if (existingInvoice) {
      return res.status(400).json({ error: 'Invoice already exists for this order' });
    }

    // Create invoice (mock mode for now)
    const invoice = await prisma.invoice.create({
      data: {
        orderId,
        total: order.totalAmount,
        currency: order.currency,
        status: 'Issued',
        externalId: `INV-${Date.now()}`,
      },
    });

    // Log event
    await prisma.event.create({
      data: {
        orderId,
        type: 'InvoiceGenerated',
        payload: { invoiceId: invoice.id },
      },
    });

    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create invoice' });
  }
});

export default router;
