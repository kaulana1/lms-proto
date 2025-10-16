const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();
(async () => {
  const c = await db.course.findFirst({ select: { id: true, name: true } });
  if (c) console.error('Using course:', c.name, c.id);
  console.log(c?.id || '');
  await db.$disconnect();
})();
