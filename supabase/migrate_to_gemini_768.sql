-- Migration: switch from OpenAI 1536-dim to Gemini 768-dim embeddings
-- Run this in Supabase Dashboard → SQL Editor

-- 1. Drop old index
drop index if exists documents_embedding_hnsw_idx;

-- 2. Re-create embedding column with 768 dims
alter table documents drop column if exists embedding;
alter table documents add column embedding vector(768);

-- 3. Update match_documents function
create or replace function match_documents(
  query_embedding vector(768),
  match_count     int     default 4,
  match_threshold float   default 0.3
)
returns table (
  id         bigint,
  content    text,
  source     text,
  similarity float
)
language sql stable
as $$
  select
    id,
    content,
    source,
    1 - (embedding <=> query_embedding) as similarity
  from documents
  where 1 - (embedding <=> query_embedding) > match_threshold
  order by embedding <=> query_embedding
  limit match_count;
$$;

-- 4. Recreate HNSW index
create index if not exists documents_embedding_hnsw_idx
  on documents using hnsw (embedding vector_cosine_ops);
