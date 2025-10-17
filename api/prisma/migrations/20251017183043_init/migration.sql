/*
  Warnings:

  - You are about to drop the column `courseId` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the column `grade` on the `Submission` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,sectionId]` on the table `Enrollment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sectionId` to the `Assignment` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `role` on the `Enrollment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."EnrollmentRole" AS ENUM ('STUDENT', 'TEACHER');

-- CreateEnum
CREATE TYPE "public"."ModuleItemType" AS ENUM ('PAGE', 'ASSIGNMENT', 'EXTERNAL_LINK');

-- CreateEnum
CREATE TYPE "public"."VariantType" AS ENUM ('BASE', 'LEVEL_EASY', 'ELL', 'LEVEL_CHALLENGE', 'IEP');

-- CreateEnum
CREATE TYPE "public"."ActionKind" AS ENUM ('WEAK_STANDARD', 'LATE_SUBMISSIONS', 'WORKLOAD_SPIKE');

DROP POLICY IF EXISTS tenant_isolation_assignment ON "Assignment";

-- AlterEnum
ALTER TYPE "public"."Role" ADD VALUE 'ADMIN';

-- DropForeignKey
ALTER TABLE "public"."Assignment" DROP CONSTRAINT "Assignment_courseId_fkey";

-- AlterTable
ALTER TABLE "public"."Assignment" DROP COLUMN "courseId",
ADD COLUMN     "body" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "sectionId" TEXT NOT NULL,
ALTER COLUMN "dueAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Course" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."Enrollment" DROP COLUMN "role",
ADD COLUMN     "role" "public"."EnrollmentRole" NOT NULL;

-- AlterTable
ALTER TABLE "public"."Page" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "content" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Submission" DROP COLUMN "grade",
ADD COLUMN     "content" TEXT,
ADD COLUMN     "score" INTEGER;

-- AlterTable
ALTER TABLE "public"."Tenant" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "public"."Module" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ModuleItem" (
    "id" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "type" "public"."ModuleItemType" NOT NULL,
    "pageId" TEXT,
    "assignmentId" TEXT,
    "title" TEXT,

    CONSTRAINT "ModuleItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AssignmentVariant" (
    "id" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "type" "public"."VariantType" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssignmentVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SupportEvent" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "assignmentVariantId" TEXT,
    "reason" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SupportEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ActionCard" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "kind" "public"."ActionKind" NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "ActionCard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Enrollment_userId_sectionId_key" ON "public"."Enrollment"("userId", "sectionId");

-- AddForeignKey
ALTER TABLE "public"."Assignment" ADD CONSTRAINT "Assignment_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "public"."Section"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Module" ADD CONSTRAINT "Module_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ModuleItem" ADD CONSTRAINT "ModuleItem_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "public"."Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ModuleItem" ADD CONSTRAINT "ModuleItem_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "public"."Page"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ModuleItem" ADD CONSTRAINT "ModuleItem_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "public"."Assignment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AssignmentVariant" ADD CONSTRAINT "AssignmentVariant_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "public"."Assignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SupportEvent" ADD CONSTRAINT "SupportEvent_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SupportEvent" ADD CONSTRAINT "SupportEvent_assignmentVariantId_fkey" FOREIGN KEY ("assignmentVariantId") REFERENCES "public"."AssignmentVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SupportEvent" ADD CONSTRAINT "SupportEvent_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ActionCard" ADD CONSTRAINT "ActionCard_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
