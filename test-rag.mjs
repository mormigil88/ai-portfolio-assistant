import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8').split('\n')
    .filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => [l.split('=')[0].trim(), l.split('=').slice(1).join('=').trim()])
);

const openai = new OpenAI({apiKey: env.OPENAI_API_KEY});
const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const res = await openai.embeddings.create({model: 'text-embedding-3-small', input: 'What AI projects has Andrey built?'});
const emb = res.data[0].embedding;
const {data, error} = await sb.rpc('match_documents', {query_embedding: emb, match_count: 4, match_threshold: 0.3});
if (error) { console.log('ERROR:', JSON.stringify(error)); process.exit(1); }
console.log('RAG results:', data?.length ?? 0);
(data||[]).forEach(d => console.log(' -', d.source, d.similarity.toFixed(3)));
