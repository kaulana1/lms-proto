-- Ensure pgvector exists (no-op if already installed)
CREATE EXTENSION IF NOT EXISTS vector;

-- Embeddings per Page (one row per page)
-- Using TEXT ids because your Prisma schema uses String IDs
CREATE TABLE IF NOT EXISTS page_embeddings (
  page_id   TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  embedding VECTOR(384) NOT NULL,
  CONSTRAINT fk_page FOREIGN KEY (page_id) REFERENCES "Page"(id) ON DELETE CASCADE
);

-- RLS: only rows for the current session tenant are visible/insertable
ALTER TABLE page_embeddings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tenant_isolation_page_embeddings ON page_embeddings;

CREATE POLICY tenant_isolation_page_embeddings
  ON page_embeddings
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));

-- ANN index for fast search (L2 distance); adjust lists if you like
CREATE INDEX IF NOT EXISTS page_embeddings_embedding_idx
  ON page_embeddings USING ivfflat (embedding vector_l2_ops) WITH (lists = 50);
