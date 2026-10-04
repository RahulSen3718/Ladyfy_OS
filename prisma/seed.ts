import { PrismaClient, UserRole, EmployeeSubRole, ClientStatus, OrderStatus, ScriptStatus, CreatorStatus, AvailabilityStatus, ShootStatus, PipelineStatus, UrgencyStatus, TaskPriority, TaskStatus, PaymentStatus, PaymentMethod, ExpenseCategory, PayoutStatus, TicketPriority, TicketStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Leadyfy OS Production Database...");

  // Clean up existing records for fresh idempotency
  await prisma.videoFeedback.deleteMany();
  await prisma.creatorPayout.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.supportTicket.deleteMany();
  await prisma.task.deleteMany();
  await prisma.video.deleteMany();
  await prisma.shoot.deleteMany();
  await prisma.script.deleteMany();
  await prisma.creatorAvailability.deleteMany();
  await prisma.creator.deleteMany();
  await prisma.order.deleteMany();
  await prisma.client.deleteMany();
  await prisma.employee.deleteMany();

  // 1. Core Users
  const ownerUser = await prisma.user.upsert({
    where: { email: "owner@leadyfy.io" },
    update: {},
    create: {
      supabaseId: "sb-owner-001",
      email: "owner@leadyfy.io",
      fullName: "Super Admin (Owner)",
      phone: "+91 99000 00001",
      role: UserRole.OWNER,
      isActive: true,
    },
  });

  const salesUser = await prisma.user.upsert({
    where: { email: "aarav@leadyfy.io" },
    update: {},
    create: {
      supabaseId: "sb-sales-002",
      email: "aarav@leadyfy.io",
      fullName: "Aarav Sharma",
      phone: "+91 98100 00111",
      role: UserRole.EMPLOYEE,
      isActive: true,
    },
  });

  const writerUser = await prisma.user.upsert({
    where: { email: "devika@leadyfy.io" },
    update: {},
    create: {
      supabaseId: "sb-writer-003",
      email: "devika@leadyfy.io",
      fullName: "Devika Sen",
      phone: "+91 98100 00222",
      role: UserRole.EMPLOYEE,
      isActive: true,
    },
  });

  const shootManagerUser = await prisma.user.upsert({
    where: { email: "rahul@leadyfy.io" },
    update: {},
    create: {
      supabaseId: "sb-shoot-004",
      email: "rahul@leadyfy.io",
      fullName: "Rahul Varma",
      phone: "+91 98100 00333",
      role: UserRole.EMPLOYEE,
      isActive: true,
    },
  });

  const editorUser = await prisma.user.upsert({
    where: { email: "ankit@leadyfy.io" },
    update: {},
    create: {
      supabaseId: "sb-editor-005",
      email: "ankit@leadyfy.io",
      fullName: "Ankit Roy",
      phone: "+91 98100 00444",
      role: UserRole.EMPLOYEE,
      isActive: true,
    },
  });

  // 2. Employees
  const salesEmployee = await prisma.employee.upsert({
    where: { userId: salesUser.id },
    update: {},
    create: {
      userId: salesUser.id,
      subRole: EmployeeSubRole.SALES,
      salary: 65000,
      department: "Growth & Sales",
      performanceScore: 98.5,
    },
  });

  const writerEmployee = await prisma.employee.upsert({
    where: { userId: writerUser.id },
    update: {},
    create: {
      userId: writerUser.id,
      subRole: EmployeeSubRole.SCRIPT_WRITER,
      salary: 50000,
      department: "Creative Scripting",
      performanceScore: 96.0,
    },
  });

  const shootManagerEmployee = await prisma.employee.upsert({
    where: { userId: shootManagerUser.id },
    update: {},
    create: {
      userId: shootManagerUser.id,
      subRole: EmployeeSubRole.SHOOT_MANAGER,
      salary: 55000,
      department: "Production Logistics",
      performanceScore: 94.0,
    },
  });

  const editorEmployee = await prisma.employee.upsert({
    where: { userId: editorUser.id },
    update: {},
    create: {
      userId: editorUser.id,
      subRole: EmployeeSubRole.EDITOR,
      salary: 60000,
      department: "Post-Production",
      performanceScore: 99.0,
    },
  });

  // 3. Clients (Strict canonical companyName)
  const client1 = await prisma.client.upsert({
    where: { email: "rohan@zenithwear.com" },
    update: {},
    create: {
      clientName: "Rohan Varma",
      companyName: "Zenith Apparel Pvt Ltd",
      brandName: "Zenith Wear",
      email: "rohan@zenithwear.com",
      phone: "+91 98201 12345",
      whatsapp: "+91 98201 12345",
      industry: "E-Commerce / Fashion",
      gstTaxId: "27AABCU9603R1ZM",
      assignedEmployeeId: salesEmployee.id,
      source: "Inbound Marketing",
      status: ClientStatus.ACTIVE,
      brandKitUrl: "https://drive.google.com/drive/folders/zenith-brand-kit",
      notes: "Focus on Gen-Z gym wear reels & UGC hook videos with fast transitions.",
    },
  });

  const client2 = await prisma.client.upsert({
    where: { email: "ananya@glowskin.co" },
    update: {},
    create: {
      clientName: "Ananya Deshmukh",
      companyName: "GlowSkin Organics LLP",
      brandName: "GlowSkin Serum",
      email: "ananya@glowskin.co",
      phone: "+91 98110 54321",
      whatsapp: "+91 98110 54321",
      industry: "Beauty & Personal Care",
      gstTaxId: "27AABCG1234F1ZT",
      assignedEmployeeId: salesEmployee.id,
      source: "Referral",
      status: ClientStatus.ONBOARDING,
      brandKitUrl: "https://drive.google.com/drive/folders/glowskin-assets",
      notes: "Need aesthetic bathroom GRWM UGC videos.",
    },
  });

  // 4. Packages / Orders
  const order1 = await prisma.order.upsert({
    where: { orderNumber: "ORD-2026-001" },
    update: {},
    create: {
      orderNumber: "ORD-2026-001",
      clientId: client1.id,
      packageName: "15 UGC Reel Pack",
      contractedVideoCount: 15,
      completedVideoCount: 12,
      deliveredVideoCount: 10,
      pricing: 150000,
      gstRate: 18.0,
      totalAmount: 177000,
      amountReceived: 177000,
      outstandingBalance: 0,
      startDate: new Date("2026-09-01"),
      dueDate: new Date("2026-10-15"),
      status: OrderStatus.IN_PRODUCTION,
    },
  });

  // 5. Creators & Availability
  const creator1 = await prisma.creator.create({
    data: {
      name: "Priya Sharma",
      gender: "Female",
      ageGroup: "22-26",
      languages: ["English", "Hindi"],
      location: "Mumbai, Maharashtra",
      niches: ["Fitness", "Fashion", "Lifestyle"],
      demographics: "Tier 1 Urban Gen-Z & Millennial",
      contactPhone: "+91 98200 11223",
      contactEmail: "priya.creator@gmail.com",
      ratesPerVideo: 6500,
      bankUpiInfo: "priya@okhdfcbank",
      portfolioLinks: ["https://instagram.com/priyasharma.ugc"],
      rating: 4.9,
      status: CreatorStatus.ACTIVE,
    },
  });

  await prisma.creatorAvailability.create({
    data: {
      creatorId: creator1.id,
      date: new Date("2026-09-28"),
      timeSlot: "MORNING",
      status: AvailabilityStatus.BOOKED,
    },
  });

  // 6. Scripts
  const script1 = await prisma.script.create({
    data: {
      clientId: client1.id,
      orderId: order1.id,
      videoNumber: 1,
      title: "Oversized Heavyweight Gym Tee - UGC Hook #1",
      writerId: writerEmployee.id,
      creatorId: creator1.id,
      language: "English",
      scriptText: `[HOOK - 0:00-0:03]\n(Creator looks in gym mirror holding ordinary tee, sighs)\n"Stop buying gym shirts that shrink after one wash."\n\n[BODY - 0:03-0:15]\n(Cut to wearing Zenith 240GSM Oversized Tee)\n"This is Zenith's heavyweight drop. Pure breathable cotton, drop shoulder fit, zero sweat patches."\n\n[CTA - 0:15-0:20]\n"Hit the link below to grab the 3-pack bundle before restock sells out."`,
      referenceLinks: "https://tiktok.com/@example/gym-hook-1",
      deadline: new Date("2026-10-01"),
      revisionCount: 1,
      status: ScriptStatus.READY_FOR_SHOOT,
      clientComments: "Loved the hook! Approved for production.",
    },
  });

  // 7. Shoots
  const shoot1 = await prisma.shoot.create({
    data: {
      shootNumber: "SHT-2026-001",
      clientId: client1.id,
      orderId: order1.id,
      scheduledAt: new Date("2026-09-28T11:00:00"),
      durationHours: 4,
      location: "Studio A (Bandra West, Mumbai)",
      assignedCreatorId: creator1.id,
      cameramanName: "Vikram R.",
      shootManagerId: shootManagerEmployee.id,
      shootingAssistant: "Amit S.",
      status: ShootStatus.CONFIRMED,
      rawFootageFolderUrl: "https://drive.google.com/drive/folders/sht-001-raw",
      notes: "3 outfits change for oversized gym tees.",
    },
  });

  // 8. Videos in Pipeline
  const video1 = await prisma.video.create({
    data: {
      clientId: client1.id,
      orderId: order1.id,
      scriptId: script1.id,
      shootId: shoot1.id,
      creatorId: creator1.id,
      assignedEditorId: editorEmployee.id,
      title: "Heavyweight Gym Tee - UGC Hook #1",
      deadline: new Date(Date.now() - 24 * 60 * 60 * 1000), // Overdue
      pipelineStatus: PipelineStatus.VIDEO_EDITING,
      urgencyStatus: UrgencyStatus.OVERDUE,
      draftVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      revisionCount: 1,
    },
  });

  // 9. Video Feedback
  await prisma.videoFeedback.create({
    data: {
      videoId: video1.id,
      authorUserId: ownerUser.id,
      isClientFeedback: true,
      timestampInVideo: 4.5,
      comment: "The cut at 0:04 is great, but make the text overlay higher contrast.",
    },
  });

  // 10. Financials: Payments, Expenses, Creator Payouts
  await prisma.payment.create({
    data: {
      invoiceNumber: "INV-2026-041",
      clientId: client1.id,
      orderId: order1.id,
      invoiceAmount: 177000,
      amountReceived: 177000,
      pendingBalance: 0,
      paymentDate: new Date("2026-09-02"),
      paymentMethod: PaymentMethod.BANK_TRANSFER,
      transactionRef: "HDFC9823472394",
      status: PaymentStatus.PAID,
      notes: "Full payment upfront for 15 UGC pack.",
    },
  });

  await prisma.expense.create({
    data: {
      category: ExpenseCategory.STUDIO,
      amount: 25000,
      expenseDate: new Date("2026-09-12"),
      description: "Studio A Bandra full day booking + lighting equipment hire",
      receiptFileUrl: "https://drive.google.com/file/d/studio-receipt",
      loggedByUserId: ownerUser.id,
    },
  });

  await prisma.creatorPayout.create({
    data: {
      creatorId: creator1.id,
      orderId: order1.id,
      videoId: video1.id,
      videoCount: 4,
      contractedRate: 6500,
      totalPayoutAmount: 26000,
      paymentDate: new Date("2026-09-21"),
      transactionReference: "UPI-PAYOUT-84723",
      status: PayoutStatus.PAID,
      paidAt: new Date("2026-09-21"),
    },
  });

  // 11. Support Tickets
  await prisma.supportTicket.create({
    data: {
      ticketNumber: "TCK-2026-001",
      clientId: client1.id,
      createdById: ownerUser.id,
      subject: "Requested subtitle color adjustment on Reel #3",
      description: "Client requested white font with yellow drop shadow for better readability.",
      priority: TicketPriority.MEDIUM,
      status: TicketStatus.RESOLVED,
      resolvedAt: new Date(),
    },
  });

  console.log("✅ Leadyfy OS Database Seeded Successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
