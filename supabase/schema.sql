-- 1. Enable pgvector extension
create extension if not exists vector;

-- 2. Documents table
create table if not exists documents (
  id          bigserial primary key,
  source      text not null unique,   -- e.g. "skills", "project-rusmaktabi"
  content     text not null,
  embedding   vector(1536),           -- text-embedding-3-small dimension
  created_at  timestamptz default now()
);

-- 3. Vector similarity search function
create or replace function match_documents(
  query_embedding vector(1536),
  match_count     int     default 4,
  match_threshold float   default 0.5
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

-- 4. Index for fast ANN search (HNSW — работает с любым кол-вом строк)
create index if not exists documents_embedding_hnsw_idx
  on documents using hnsw (embedding vector_cosine_ops);
