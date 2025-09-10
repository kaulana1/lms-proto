const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')
const prisma = new PrismaClient()

async function main () {
  // --- Tenant & School (idempotent-ish) ---
  const tenant = await prisma.tenant.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: { id: '00000000-0000-0000-0000-000000000001', name: 'Demo District' }
  })

  let school = await prisma.school.findFirst({ where: { name: 'Demo High School', tenantId: tenant.id } })
  if (!school) {
    school = await prisma.school.create({ data: { name: 'Demo High School', tenantId: tenant.id } })
  }

  // --- Users (teacher + 5 students) ---
  const hash = await bcrypt.hash('password123', 10)

  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@example.com' },
    update: {},
    create: {
      email: 'teacher@example.com',
      passwordHash: hash,
      role: 'TEACHER',
      tenantId: tenant.id,
      schoolId: school.id
    }
  })

  const students = []
  for (let i = 1; i <= 5; i++) {
    const s = await prisma.user.upsert({
      where: { email: `student${i}@example.com` },
      update: {},
      create: {
        email: `student${i}@example.com`,
        passwordHash: hash,
        role: 'STUDENT',
        tenantId: tenant.id,
        schoolId: school.id
      }
    })
    students.push(s)
  }

  // --- Course / Section ---
  let course = await prisma.course.findFirst({
    where: { title: 'Intro to Computer Science', tenantId: tenant.id }
  })
  if (!course) {
    course = await prisma.course.create({
      data: { title: 'Intro to Computer Science', tenantId: tenant.id, schoolId: school.id }
    })
  }

  let section = await prisma.section.findFirst({ where: { courseId: course.id, name: 'Period 1' } })
  if (!section) {
    section = await prisma.section.create({ data: { name: 'Period 1', courseId: course.id } })
  }

  // --- Enrollments (ensure exists) ---
  const ensureEnroll = async (userId, role) => {
    const exists = await prisma.enrollment.findFirst({ where: { userId, sectionId: section.id, role } })
    if (!exists) await prisma.enrollment.create({ data: { userId, sectionId: section.id, role } })
  }
  await ensureEnroll(teacher.id, 'TEACHER')
  for (const s of students) await ensureEnroll(s.id, 'STUDENT')

  // --- Pages (create if missing) ---
  const wantPages = [
    { title: 'Welcome',  content: 'Welcome to the course!' },
    { title: 'Syllabus', content: 'Course overview and policies.' }
  ]
  for (const p of wantPages) {
    const exists = await prisma.page.findFirst({ where: { courseId: course.id, title: p.title } })
    if (!exists) await prisma.page.create({ data: { ...p, courseId: course.id } })
  }

  // --- One assignment (create if missing) ---
  const aTitle = 'HW 1: Algorithms'
  const aExists = await prisma.assignment.findFirst({ where: { courseId: course.id, title: aTitle } })
  if (!aExists) {
    await prisma.assignment.create({
      data: { title: aTitle, dueAt: new Date(Date.now() + 7 * 24 * 3600 * 1000), courseId: course.id }
    })
  }

  console.log('✅ Seed complete.')
}

main().catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())

