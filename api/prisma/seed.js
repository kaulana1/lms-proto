const { PrismaClient, Role, EnrollmentRole, ModuleItemType } = require('@prisma/client')
const bcrypt = require('bcrypt')
const prisma = new PrismaClient()

async function main () {
  // ---- Tenant & School ------------------------------------------------------
  const tenant = await prisma.tenant.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Demo District'
    }
  })

  const school = await prisma.school.upsert({
    where: { id: '00000000-0000-0000-0000-000000000002' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000002',
      name: 'Central High',
      tenantId: tenant.id
    }
  })

  // ---- Users ----------------------------------------------------------------
  const passwordHash = bcrypt.hashSync('password123', 10)

  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@example.com' },
    update: {},
    create: {
      email: 'teacher@example.com',
      passwordHash,
      role: Role.TEACHER,
      tenantId: tenant.id,
      schoolId: school.id
    }
  })

  const student = await prisma.user.upsert({
    where: { email: 'student@example.com' },
    update: {},
    create: {
      email: 'student@example.com',
      passwordHash,
      role: Role.STUDENT,
      tenantId: tenant.id,
      schoolId: school.id
    }
  })

  // ---- Course, Section ------------------------------------------------------
  const course = await prisma.course.upsert({
    where: { id: '90c0770f-721f-4b3e-b93d-6e602f9c5b2d' },
    update: {},
    create: {
      id: '90c0770f-721f-4b3e-b93d-6e602f9c5b2d',
      title: 'Intro to Computer Science',
      tenantId: tenant.id,
      schoolId: school.id
    }
  })

  const section = await prisma.section.upsert({
    where: { id: 'e989dc48-818d-4350-9774-54ccee0aac34' },
    update: {},
    create: {
      id: 'e989dc48-818d-4350-9774-54ccee0aac34',
      courseId: course.id,
      name: 'Period 1'
    }
  })

  // ---- Enrollments (teacher & student) -------------------------------------
  await prisma.enrollment.upsert({
    where: { userId_sectionId: { userId: teacher.id, sectionId: section.id } },
    update: {},
    create: {
      userId: teacher.id,
      sectionId: section.id,
      role: EnrollmentRole.TEACHER
    }
  })

  await prisma.enrollment.upsert({
    where: { userId_sectionId: { userId: student.id, sectionId: section.id } },
    update: {},
    create: {
      userId: student.id,
      sectionId: section.id,
      role: EnrollmentRole.STUDENT
    }
  })

  // ---- Pages ----------------------------------------------------------------
  const welcome = await prisma.page.upsert({
    where: { id: '11111111-1111-1111-1111-111111111111' },
    update: {},
    create: {
      id: '11111111-1111-1111-1111-111111111111',
      courseId: course.id,
      title: 'Welcome',
      content: 'Welcome to the course!'
    }
  })

  const syllabus = await prisma.page.upsert({
    where: { id: '22222222-2222-2222-2222-222222222222' },
    update: {},
    create: {
      id: '22222222-2222-2222-2222-222222222222',
      courseId: course.id,
      title: 'Syllabus',
      content: 'Course syllabus and expectations.'
    }
  })

  // ---- Module that links to pages ------------------------------------------
  const module = await prisma.module.upsert({
    where: { id: '33333333-3333-3333-3333-333333333333' },
    update: {},
    create: {
      id: '33333333-3333-3333-3333-333333333333',
      courseId: course.id,
      title: 'Start Here'
    }
  })

  // ensure items exist
  const existingItems = await prisma.moduleItem.findMany({ where: { moduleId: module.id } })
  if (existingItems.length === 0) {
    await prisma.moduleItem.createMany({
      data: [
        { moduleId: module.id, type: ModuleItemType.PAGE, pageId: welcome.id, title: 'Welcome' },
        { moduleId: module.id, type: ModuleItemType.PAGE, pageId: syllabus.id, title: 'Syllabus' }
      ]
    })
  }

  // ---- One assignment in the SECTION (note: sectionId not courseId) --------
  const aTitle = 'HW 1: Algorithms'
  const aExists = await prisma.assignment.findFirst({
    where: { sectionId: section.id, title: aTitle }
  })
  let assignment = aExists
  if (!assignment) {
    assignment = await prisma.assignment.create({
      data: {
        sectionId: section.id,
        title: aTitle,
        body: 'Implement a simple algorithm and submit your answer.',
        dueAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // due in 2 days
      }
    })
  }

  // One student submission (optional demo data)
  const subExists = await prisma.submission.findFirst({
    where: { assignmentId: assignment.id, studentId: student.id }
  })
  if (!subExists) {
    await prisma.submission.create({
      data: {
        assignmentId: assignment.id,
        studentId: student.id,
        content: 'My algorithm runs in O(n log n).',
        score: 95
      }
    })
  }

  console.log('✅ Seed complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
