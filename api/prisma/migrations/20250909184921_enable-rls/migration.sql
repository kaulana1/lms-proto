-- Enable pgvector if not already
CREATE EXTENSION IF NOT EXISTS vector;

-- Turn on RLS for tenant-scoped tables
ALTER TABLE "Tenant"      ENABLE ROW LEVEL SECURITY;
ALTER TABLE "School"      ENABLE ROW LEVEL SECURITY;
ALTER TABLE "User"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Course"      ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Section"     ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Enrollment"  ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Page"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Assignment"  ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Submission"  ENABLE ROW LEVEL SECURITY;

-- Drop old policies if they exist (idempotent)
DROP POLICY IF EXISTS tenant_isolation_tenant     ON "Tenant";
DROP POLICY IF EXISTS tenant_isolation_school     ON "School";
DROP POLICY IF EXISTS tenant_isolation_user       ON "User";
DROP POLICY IF EXISTS tenant_isolation_course     ON "Course";
DROP POLICY IF EXISTS tenant_isolation_section    ON "Section";
DROP POLICY IF EXISTS tenant_isolation_enrollment ON "Enrollment";
DROP POLICY IF EXISTS tenant_isolation_page       ON "Page";
DROP POLICY IF EXISTS tenant_isolation_assignment ON "Assignment";
DROP POLICY IF EXISTS tenant_isolation_submission ON "Submission";

-- Compare TEXT to TEXT using current_setting(..., true)  (returns TEXT or NULL)
CREATE POLICY tenant_isolation_tenant
  ON "Tenant"
  USING (id = current_setting('app.tenant_id', true));

CREATE POLICY tenant_isolation_school
  ON "School"
  USING ("tenantId" = current_setting('app.tenant_id', true));

CREATE POLICY tenant_isolation_user
  ON "User"
  USING ("tenantId" = current_setting('app.tenant_id', true));

CREATE POLICY tenant_isolation_course
  ON "Course"
  USING ("tenantId" = current_setting('app.tenant_id', true));

CREATE POLICY tenant_isolation_section
  ON "Section"
  USING (
    "courseId" IN (
      SELECT id FROM "Course"
      WHERE "tenantId" = current_setting('app.tenant_id', true)
    )
  );

CREATE POLICY tenant_isolation_enrollment
  ON "Enrollment"
  USING (
    "sectionId" IN (
      SELECT s.id
      FROM "Section" s
      JOIN "Course" c ON c.id = s."courseId"
      WHERE c."tenantId" = current_setting('app.tenant_id', true)
    )
  );

CREATE POLICY tenant_isolation_page
  ON "Page"
  USING (
    "courseId" IN (
      SELECT id FROM "Course"
      WHERE "tenantId" = current_setting('app.tenant_id', true)
    )
  );

CREATE POLICY tenant_isolation_assignment
  ON "Assignment"
  USING (
    "courseId" IN (
      SELECT id FROM "Course"
      WHERE "tenantId" = current_setting('app.tenant_id', true)
    )
  );

CREATE POLICY tenant_isolation_submission
  ON "Submission"
  USING (
    "studentId" IN (
      SELECT id FROM "User"
      WHERE "tenantId" = current_setting('app.tenant_id', true)
    )
  );
