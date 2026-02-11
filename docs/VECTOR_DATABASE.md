# Vector Database Integration

## Overview

The empleaido-factory project now includes vector database capabilities using Supabase's pgvector extension. This enables semantic search functionality that can enhance the AI employees' ability to understand and respond to user queries.

## Features

1. **Knowledge Base Embeddings** - Store and search embeddings for Empleaido capabilities
2. **User Interaction Embeddings** - Personalize responses based on user interaction history
3. **Semantic Search Functions** - Built-in functions for similarity search
4. **HNWS Indexes** - Optimized indexes for fast vector similarity searches

## Database Schema

### ef_knowledge_embeddings

Stores embeddings for Empleaido knowledge base:

```sql
CREATE TABLE ef_knowledge_embeddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empleaido_id VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  embedding vector(1536),
  content_type VARCHAR(50),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### ef_user_interaction_embeddings

Stores embeddings for user interactions:

```sql
CREATE TABLE ef_user_interaction_embeddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  adoption_id UUID NOT NULL REFERENCES ef_adoptions(id) ON DELETE CASCADE,
  interaction_text TEXT NOT NULL,
  embedding vector(1536),
  interaction_type VARCHAR(50),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Search Functions

### search_knowledge_base

Search the knowledge base for similar content:

```sql
SELECT * FROM search_knowledge_base(
  query_embedding => '[...]', -- Your embedding vector
  p_empleaido_id => 'empleaido-04094', -- Optional Empleaido filter
  match_threshold => 0.7, -- Minimum similarity threshold
  match_count => 10 -- Number of results to return
);
```

### search_user_interactions

Search user interactions for personalization:

```sql
SELECT * FROM search_user_interactions(
  query_embedding => '[...]', -- Your embedding vector
  p_user_id => 'user-uuid', -- Required user ID
  match_threshold => 0.7, -- Minimum similarity threshold
  match_count => 10 -- Number of results to return
);
```

## Usage Examples

### Storing Knowledge Base Embeddings

```javascript
// Example of storing an embedding for an Empleaido skill
const { data, error } = await supabase
  .from('ef_knowledge_embeddings')
  .insert({
    empleaido_id: 'empleaido-04094',
    content: 'How to classify NCF documents for Dominican Republic tax purposes',
    embedding: [...], // Your embedding vector
    content_type: 'skill_description',
    metadata: {
      skill_id: 'clasificacion_ncf',
      category: 'tax_compliance'
    }
  });
```

### Performing Semantic Search

```javascript
// Example of performing semantic search
const { data, error } = await supabase
  .rpc('search_knowledge_base', {
    query_embedding: [...], // Your query embedding
    p_empleaido_id: 'empleaido-04094',
    match_threshold: 0.7,
    match_count: 5
  });
```

## Implementation Notes

1. **Embedding Dimension** - The schema assumes 1536-dimensional embeddings (OpenAI default)
2. **Index Types** - Uses HNSW indexes for efficient similarity search
3. **Row Level Security** - User interaction embeddings are protected by RLS
4. **Automatic Updates** - The `updated_at` column is automatically maintained

## Migration

The vector database schema is implemented in the migration file:
`supabase/migrations/20260210_vector_extension.sql`

To apply the migration:
```bash
supabase db push
```

## Future Enhancements

1. **Dynamic Embedding Generation** - Automatically generate embeddings from content
2. **Embedding Cache** - Cache frequently accessed embeddings
3. **Advanced Search** - Implement hybrid search combining vector and keyword search
4. **Personalization Engine** - Use user interaction embeddings to customize responses