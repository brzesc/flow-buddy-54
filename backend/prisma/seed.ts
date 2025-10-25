import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('password', 10);
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      passwordHash: adminPassword,
      role: 'Admin',
    },
  });
  console.log('✓ Admin user created:', admin.username);

  // Create sample customers
  const customers = await Promise.all([
    prisma.customer.upsert({
      where: { email: 'john@example.com' },
      update: {},
      create: {
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
        company: 'Acme Corp',
      },
    }),
    prisma.customer.upsert({
      where: { email: 'jane@example.com' },
      update: {},
      create: {
        email: 'jane@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+1234567891',
      },
    }),
    prisma.customer.upsert({
      where: { email: 'bob@example.com' },
      update: {},
      create: {
        email: 'bob@example.com',
        firstName: 'Bob',
        lastName: 'Johnson',
        company: 'Tech Solutions Inc',
      },
    }),
  ]);
  console.log('✓ Sample customers created:', customers.length);

  // Create sample orders
  const orders = await Promise.all([
    prisma.order.upsert({
      where: { number: '1001' },
      update: {},
      create: {
        number: '1001',
        customerId: customers[0].id,
        status: 'New',
        totalAmount: 249.00,
        currency: 'USD',
        orderDate: new Date('2025-01-20'),
        productTitles: ['Product A', 'Product B'],
        emailUnread: true,
      },
    }),
    prisma.order.upsert({
      where: { number: '1002' },
      update: {},
      create: {
        number: '1002',
        customerId: customers[1].id,
        status: 'Processing',
        totalAmount: 499.00,
        currency: 'USD',
        orderDate: new Date('2025-01-19'),
        productTitles: ['Product C'],
        emailUnread: false,
      },
    }),
    prisma.order.upsert({
      where: { number: '1003' },
      update: {},
      create: {
        number: '1003',
        customerId: customers[2].id,
        status: 'Fulfilled',
        totalAmount: 149.00,
        currency: 'USD',
        orderDate: new Date('2025-01-18'),
        productTitles: ['Product A', 'Product D', 'Product E'],
        emailUnread: true,
      },
    }),
  ]);
  console.log('✓ Sample orders created:', orders.length);

  // Create sample emails
  const emails = await Promise.all([
    prisma.email.create({
      data: {
        threadId: 'thread_001',
        orderId: orders[0].id,
        subject: `Question about order #${orders[0].number}`,
        snippet: 'Hi, I have a question about my recent order...',
        receivedAt: new Date('2025-01-20T10:30:00Z'),
        isUnread: true,
      },
    }),
    prisma.email.create({
      data: {
        threadId: 'thread_002',
        orderId: orders[2].id,
        subject: `Order #${orders[2].number} - Delivery confirmation`,
        snippet: 'Thank you for your order! Your package has been delivered...',
        receivedAt: new Date('2025-01-18T15:45:00Z'),
        isUnread: true,
      },
    }),
  ]);
  console.log('✓ Sample emails created:', emails.length);

  // Create sample invoices
  const invoices = await Promise.all([
    prisma.invoice.create({
      data: {
        orderId: orders[1].id,
        total: orders[1].totalAmount,
        currency: orders[1].currency,
        status: 'Issued',
        externalId: 'INV-2025-001',
      },
    }),
    prisma.invoice.create({
      data: {
        orderId: orders[2].id,
        total: orders[2].totalAmount,
        currency: orders[2].currency,
        status: 'Paid',
        externalId: 'INV-2025-002',
      },
    }),
  ]);
  console.log('✓ Sample invoices created:', invoices.length);

  // Create integration records
  await prisma.integration.upsert({
    where: { provider: 'Shopify' },
    update: {},
    create: {
      provider: 'Shopify',
      isActive: true,
      config: {
        shop: process.env.SHOPIFY_SHOP || 'demo-shop.myshopify.com',
        apiVersion: '2024-10',
      },
      lastSyncAt: new Date(),
    },
  });

  await prisma.integration.upsert({
    where: { provider: 'Email' },
    update: {},
    create: {
      provider: 'Email',
      isActive: true,
      config: {
        host: process.env.IMAP_HOST || 'imap.gmail.com',
        port: Number(process.env.IMAP_PORT) || 993,
      },
      lastSyncAt: new Date(),
    },
  });

  await prisma.integration.upsert({
    where: { provider: 'Invoice' },
    update: {},
    create: {
      provider: 'Invoice',
      isActive: true,
      config: {
        provider: 'wfirma',
        mockMode: true,
      },
      lastSyncAt: new Date(),
    },
  });
  console.log('✓ Integration records created');

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
