-- CreateEnum
CREATE TYPE "public"."KpiEventType" AS ENUM ('ASSIGNMENT_SUBMITTED', 'QUIZ_CORRECT', 'QUIZ_TOTAL', 'PRACTICE_SESSION');

-- CreateTable
CREATE TABLE "public"."KpiEvent" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "sectionId" TEXT,
    "type" "public"."KpiEventType" NOT NULL,
    "value" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KpiEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."KpiSnapshot" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "assignmentsDone" INTEGER NOT NULL DEFAULT 0,
    "assignmentsTotal" INTEGER NOT NULL DEFAULT 0,
    "comprehensionHit" INTEGER NOT NULL DEFAULT 0,
    "comprehensionTot" INTEGER NOT NULL DEFAULT 0,
    "practiceDays7" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KpiSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "KpiEvent_studentId_courseId_createdAt_idx" ON "public"."KpiEvent"("studentId", "courseId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "KpiSnapshot_studentId_courseId_key" ON "public"."KpiSnapshot"("studentId", "courseId");
