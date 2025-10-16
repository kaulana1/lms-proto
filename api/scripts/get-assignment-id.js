const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();
(async () => {
  const a = await db.assignment.findFirst({ select: { id: true, title: true } });
  if (a) console.error('Using assignment:', a.title, a.id);
  console.log(a?.id || '');
  await db.$disconnect();
})();
