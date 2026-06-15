import { supabaseAdmin } from "./supabase";
import { embed } from "./embeddings";

export interface DocChunk {
  id: number;
  content: string;
  source: string;
  similarity: number;
}

export async function searchKnowledgeBase(query: string, topK = 4): Promise<DocChunk[]> {
  const embedding = await embed(query);

  const { data, error } = await supabaseAdmin.rpc("match_documents", {
    query_embedding: embedding,
    match_count: topK,
    match_threshold: 0.3,
  });

  if (error) throw new Error(`Supabase RAG error: ${error.message}`);
  return (data ?? []) as DocChunk[];
}
