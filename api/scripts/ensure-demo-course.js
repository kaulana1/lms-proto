const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();
(async () => {
  try {
    let course = await db.course.findFirst({ select: { id: true, title: true } });
    if (!course) {
      const tenant = await db.tenant.upsert({
        where: { id: '00000000-0000-0000-0000-000000000001' },
        update: {},
        create: { id: '00000000-0000-0000-000000000001', name: 'Demo District' },
        select: { id: true }
      });
      const school = await db.school.upsert({
        where: { id: '00000000-0000-0000-0000-000000000002' },
        update: {},
        create: { id: '00000000-0000-0000-000000000002', name: 'Demo High', tenantId: tenant.id },
        select: { id: true }
      });
      course = await db.course.create({
        data: { title: 'K-12 LMS Demo', tenantId: tenant.id, schoolId: school.id },
        select: { id: true, title: true }
      });
      console.error('Created demo course:', course.title, course.id);
    } else {
      console.error('Existing course:', course.title, course.id);
    }
    process.stdout.write(course.id);
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
})();
JScat > scripts/ensure-demo-course.js <<'JS'
const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();
(async () => {
  try {
    let course = await db.course.findFirst({ select: { id: true, title: true } });
    if (!course) {
      const tenant = await db.tenant.upsert({
        where: { id: '00000000-0000-0000-0000-000000000001' },
        update: {},
        create: { id: '00000000-0000-0000-000000000001', name: 'Demo District' },
        select: { id: true }
      });
      const school = await db.school.upsert({
        where: { id: '00000000-0000-0000-0000-000000000002' },
        update: {},
        create: { id: '00000000-0000-0000-000000000002', name: 'Demo High', tenantId: tenant.id },
        select: { id: true }
      });
      course = await db.course.create({
        data: { title: 'K-12 LMS Demo', tenantId: tenant.id, schoolId: school.id },
        select: { id: true, title: true }
      });
      console.error('Created demo course:', course.title, course.id);
    } else {
      console.error('Existing course:', course.title, course.id);
    }
    process.stdout.write(course.id);
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
})();
