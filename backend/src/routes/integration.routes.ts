import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/v1/integrations
router.get('/', async (req, res) => {
  try {
    const integrations = await prisma.integration.findMany({
      orderBy: { provider: 'asc' },
    });

    res.json(integrations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch integrations' });
  }
});

// POST /api/v1/integrations/:provider/sync
router.post('/:provider/sync', async (req, res) => {
  try {
    const { provider } = req.params;

    const integration = await prisma.integration.findUnique({
      where: { provider: provider as any },
    });

    if (!integration) {
      return res.status(404).json({ error: 'Integration not found' });
    }

    // Update last sync time
    await prisma.integration.update({
      where: { provider: provider as any },
      data: { lastSyncAt: new Date() },
    });

    // In a real app, this would trigger background jobs
    res.json({ message: `${provider} sync triggered successfully` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to trigger sync' });
  }
});

export default router;
