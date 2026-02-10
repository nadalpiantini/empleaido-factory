# 🛠️ FASE 5: SERVICIO POST-VENTA
**Sistema de soporte, mantenimiento y actualizaciones**

---

## 🎯 Objetivos

- [x] Sistema de tickets de soporte
- [x] Chatbot de soporte automatizado
- [x] Base de conocimiento
- [x] Sistema de actualizaciones automáticas
- [x] Monitoreo de salud de agentes
- [x] Feedback y roadmap

---

## 🎫 Sistema de Tickets

### Schema de Base de Datos

```sql
-- Tickets de soporte
CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  agent_id UUID REFERENCES user_agents(id),

  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL, -- bug, feature, question, billing
  priority TEXT DEFAULT 'normal', -- low, normal, high, urgent

  status TEXT DEFAULT 'open', -- open, in_progress, resolved, closed
  assigned_to UUID,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,

  -- SLA tracking
  sla_breach BOOLEAN DEFAULT false,
  first_response_at TIMESTAMPTZ,
);

-- Mensajes de tickets
CREATE TABLE ticket_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),

  message TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT false, -- Mensajes internos del equipo
  attachments JSONB,

  created_at TIMESTAMPTZ DEFAULT NOW(),
);

-- Base de conocimiento
CREATE TABLE knowledge_base_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,

  category TEXT,
  tags TEXT[],

  view_count INTEGER DEFAULT 0,
  helpful_count INTEGER DEFAULT 0,
  not_helpful_count INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,

  author_id UUID REFERENCES users(id),
  published BOOLEAN DEFAULT false,
);
```

### API de Tickets

```typescript
// src/server/trpc/router/support.ts

import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../../trpc';
import { supabase } from '@/lib/db';

export const supportRouter = createTRPCRouter({
  // Crear ticket
  create: protectedProcedure
    .input(z.object({
      title: z.string().min(5).max(200),
      description: z.string().min(20),
      category: z.enum(['bug', 'feature', 'question', 'billing']),
      priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
      agentId: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await supabase
        .from('support_tickets')
        .insert({
          user_id: ctx.userId,
          agent_id: input.agentId,
          title: input.title,
          description: input.description,
          category: input.category,
          priority: input.priority,
          status: 'open',
        })
        .select()
        .single();

      if (error) throw error;

      // Enviar notificación al equipo de soporte
      await notifySupportTeam(data);

      // Enviar confirmación al usuario
      await notifyUserTicketCreated(ctx.userId, data);

      return data;
    }),

  // Listar tickets del usuario
  list: protectedProcedure
    .input(z.object({
      status: z.string().optional(),
      limit: z.number().default(20),
    }))
    .query(async ({ ctx, input }) => {
      const query = supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', ctx.userId)
        .order('created_at', { ascending: false })
        .limit(input.limit);

      if (input.status) {
        query.eq('status', input.status);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data;
    }),

  // Obtener ticket con mensajes
  get: protectedProcedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      // Verificar que el ticket pertenezca al usuario
      const { data: ticket } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('id', input.id)
        .eq('user_id', ctx.userId)
        .single();

      if (!ticket) {
        throw new Error('Ticket no encontrado');
      }

      // Obtener mensajes
      const { data: messages } = await supabase
        .from('ticket_messages')
        .select('*')
        .eq('ticket_id', input.id)
        .order('created_at', { ascending: true });

      return {
        ticket,
        messages: messages || [],
      };
    }),

  // Agregar mensaje al ticket
  addMessage: protectedProcedure
    .input(z.object({
      ticketId: z.string(),
      message: z.string().min(1),
      isInternal: z.boolean().default(false),
    }))
    .mutation(async ({ ctx, input }) => {
      // Verificar ownership
      const { data: ticket } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('id', input.ticketId)
        .eq('user_id', ctx.userId)
        .single();

      if (!ticket) {
        throw new Error('Ticket no encontrado');
      }

      // Solo el equipo puede marcar mensajes como internos
      const isInternal = input.isInternal && ctx.userRole === 'admin';

      // Insertar mensaje
      const { data, error } = await supabase
        .from('ticket_messages')
        .insert({
          ticket_id: input.ticketId,
          user_id: ctx.userId,
          message: input.message,
          is_internal: isInternal,
        })
        .select()
        .single();

      if (error) throw error;

      // Actualizar timestamp del ticket
      await supabase
        .from('support_tickets')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', input.ticketId);

      // Notificar al usuario (si mensaje no es interno)
      if (!isInternal) {
        await notifyNewMessage(input.ticketId, data);
      }

      return data;
    }),

  // Marcar ticket como resuelto
  resolve: protectedProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await supabase
        .from('support_tickets')
        .update({
          status: 'resolved',
          resolved_at: new Date().toISOString(),
        })
        .eq('id', input.id)
        .eq('user_id', ctx.userId)
        .select()
        .single();

      if (error) throw error;

      // Pedir feedback al usuario
      await requestResolutionFeedback(ctx.userId, data);

      return data;
    }),
});
```

---

## 🤖 Chatbot de Soporte

```typescript
// src/services/support-chatbot.ts

import { openai } from '@/lib/llm';
import { supabase } from '@/lib/db';

export class SupportChatbot {
  async answerQuery(query: string, context?: any) {
    // 1. Buscar en base de conocimiento
    const relevantArticles = await this.searchKnowledgeBase(query);

    // 2. Buscar tickets similares resueltos
    const similarTickets = await this.searchSimilarTickets(query);

    // 3. Generar respuesta
    const response = await this.generateResponse(query, {
      articles: relevantArticles,
      tickets: similarTickets,
      context,
    });

    // 4. Si no hay respuesta buena, sugerir crear ticket
    if (response.confidence < 0.7) {
      response.suggestTicket = true;
    }

    return response;
  }

  private async searchKnowledgeBase(query: string) {
    // Búsqueda vectorial
    const embedding = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: query,
    });

    const { data } = await supabase.rpc('match_knowledge_articles', {
      query_embedding: embedding.data[0].embedding,
      match_threshold: 0.7,
      match_count: 3,
    });

    return data || [];
  }

  private async searchSimilarTickets(query: string) {
    const { data } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('status', 'resolved')
      .textSearch('description', query)
      .limit(3);

    return data || [];
  }

  private async generateResponse(
    query: string,
    context: {
      articles: any[];
      tickets: any[];
      context?: any;
    }
  ) {
    const systemPrompt = `Eres un asistente de soporte amable y útil.

TU ROL:
- Responder preguntas sobre la plataforma de agentes
- Ayudar a resolver problemas técnicos
- Sugerir soluciones basadas en el conocimiento disponible

BASE DE CONOCIMIENTO:
${context.articles.map(a => `- ${a.title}: ${a.content}`).join('\n')}

TICKETS SIMILARES:
${context.tickets.map(t => `- ${t.title}: ${t.description}`).join('\n')}

REGLAS:
- Si encuentras una respuesta relevante en la base de conocimiento, úsala
- Si no estás seguro, sugiere crear un ticket de soporte
- Sé específico y da ejemplos cuando sea posible
- Si el problema parece ser un bug, sugiere reportarlo`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: query },
      ],
      temperature: 0.3,
    });

    const answer = response.choices[0].message.content;

    return {
      answer,
      confidence: this.calculateConfidence(context),
      sources: {
        articles: context.articles.map(a => a.id),
        tickets: context.tickets.map(t => t.id),
      },
    };
  }

  private calculateConfidence(context: {
    articles: any[];
    tickets: any[];
  }): number {
    // Confianza basada en relevancia de fuentes
    const hasRelevantArticle = context.articles.length > 0;
    const hasSimilarTicket = context.tickets.length > 0;

    if (hasRelevantArticle) return 0.9;
    if (hasSimilarTicket) return 0.7;
    return 0.3;
  }
}
```

---

## 📚 Base de Conocimiento

### Sistema de Búsqueda Vectorial

```sql
-- Función para búsqueda vectorial
CREATE OR REPLACE FUNCTION match_knowledge_articles(
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
RETURNS TABLE(
  id uuid,
  title text,
  content text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    kb.id,
    kb.title,
    kb.content,
    1 - (kb.embedding <=> query_embedding) as similarity
  FROM knowledge_base_articles kb
  WHERE kb.published = true
    AND 1 - (kb.embedding <=> query_embedding) > match_threshold
  ORDER BY kb.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
```

### API de Knowledge Base

```typescript
// src/server/trpc/router/knowledge.ts

import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../../trpc';
import { supabase } from '@/lib/db';
import { openai } from '@/lib/llm';

export const knowledgeRouter = createTRPCRouter({
  // Buscar artículos
  search: publicProcedure
    .input(z.object({
      query: z.string().min(3),
      category: z.string().optional(),
    }))
    .query(async ({ input }) => {
      // Búsqueda híbrida: vectorial + texto
      const embedding = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: input.query,
      });

      const { data, error } = await supabase.rpc('match_knowledge_articles', {
        query_embedding: embedding.data[0].embedding,
        match_threshold: 0.5,
        match_count: 10,
      });

      if (error) throw error;

      // Filtrar por categoría si se especifica
      let results = data || [];
      if (input.category) {
        results = results.filter((r: any) => r.category === input.category);
      }

      // Incrementar view count
      for (const article of results) {
        await supabase
          .from('knowledge_base_articles')
          .update({ view_count: (article.view_count || 0) + 1 })
          .eq('id', article.id);
      }

      return results;
    }),

  // Obtener artículo por slug
  getBySlug: publicProcedure
    .input(z.object({
      slug: z.string(),
    }))
    .query(async ({ input }) => {
      const { data, error } = await supabase
        .from('knowledge_base_articles')
        .select('*')
        .eq('slug', input.slug)
        .eq('published', true)
        .single();

      if (error) throw error;

      // Incrementar view count
      await supabase
        .from('knowledge_base_articles')
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq('id', data.id);

      return data;
    }),

  // Marcar artículo como útil/no útil
  rateHelpfulness: publicProcedure
    .input(z.object({
      id: z.string(),
      helpful: z.boolean(),
    }))
    .mutation(async ({ input }) => {
      const column = input.helpful ? 'helpful_count' : 'not_helpful_count';

      const { data, error } = await supabase
        .from('knowledge_base_articles')
        .raw(`
          UPDATE knowledge_base_articles
          SET ${column} = ${column} + 1
          WHERE id = '${input.id}'
          RETURNING *
        `);

      if (error) throw error;

      return data;
    }),

  // Listar categorías
  listCategories: publicProcedure
    .query(async () => {
      const { data, error } = await supabase
        .from('knowledge_base_articles')
        .select('category')
        .eq('published', true);

      if (error) throw error;

      // Extraer categorías únicas
      const categories = [...new Set(data.map(d => d.category).filter(Boolean))];

      return categories;
    }),
});
```

---

## 🔄 Sistema de Actualizaciones

```typescript
// src/services/update-manager.ts

import { AgenteCompuesto } from '@/types/agente';
import { supabase } from '@/lib/db';
import { sendNotification } from '@/lib/notifications';

export interface UpdatePlan {
  version: string;
  type: 'major' | 'minor' | 'patch';
  description: string;
  changes: UpdateChange[];
  scheduledAt?: Date;
  requiresDowntime: boolean;
}

export interface UpdateChange {
  type: 'feature' | 'fix' | 'breaking' | 'performance';
  description: string;
}

export class UpdateManager {
  async createUpdatePlan(
    agenteId: string,
    plan: UpdatePlan
  ): Promise<void> {
    // Crear registro de actualización
    await supabase.from('agent_updates').insert({
      agent_id: agenteId,
      version: plan.version,
      type: plan.type,
      description: plan.description,
      changes: plan.changes,
      scheduled_at: plan.scheduledAt,
      requires_downtime: plan.requiresDowntime,
      status: 'scheduled',
    });

    // Notificar a usuarios afectados
    await this.notifyAffectedUsers(agenteId, plan);
  }

  async applyUpdate(agenteId: string, updateId: string): Promise<void> {
    // 1. Obtener plan de actualización
    const { data: update } = await supabase
      .from('agent_updates')
      .select('*')
      .eq('id', updateId)
      .single();

    if (!update) {
      throw new Error('Actualización no encontrada');
    }

    // 2. Si requiere downtime, notificar con anticipación
    if (update.requires_downtime) {
      await this.notifyDowntimeStart(agenteId);
    }

    // 3. Aplicar actualización
    try {
      // Backup de configuración actual
      const backup = await this.backupAgent(agenteId);

      // Aplicar cambios
      await this.applyChanges(agenteId, update.changes);

      // Marcar como completada
      await supabase
        .from('agent_updates')
        .update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq('id', updateId);

      // Notificar éxito
      await this.notifyUpdateComplete(agenteId, update);
    } catch (error) {
      // Rollback en caso de error
      await this.rollbackAgent(agenteId);
      await this.notifyUpdateFailed(agenteId, update, error);
      throw error;
    }
  }

  private async notifyAffectedUsers(
    agenteId: string,
    plan: UpdatePlan
  ): Promise<void> {
    // Obtener usuarios del agente
    const { data: users } = await supabase
      .from('user_agents')
      .select('user_id')
      .eq('id', agenteId);

    if (!users) return;

    // Enviar notificación a cada usuario
    for (const { user_id } of users) {
      await sendNotification(user_id, {
        type: 'agent_update_scheduled',
        title: `Actualización disponible para tu agente`,
        message: plan.description,
        data: {
          version: plan.version,
          type: plan.type,
          scheduledAt: plan.scheduledAt,
        },
      });
    }
  }

  private async backupAgent(agenteId: string): Promise<any> {
    const { data: agent } = await supabase
      .from('user_agents')
      .select('*')
      .eq('id', agenteId)
      .single();

    // Guardar backup
    await supabase.from('agent_backups').insert({
      agent_id: agenteId,
      config: agent.config,
      created_at: new Date().toISOString(),
    });

    return agent;
  }

  private async applyChanges(
    agenteId: string,
    changes: UpdateChange[]
  ): Promise<void> {
    for (const change of changes) {
      switch (change.type) {
        case 'feature':
          await this.applyFeature(agenteId, change);
          break;
        case 'fix':
          await this.applyFix(agenteId, change);
          break;
        case 'breaking':
          await this.applyBreakingChange(agenteId, change);
          break;
        case 'performance':
          await this.applyPerformanceImprovement(agenteId, change);
          break;
      }
    }
  }

  private async applyFeature(agenteId: string, change: UpdateChange): Promise<void> {
    // Implementar nueva funcionalidad
    // Esto depende de qué tipo de feature sea
  }

  private async applyFix(agenteId: string, change: UpdateChange): Promise<void> {
    // Aplicar fix
  }

  private async applyBreakingChange(agenteId: string, change: UpdateChange): Promise<void> {
    // Aplicar cambio breaking
  }

  private async applyPerformanceImprovement(agenteId: string, change: UpdateChange): Promise<void> {
    // Aplicar mejora de performance
  }

  private async rollbackAgent(agenteId: string): Promise<void> {
    // Obtener backup más reciente
    const { data: backup } = await supabase
      .from('agent_backups')
      .select('*')
      .eq('agent_id', agenteId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (backup) {
      // Restaurar configuración
      await supabase
        .from('user_agents')
        .update({ config: backup.config })
        .eq('id', agenteId);
    }
  }
}
```

---

## 📊 Monitoreo de Salud

```typescript
// src/services/health-monitor.ts

import { supabase } from '@/lib/db';
import { agenteEjecutor } from './agente-ejecutor';

export class HealthMonitor {
  async checkAgentHealth(agentId: string): Promise<HealthReport> {
    const checks: HealthCheck[] = [];

    // 1. Check de ejecución básica
    const executionCheck = await this.checkExecution(agentId);
    checks.push(executionCheck);

    // 2. Check de latencia
    const latencyCheck = await this.checkLatency(agentId);
    checks.push(latencyCheck);

    // 3. Check de errores
    const errorCheck = await this.checkErrors(agentId);
    checks.push(errorCheck);

    // 4. Check de costos
    const costCheck = await this.checkCosts(agentId);
    checks.push(costCheck);

    // Calcular salud general
    const overallHealth = this.calculateOverallHealth(checks);

    return {
      agentId,
      timestamp: new Date().toISOString(),
      overallHealth,
      checks,
    };
  }

  private async checkExecution(agentId: string): Promise<HealthCheck> {
    const { data, error } = await supabase
      .from('agent_executions')
      .select('status')
      .eq('agent_id', agentId)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()); // Últimas 24h

    if (error) {
      return {
        name: 'execution',
        status: 'unhealthy',
        message: error.message,
      };
    }

    const total = data.length;
    const successful = data.filter(d => d.status === 'completed').length;
    const successRate = total > 0 ? successful / total : 0;

    if (successRate >= 0.95) {
      return {
        name: 'execution',
        status: 'healthy',
        message: `Tasa de éxito: ${(successRate * 100).toFixed(1)}%`,
        metrics: { successRate, total },
      };
    } else if (successRate >= 0.8) {
      return {
        name: 'execution',
        status: 'warning',
        message: `Tasa de éxito: ${(successRate * 100).toFixed(1)}%`,
        metrics: { successRate, total },
      };
    } else {
      return {
        name: 'execution',
        status: 'unhealthy',
        message: `Tasa de éxito baja: ${(successRate * 100).toFixed(1)}%`,
        metrics: { successRate, total },
      };
    }
  }

  private async checkLatency(agentId: string): Promise<HealthCheck> {
    const { data } = await supabase
      .from('agent_executions')
      .select('created_at, completed_at')
      .eq('agent_id', agentId)
      .eq('status', 'completed')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })
      .limit(100);

    if (!data || data.length === 0) {
      return {
        name: 'latency',
        status: 'unknown',
        message: 'Sin datos suficientes',
      };
    }

    const latencies = data
      .map(d => {
        const created = new Date(d.created_at).getTime();
        const completed = new Date(d.completed_at!).getTime();
        return completed - created;
      })
      .filter(l => l > 0);

    const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;

    if (avgLatency < 5000) { // < 5s
      return {
        name: 'latency',
        status: 'healthy',
        message: `Latencia promedio: ${(avgLatency / 1000).toFixed(1)}s`,
        metrics: { avgLatency },
      };
    } else if (avgLatency < 15000) { // < 15s
      return {
        name: 'latency',
        status: 'warning',
        message: `Latencia promedio: ${(avgLatency / 1000).toFixed(1)}s`,
        metrics: { avgLatency },
      };
    } else {
      return {
        name: 'latency',
        status: 'unhealthy',
        message: `Latencia alta: ${(avgLatency / 1000).toFixed(1)}s`,
        metrics: { avgLatency },
      };
    }
  }

  private async checkErrors(agentId: string): Promise<HealthCheck> {
    const { data, error } = await supabase
      .from('agent_executions')
      .select('error')
      .eq('agent_id', agentId)
      .eq('status', 'failed')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (error) {
      return {
        name: 'errors',
        status: 'unhealthy',
        message: error.message,
      };
    }

    const errorCount = data?.length || 0;
    const commonErrors = this.getCommonErrors(data || []);

    if (errorCount === 0) {
      return {
        name: 'errors',
        status: 'healthy',
        message: 'Sin errores',
        metrics: { errorCount },
      };
    } else if (errorCount < 10) {
      return {
        name: 'errors',
        status: 'warning',
        message: `${errorCount} errores en 24h`,
        metrics: { errorCount, commonErrors },
      };
    } else {
      return {
        name: 'errors',
        status: 'unhealthy',
        message: `${errorCount} errores en 24h`,
        metrics: { errorCount, commonErrors },
      };
    }
  }

  private async checkCosts(agentId: string): Promise<HealthCheck> {
    const { data } = await supabase
      .from('agent_executions')
      .select('cost_usd')
      .eq('agent_id', agentId)
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()); // Últimos 30 días

    if (!data || data.length === 0) {
      return {
        name: 'costs',
        status: 'unknown',
        message: 'Sin datos suficientes',
      };
    }

    const totalCost = data.reduce((sum, d) => sum + (d.cost_usd?.toNumber() || 0), 0);

    // Umbral: $100/mes
    if (totalCost < 100) {
      return {
        name: 'costs',
        status: 'healthy',
        message: `Costo mensual: $${totalCost.toFixed(2)}`,
        metrics: { totalCost },
      };
    } else if (totalCost < 200) {
      return {
        name: 'costs',
        status: 'warning',
        message: `Costo mensual: $${totalCost.toFixed(2)}`,
        metrics: { totalCost },
      };
    } else {
      return {
        name: 'costs',
        status: 'unhealthy',
        message: `Costo mensual alto: $${totalCost.toFixed(2)}`,
        metrics: { totalCost },
      };
    }
  }

  private getCommonErrors(errors: any[]): Record<string, number> {
    const errorMap: Record<string, number> = {};

    for (const error of errors) {
      const message = error.error || 'Unknown error';
      errorMap[message] = (errorMap[message] || 0) + 1;
    }

    // Ordenar por frecuencia
    return Object.entries(errorMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .reduce((acc, [msg, count]) => ({ ...acc, [msg]: count }), {});
  }

  private calculateOverallHealth(checks: HealthCheck[]): 'healthy' | 'warning' | 'unhealthy' {
    if (checks.some(c => c.status === 'unhealthy')) {
      return 'unhealthy';
    } else if (checks.some(c => c.status === 'warning')) {
      return 'warning';
    } else {
      return 'healthy';
    }
  }
}

interface HealthReport {
  agentId: string;
  timestamp: string;
  overallHealth: 'healthy' | 'warning' | 'unhealthy';
  checks: HealthCheck[];
}

interface HealthCheck {
  name: string;
  status: 'healthy' | 'warning' | 'unhealthy' | 'unknown';
  message: string;
  metrics?: Record<string, any>;
}
```

---

## ✅ Checklist FASE 5

### Soporte
- [ ] Sistema de tickets funcional
- [ ] Chatbot de soporte
- [ ] Base de conocimiento
- [ ] Búsqueda vectorial

### Actualizaciones
- [ ] UpdateManager implementado
- [ ] Sistema de backups
- [ ] Rollback automático
- [ ] Notificaciones de actualizaciones

### Monitoreo
- [ ] HealthMonitor implementado
- [ ] Checks de ejecución
- [ ] Checks de latencia
- [ ] Checks de errores
- [ ] Checks de costos

---

**Siguiente fase**: `FASE_6_ESCALAMIENTO.md` - Optimización y crecimiento
