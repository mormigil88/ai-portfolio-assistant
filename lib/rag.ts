import { supabaseAdmin } from "./supabase";

export interface DocChunk {
  id: number;
  content: string;
  source: string;
  similarity: number;
}

// Full-table fetch — works without vector search for small knowledge bases
export async function searchKnowledgeBase(_query: string): Promise<DocChunk[]> {
  const { data, error } = await supabaseAdmin
    .from("documents")
    .select("id, content, source");

  if (error) throw new Error(`Supabase RAG error: ${error.message}`);
  return (data ?? []).map((row) => ({ ...row, similarity: 1 })) as DocChunk[];
}
