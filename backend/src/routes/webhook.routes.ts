import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// POST /api/v1/webhooks/shopify/orders-create
router.post('/shopify/orders-create', async (req, res) => {
  try {
    // Webhook verification would go here
    const orderData = req.body;

    console.log('Shopify order webhook received:', orderData.id);

    // Process webhook (would be handled by background job in production)
    res.status(200).json({ message: 'Webhook received' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// POST /api/v1/webhooks/shopify/orders-update
router.post('/shopify/orders-update', async (req, res) => {
  try {
    const orderData = req.body;

    console.log('Shopify order update webhook received:', orderData.id);

    res.status(200).json({ message: 'Webhook received' });
  } catch (error) {
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

export default router;
