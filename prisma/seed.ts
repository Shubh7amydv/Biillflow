import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding BillFlow database...');

  // 1. Create or update demo user
  const passwordHash = await bcrypt.hash('password123', 10);
  const demoEmail = 'demo@billflow.app';

  const user = await prisma.user.upsert({
    where: { email: demoEmail },
    update: {
      passwordHash,
      businessName: 'Elena Rostova Design Studio',
      currency: 'USD',
      invoicePrefix: 'INV',
    },
    create: {
      email: demoEmail,
      name: 'Elena Rostova',
      passwordHash,
      businessName: 'Elena Rostova Design Studio',
      currency: 'USD',
      invoicePrefix: 'INV',
    },
  });

  console.log(`Demo user ready: ${user.email} (ID: ${user.id})`);

  // 2. Clean existing clients and invoices for demo user
  await prisma.lineItem.deleteMany({
    where: { invoice: { userId: user.id } },
  });
  await prisma.invoice.deleteMany({
    where: { userId: user.id },
  });
  await prisma.client.deleteMany({
    where: { userId: user.id },
  });

  // 3. Create 4 realistic diverse clients
  const client1 = await prisma.client.create({
    data: {
      userId: user.id,
      name: 'Marcus Vance',
      company: 'Apex AI Software Inc.',
      email: 'marcus@apexai.dev',
      phone: '+1 (415) 890-1234',
      address: '500 Howard Street, Suite 400, San Francisco, CA 94105',
    },
  });

  const client2 = await prisma.client.create({
    data: {
      userId: user.id,
      name: 'Chloe Bennett',
      company: 'Blueberry Hill Coffee Roasters',
      email: 'chloe@blueberryhillcoffee.com',
      phone: '+1 (503) 441-9876',
      address: '1420 SE Belmont St, Portland, OR 97214',
    },
  });

  const client3 = await prisma.client.create({
    data: {
      userId: user.id,
      name: 'Julian Mercer',
      company: 'Lumina Lens Photography Agency',
      email: 'julian@luminalens.co',
      phone: '+1 (212) 670-3456',
      address: '240 West 35th Street, New York, NY 10001',
    },
  });

  const client4 = await prisma.client.create({
    data: {
      userId: user.id,
      name: 'Dr. Arthur Sterling',
      company: 'Vanguard Strategy Partners',
      email: 'arthur.sterling@vanguardstrategy.com',
      phone: '+1 (312) 555-7890',
      address: '100 S Wacker Dr, Suite 1800, Chicago, IL 60606',
    },
  });

  console.log('4 realistic clients created.');

  const now = new Date();

  // Helper to create dates relative to now
  const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  const daysFromNow = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  const monthsAgo = (months: number, day: number = 15) => {
    const d = new Date(now.getFullYear(), now.getMonth() - months, day);
    return d;
  };

  // 4. Invoices Seed Data:
  // - 4 PAID invoices (spread across past 5 months for the Recharts graph)
  // - 3 SENT outstanding invoices (due in future)
  // - 2 SENT overdue invoices (due in past)
  // - 2 DRAFT invoices

  const invoicesData = [
    // --- PAID INVOICES ---
    {
      invoiceNumber: 'INV-2026-0001',
      clientId: client1.id,
      status: 'PAID',
      issueDate: monthsAgo(5, 10),
      dueDate: monthsAgo(5, 24),
      paidAt: monthsAgo(5, 22),
      taxPercent: 5.0,
      discountPercent: 0,
      notes: 'Payment received in full via ACH Direct Deposit. Thank you!',
      publicToken: 'demo-paid-invoice-001',
      lineItems: [
        { description: 'Brand Identity Design & Typography System', quantity: 1, rate: 3500, sortOrder: 0 },
        { description: 'Design Tokens & UI Component Kit (Figma)', quantity: 1, rate: 1800, sortOrder: 1 },
      ],
    },
    {
      invoiceNumber: 'INV-2026-0002',
      clientId: client2.id,
      status: 'PAID',
      issueDate: monthsAgo(4, 5),
      dueDate: monthsAgo(4, 19),
      paidAt: monthsAgo(4, 18),
      taxPercent: 0,
      discountPercent: 10.0,
      notes: 'Custom coffee packaging illustrations and print production specs.',
      publicToken: 'demo-paid-invoice-002',
      lineItems: [
        { description: 'Seasonal Coffee Bag Packaging Illustrations (3 blends)', quantity: 3, rate: 850, sortOrder: 0 },
        { description: 'Menu Board Redesign & Vector Production Specs', quantity: 1, rate: 650, sortOrder: 1 },
      ],
    },
    {
      invoiceNumber: 'INV-2026-0003',
      clientId: client3.id,
      status: 'PAID',
      issueDate: monthsAgo(3, 12),
      dueDate: monthsAgo(3, 26),
      paidAt: monthsAgo(3, 25),
      taxPercent: 8.25,
      discountPercent: 0,
      notes: 'Agency portfolio site redesign & CMS integration.',
      publicToken: 'demo-paid-invoice-003',
      lineItems: [
        { description: 'Photography Portfolio Responsive Web Design', quantity: 1, rate: 4200, sortOrder: 0 },
        { description: 'High-Res Asset Image Optimization Pipeline', quantity: 1, rate: 900, sortOrder: 1 },
        { description: 'Search Engine Optimization & Core Web Vitals Audit', quantity: 1, rate: 600, sortOrder: 2 },
      ],
    },
    {
      invoiceNumber: 'INV-2026-0004',
      clientId: client4.id,
      status: 'PAID',
      issueDate: monthsAgo(1, 8),
      dueDate: monthsAgo(1, 22),
      paidAt: monthsAgo(1, 20),
      taxPercent: 0,
      discountPercent: 5.0,
      notes: 'Executive presentation deck & corporate annual report design.',
      publicToken: 'demo-paid-invoice-004',
      lineItems: [
        { description: 'Executive Strategy Keynote Presentation Deck (45 slides)', quantity: 1, rate: 3800, sortOrder: 0 },
        { description: 'Custom Data Visualization Infographics', quantity: 6, rate: 250, sortOrder: 1 },
      ],
    },

    // --- SENT OUTSTANDING INVOICES (Future Due Dates) ---
    {
      invoiceNumber: 'INV-2026-0005',
      clientId: client1.id,
      status: 'SENT',
      issueDate: daysAgo(5),
      dueDate: daysFromNow(9),
      paidAt: null,
      taxPercent: 5.0,
      discountPercent: 0,
      notes: 'Monthly UX design retainer for sprint cycles 24-26. Remit payment online.',
      publicToken: 'demo-sent-invoice-005',
      lineItems: [
        { description: 'Product Design Retainer (Sprint 24 & 25)', quantity: 40, rate: 95, sortOrder: 0 },
        { description: 'Interactive Prototype User Testing Sessions', quantity: 4, rate: 300, sortOrder: 1 },
      ],
    },
    {
      invoiceNumber: 'INV-2026-0006',
      clientId: client2.id,
      status: 'SENT',
      issueDate: daysAgo(2),
      dueDate: daysFromNow(12),
      paidAt: null,
      taxPercent: 0,
      discountPercent: 0,
      notes: 'E-commerce website upgrade and wholesale order form integration.',
      publicToken: 'demo-sent-invoice-006',
      lineItems: [
        { description: 'Shopify Storefront Redesign & Custom Theme', quantity: 1, rate: 2400, sortOrder: 0 },
        { description: 'Wholesale B2B Bulk Order Portal Integration', quantity: 1, rate: 850, sortOrder: 1 },
      ],
    },
    {
      invoiceNumber: 'INV-2026-0007',
      clientId: client3.id,
      status: 'SENT',
      issueDate: daysAgo(1),
      dueDate: daysFromNow(13),
      paidAt: null,
      taxPercent: 8.25,
      discountPercent: 0,
      notes: 'Commercial client gallery portal with private client proofing.',
      publicToken: 'demo-sent-invoice-007',
      lineItems: [
        { description: 'Private Client Proofing Gallery Architecture', quantity: 1, rate: 1950, sortOrder: 0 },
        { description: 'Client Approval Flow & Watermark Engine', quantity: 1, rate: 750, sortOrder: 1 },
      ],
    },

    // --- SENT OVERDUE INVOICES (Past Due Dates to demonstrate OVERDUE status) ---
    {
      invoiceNumber: 'INV-2026-0008',
      clientId: client4.id,
      status: 'SENT',
      issueDate: daysAgo(35),
      dueDate: daysAgo(7), // PAST DUE!
      paidAt: null,
      taxPercent: 0,
      discountPercent: 0,
      notes: 'OVERDUE NOTICE: Terms were Net 14. Please remit payment immediately via the online payment portal.',
      publicToken: 'demo-overdue-invoice-008',
      lineItems: [
        { description: 'Q1 Market Landscape Research & Graphic Synthesis', quantity: 1, rate: 2800, sortOrder: 0 },
        { description: 'Printed Executive Whitepaper Formatting & Pre-press', quantity: 1, rate: 950, sortOrder: 1 },
      ],
    },
    {
      invoiceNumber: 'INV-2026-0009',
      clientId: client2.id,
      status: 'SENT',
      issueDate: daysAgo(42),
      dueDate: daysAgo(14), // PAST DUE!
      paidAt: null,
      taxPercent: 0,
      discountPercent: 0,
      notes: 'OVERDUE: Cold brew summer marketing assets and retail merchandise decals.',
      publicToken: 'demo-overdue-invoice-009',
      lineItems: [
        { description: 'Cold Brew Can Wrap Design Variations', quantity: 2, rate: 600, sortOrder: 0 },
        { description: 'Apparel Merch Vector Illustrations & Color Separations', quantity: 2, rate: 450, sortOrder: 1 },
      ],
    },

    // --- DRAFT INVOICES ---
    {
      invoiceNumber: 'INV-2026-0010',
      clientId: client1.id,
      status: 'DRAFT',
      issueDate: now,
      dueDate: daysFromNow(14),
      paidAt: null,
      taxPercent: 5.0,
      discountPercent: 0,
      notes: 'Draft proposal for upcoming Mobile App Design System.',
      publicToken: 'demo-draft-invoice-010',
      lineItems: [
        { description: 'iOS & Android Native Design System Architecture', quantity: 1, rate: 4500, sortOrder: 0 },
      ],
    },
    {
      invoiceNumber: 'INV-2026-0011',
      clientId: client3.id,
      status: 'DRAFT',
      issueDate: now,
      dueDate: daysFromNow(30),
      paidAt: null,
      taxPercent: 8.25,
      discountPercent: 0,
      notes: 'Studio lighting equipment consulting and studio branding.',
      publicToken: 'demo-draft-invoice-011',
      lineItems: [
        { description: 'Lighting & Studio Layout Technical Consultation', quantity: 8, rate: 120, sortOrder: 0 },
        { description: 'Business Card & Letterhead Foil Stamp Specs', quantity: 1, rate: 450, sortOrder: 1 },
      ],
    },
  ];

  for (const invData of invoicesData) {
    const { lineItems, ...invoiceFields } = invData;
    await prisma.invoice.create({
      data: {
        ...invoiceFields,
        status: invData.status as any,
        userId: user.id,
        lineItems: {
          create: lineItems,
        },
      } as any,
    });
  }

  console.log(`Created ${invoicesData.length} invoices across all statuses.`);
  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
