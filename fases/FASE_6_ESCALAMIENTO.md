# 📈 FASE 6: ESCALADO Y OPTIMIZACIÓN
**Sistema de growth, optimización de costos y auto-scaling**

---

## 🎯 Objetivos

- [x] Optimización de costos de LLM
- [x] Caching inteligente
- [x] Sistema de colas para tareas pesadas
- [x] Auto-scaling de infraestructura
- [x] Growth hacks y virality
- [x] Sistema de referrals

---

## 💰 Optimización de Costos

### Estrategias de Reducción de Tokens

```typescript
// src/services/token-optimizer.ts

export class TokenOptimizer {
  /**
   * Comprime el prompt del sistema manteniendo efectividad
   */
  compressSystemPrompt(prompt: string): string {
    // 1. Eliminar redundancias
    let compressed = this.removeRedundancy(prompt);

    // 2. Simplificar instrucciones
    compressed = this.simplifyInstructions(compressed);

    // 3. Usar abreviaciones donde sea posible
    compressed = this.useAbbreviations(compressed);

    return compressed;
  }

  private removeRedundancy(prompt: string): string {
    // Eliminar frases repetidas
    const lines = prompt.split('\n');
    const uniqueLines = [...new Set(lines)];
    return uniqueLines.join('\n');
  }

  private simplifyInstructions(prompt: string): string {
    // Simplificar lenguaje manteniendo significado
    return prompt
      .replace(/Por favor,? /gi, '')
      .replace(/Es importante que /gi, '')
      .replace(/Ten en cuenta que /gi, '')
      .replace(/Asegúrate de /gi, '')
      .replace(/Quisiera pedirte que /gi, '');
  }

  private useAbbreviations(prompt: string): string {
    // Abreviaciones comunes que no afectan理解
    return prompt
      .replace(/información/gi, 'info')
      .replace(/descripción/gi, 'desc')
      .replace(/configuración/gi, 'config')
      .replace(/documento/gi, 'doc')
      .replace(/respuesta/gi, 'resp');
  }

  /**
   * Selecciona el modelo óptimo según la tarea
   */
  selectOptimalModel(task: {
    complexity: 'low' | 'medium' | 'high';
    requiresReasoning: boolean;
    maxTokens: number;
  }): { model: string; costPer1kTokens: number } {
    // Para tareas simples: GPT-3.5
    if (task.complexity === 'low' && !task.requiresReasoning) {
      return {
        model: 'gpt-3.5-turbo',
        costPer1kTokens: 0.0005,
      };
    }

    // Para tareas medias sin razonamiento complejo: GPT-4-mini
    if (task.complexity === 'medium' && !task.requiresReasoning) {
      return {
        model: 'gpt-4-turbo',
        costPer1kTokens: 0.01,
      };
    }

    // Para tareas complejas o que requieren razonamiento: GPT-4 o Claude Sonnet
    if (task.complexity === 'high' || task.requiresReasoning) {
      // Comparar precios
      const gpt4Cost = 0.03;
      const claudeCost = 0.003;

      if (claudeCost < gpt4Cost) {
        return {
          model: 'claude-sonnet',
          costPer1kTokens: claudeCost,
        };
      }

      return {
        model: 'gpt-4',
        costPer1kTokens: gpt4Cost,
      };
    }

    // Default
    return {
      model: 'gpt-3.5-turbo',
      costPer1kTokens: 0.0005,
    };
  }

  /**
   * Implementa batching para reducir llamadas a la API
   */
  batchRequests<T, R>(
    requests: T[],
    batchProcessor: (batch: T[]) => Promise<R[]>,
    batchSize: number = 10
  ): Promise<R[]> {
    const batches: T[][] = [];

    // Dividir en batches
    for (let i = 0; i < requests.length; i += batchSize) {
      batches.push(requests.slice(i, i + batchSize));
    }

    // Procesar batches en paralelo
    return Promise.all(
      batches.map(batch => batchProcessor(batch))
    ).then(results => results.flat());
  }

  /**
   * Estima el costo de una operación antes de ejecutarla
   */
  estimateCost(
    prompt: string,
    model: string,
    expectedOutputTokens?: number
  ): { inputTokens: number; estimatedCost: number } {
    // Estimar tokens de input (4 caracteres ≈ 1 token)
    const inputTokens = Math.ceil(prompt.length / 4);

    // Estimar tokens de output (si no se proporciona)
    const outputTokens = expectedOutputTokens || Math.ceil(inputTokens * 0.75);

    // Obtener precio del modelo
    const prices: Record<string, { input: number; output: number }> = {
      'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 },
      'gpt-4-turbo': { input: 0.01, output: 0.03 },
      'gpt-4': { input: 0.03, output: 0.06 },
      'claude-sonnet': { input: 0.003, output: 0.015 },
    };

    const price = prices[model] || prices['gpt-3.5-turbo'];

    // Calcular costo
    const inputCost = (inputTokens / 1000) * price.input;
    const outputCost = (outputTokens / 1000) * price.output;
    const totalCost = inputCost + outputCost;

    return {
      inputTokens,
      estimatedCost: totalCost,
    };
  }
}
```

---

## 🗄️ Caching Inteligente

```typescript
// src/services/smart-cache.ts

import { redis } from '@/lib/cache';
import { hashString } from '@/lib/utils';

export class SmartCache {
  /**
   * Cache con invalidación automática basada en cambios
   */
  async getOrCompute<T>(
    key: string,
    compute: () => Promise<T>,
    options: {
      ttl?: number; // Tiempo de vida en segundos
      dependencies?: string[]; // Claves que dependen
    } = {}
  ): Promise<T> {
    const { ttl = 3600, dependencies = [] } = options;

    // Intentar obtener del cache
    const cached = await redis.get(key);
    if (cached) {
      return JSON.parse(cached) as T;
    }

    // Computar valor
    const value = await compute();

    // Guardar en cache
    await redis.setex(key, ttl, JSON.stringify(value));

    // Registrar dependencias
    if (dependencies.length > 0) {
      await this.registerDependencies(key, dependencies);
    }

    return value;
  }

  /**
   * Invalida cache basado en dependencias
   */
  async invalidate(dependencyKey: string): Promise<void> {
    // Obtener todas las keys que dependen de esta
    const dependentKeys = await this.getDependentKeys(dependencyKey);

    // Invalidar todas
    for (const key of dependentKeys) {
      await redis.del(key);
    }

    // Limpiar registro de dependencias
    await redis.del(`deps:${dependencyKey}`);
  }

  /**
   * Cache de respuestas de LLM con semantic matching
   */
  async cacheLLMResponse(
    prompt: string,
    response: string,
    options: {
      ttl?: number;
      category?: string;
    } = {}
  ): Promise<void> {
    const { ttl = 86400 } = options; // 24 horas default

    // Generar key semántica (hash del prompt)
    const key = `llm:${hashString(prompt)}`;

    // Guardar respuesta
    await redis.setex(key, ttl, response);

    // Si hay categoría, agregar a índice
    if (options.category) {
      await redis.sadd(`llm:category:${options.category}`, key);
    }
  }

  /**
   * Busca respuesta cacheada semanticamente similar
   */
  async getCachedLLMResponse(
    prompt: string,
    threshold: number = 0.85
  ): Promise<string | null> {
    const key = `llm:${hashString(prompt)}`;
    const cached = await redis.get(key);

    if (cached) {
      return cached;
    }

    // TODO: Implementar búsqueda semántica con embeddings
    return null;
  }

  /**
   * Cache predictivo: pre-calcula resultados probables
   */
  async predictiveCache(
    pattern: string,
    predictFn: () => Promise<any[]>
  ): Promise<void> {
    // Identificar patrones de uso
    const frequency = await this.getPatternFrequency(pattern);

    // Si el patrón es frecuente, pre-calcular
    if (frequency > 10) {
      const predictions = await predictFn();

      // Cache predicciones
      for (const prediction of predictions) {
        const key = `pred:${pattern}:${hashString(JSON.stringify(prediction.input))}`;
        await redis.setex(key, 1800, JSON.stringify(prediction.output)); // 30 min
      }
    }
  }

  private async registerDependencies(
    key: string,
    dependencies: string[]
  ): Promise<void> {
    for (const dep of dependencies) {
      await redis.sadd(`deps:${dep}`, key);
    }
  }

  private async getDependentKeys(dependencyKey: string): Promise<string[]> {
    const members = await redis.smembers(`deps:${dependencyKey}`);
    return members || [];
  }

  private async getPatternFrequency(pattern: string): Promise<number> {
    const key = `pattern:${pattern}:freq`;
    const freq = await redis.get(key);
    return parseInt(freq || '0', 10);
  }

  /**
   * Warm-up: pre-cargar cache con datos frecuentes
   */
  async warmup(patterns: Array<{
    key: string;
    compute: () => Promise<any>;
    ttl?: number;
  }>): Promise<void> {
    await Promise.all(
      patterns.map(({ key, compute, ttl }) =>
        this.getOrCompute(key, compute, { ttl })
      )
    );
  }
}

export const smartCache = new SmartCache();
```

---

## 📦 Sistema de Colas

```typescript
// src/services/queue.ts

import { Queue, Worker, Job } from 'bullmq';
import { redis } from '@/lib/cache';

export class TaskQueue {
  private queue: Queue;

  constructor(name: string) {
    this.queue = new Queue(name, {
      connection: redis,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: 100,
        removeOnFail: 500,
      },
    });

    this.startWorkers();
  }

  /**
   * Agrega tarea a la cola
   */
  async add<T>(
    name: string,
    data: T,
    options?: {
      priority?: number;
      delay?: number;
    }
  ): Promise<Job<T>> {
    return await this.queue.add(name, data, {
      priority: options?.priority || 0,
      delay: options?.delay || 0,
    });
  }

  /**
   * Procesa lote de tareas en paralelo
   */
  async addBulk<T>(jobs: Array<{ name: string; data: T }>): Promise<Job<T>[]> {
    return await this.queue.addBulk(
      jobs.map(job => ({
        name: job.name,
        data: job.data,
        opts: {},
      }))
    );
  }

  /**
   * Inicia workers para procesar tareas
   */
  private startWorkers(): void {
    // Worker para ejecución de agentes
    const agentWorker = new Worker(
      this.queue.name,
      async (job: Job) => {
        return await this.processAgentExecution(job);
      },
      { connection: redis, concurrency: 5 }
    );

    agentWorker.on('completed', (job: Job) => {
      console.log(`Job ${job.id} completado`);
    });

    agentWorker.on('failed', (job: Job | undefined, error: Error) => {
      console.error(`Job ${job?.id} falló:`, error);
    });
  }

  private async processAgentExecution(job: Job): Promise<any> {
    const { agentId, input } = job.data;

    // Ejecutar agente
    const result = await agenteEjecutor.ejecutar(agentId, input);

    return result;
  }

  /**
   * Obtiene estadísticas de la cola
   */
  async getStats(): Promise<{
    waiting: number;
    active: number;
    completed: number;
    failed: number;
  }> {
    const counts = await this.queue.getJobCounts();

    return {
      waiting: counts.waiting || 0,
      active: counts.active || 0,
      completed: counts.completed || 0,
      failed: counts.failed || 0,
    };
  }
}

// Instancias de colas especializadas
export const agentQueue = new TaskQueue('agents');
export const reportQueue = new TaskQueue('reports');
export const notificationQueue = new TaskQueue('notifications');
```

---

## 📊 Auto-Scaling

```typescript
// src/services/auto-scaler.ts

import { supabase } from '@/lib/db';
import { vercel } from '@vercel/sdk';

export class AutoScaler {
  /**
   * Escala horizontalmente basado en carga
   */
  async scaleBasedOnLoad(): Promise<void> {
    const metrics = await this.getLoadMetrics();

    // CPU usage > 70% → escalar
    if (metrics.cpu > 70) {
      await this.scaleUp('cpu');
    }

    // Memory usage > 80% → escalar
    if (metrics.memory > 80) {
      await this.scaleUp('memory');
    }

    // Request queue length > 100 → escalar
    if (metrics.queueLength > 100) {
      await this.scaleUp('queue');
    }

    // Si está bajo uso, escalar hacia abajo
    if (metrics.cpu < 20 && metrics.memory < 30 && metrics.queueLength < 10) {
      await this.scaleDown();
    }
  }

  /**
   * Escala hacia arriba (más instancias)
   */
  private async scaleUp(reason: string): Promise<void> {
    const currentInstances = await this.getCurrentInstanceCount();
    const targetInstances = Math.min(currentInstances + 1, 10); // Max 10

    console.log(`Escalando hacia arriba (${reason}): ${currentInstances} → ${targetInstances}`);

    await this.setInstanceCount(targetInstances);
  }

  /**
   * Escala hacia abajo (menos instancias)
   */
  private async scaleDown(): Promise<void> {
    const currentInstances = await this.getCurrentInstanceCount();
    const targetInstances = Math.max(currentInstances - 1, 1); // Min 1

    console.log(`Escalando hacia abajo: ${currentInstances} → ${targetInstances}`);

    await this.setInstanceCount(targetInstances);
  }

  private async getCurrentInstanceCount(): Promise<number> {
    // Obtener conteo actual de Vercel
    const deployment = await vercel.deployments.getCurrent();
    return deployment?.scaling?.min || 1;
  }

  private async setInstanceCount(count: number): Promise<void> {
    // Configurar en Vercel
    await vercel.projects.update({
      scaling: {
        min: count,
        max: count * 2,
      },
    });
  }

  private async getLoadMetrics(): Promise<{
    cpu: number;
    memory: number;
    queueLength: number;
  }> {
    // Obtener métricas de Vercel Analytics
    const analytics = await vercel.analytics.getMetrics({
      from: new Date(Date.now() - 5 * 60 * 1000), // Últimos 5 min
      to: new Date(),
    });

    return {
      cpu: analytics.cpu || 0,
      memory: analytics.memory || 0,
      queueLength: await this.getQueueLength(),
    };
  }

  private async getQueueLength(): Promise<number> {
    const stats = await agentQueue.getStats();
    return stats.waiting + stats.active;
  }

  /**
   * Predicción de carga: escala proactivamente
   */
  async predictiveScaling(): Promise<void> {
    const historicalData = await this.getHistoricalLoad();
    const prediction = this.predictLoad(historicalData);

    if (prediction.expectedLoad > 70) {
      console.log('Alta carga esperada, escalando proactivamente');
      await this.scaleUp('predictive');
    }
  }

  private async getHistoricalLoad(): Promise<number[]> {
    // Obtener datos históricos de los últimos 7 días
    const data = await supabase
      .from('load_metrics')
      .select('cpu')
      .gte('timestamp', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order('timestamp', { ascending: true });

    return data.data?.map(d => d.cpu) || [];
  }

  private predictLoad(historicalData: number[]): {
    expectedLoad: number;
    confidence: number;
  } {
    // Promedio móvil simple
    const windowSize = Math.min(24, historicalData.length); // Últimas 24 horas
    const recent = historicalData.slice(-windowSize);
    const average = recent.reduce((a, b) => a + b, 0) / recent.length;

    // Desviación estándar como medida de confianza
    const variance = recent.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / recent.length;
    const stdDev = Math.sqrt(variance);
    const confidence = Math.max(0, 1 - stdDev / 100);

    return {
      expectedLoad: average,
      confidence,
    };
  }
}

export const autoScaler = new AutoScaler();
```

---

## 🚀 Growth Hacks

```typescript
// src/services/growth-engine.ts

/**
 * Sistema de referrals
 */
export class ReferralSystem {
  async createReferralCode(userId: string): Promise<string> {
    const code = this.generateCode();

    await supabase.from('referral_codes').insert({
      user_id: userId,
      code,
      created_at: new Date().toISOString(),
    });

    return code;
  }

  async applyReferral(referralCode: string, newUserId: string): Promise<void> {
    // Obtener código de referral
    const { data: referral } = await supabase
      .from('referral_codes')
      .select('*')
      .eq('code', referralCode)
      .single();

    if (!referral) {
      throw new Error('Código de referral inválido');
    }

    // Registrar uso
    await supabase.from('referral_uses').insert({
      referral_id: referral.id,
      referred_user_id: newUserId,
      created_at: new Date().toISOString(),
    });

    // Dar beneficios a ambos
    await this.grantReferralBenefits(referral.user_id, newUserId);
  }

  private async grantReferralBenefits(
    referrerId: string,
    refereeId: string
  ): Promise<void> {
    // 1 mes gratis para el referido
    await this.grantFreeMonth(refereeId);

    // 1 mes gratis para el referente
    await this.grantFreeMonth(referrerId);
  }

  private async grantFreeMonth(userId: string): Promise<void> {
    // Implementar lógica de giving free month
  }

  private generateCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
}

/**
 * Sistema de gamification
 */
export class GamificationSystem {
  async awardAchievement(userId: string, achievementId: string): Promise<void> {
    // Verificar si ya tiene el logro
    const { data: existing } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', userId)
      .eq('achievement_id', achievementId)
      .single();

    if (existing) return;

    // Otorgar logro
    await supabase.from('user_achievements').insert({
      user_id: userId,
      achievement_id: achievementId,
      earned_at: new Date().toISOString(),
    });

    // Verificar si desbloquea nuevos logros
    await this.checkAchievementUnlocks(userId, achievementId);
  }

  async getUserPoints(userId: string): Promise<number> {
    const { data } = await supabase
      .from('user_achievements')
      .select('achievement_id')
      .eq('user_id', userId);

    if (!data) return 0;

    // Sumar puntos de todos los logros
    let total = 0;
    for (const achievement of data) {
      const points = await this.getAchievementPoints(achievement.achievement_id);
      total += points;
    }

    return total;
  }

  private async getAchievementPoints(achievementId: string): Promise<number> {
    const { data } = await supabase
      .from('achievements')
      .select('points')
      .eq('id', achievementId)
      .single();

    return data?.points || 0;
  }

  private async checkAchievementUnlocks(
    userId: string,
    newAchievementId: string
  ): Promise<void> {
    // Verificar si hay logros que se desbloquean con este logro
    const { data } = await supabase
      .from('achievement_dependencies')
      .select('unlocks_achievement_id')
      .eq('required_achievement_id', newAchievementId);

    if (!data) return;

    // Para cada logro desbloqueado, verificar si se cumple
    for (const dep of data) {
      const unlocked = await this.canUnlockAchievement(userId, dep.unlocks_achievement_id);
      if (unlocked) {
        await this.awardAchievement(userId, dep.unlocks_achievement_id);
      }
    }
  }

  private async canUnlockAchievement(
    userId: string,
    achievementId: string
  ): Promise<boolean> {
    // Obtener requisitos del logro
    const { data: achievement } = await supabase
      .from('achievements')
      .select('*')
      .eq('id', achievementId)
      .single();

    if (!achievement) return false;

    // Verificar todos los requisitos
    for (const req of achievement.requirements || []) {
      const met = await this.checkRequirement(userId, req);
      if (!met) return false;
    }

    return true;
  }

  private async checkRequirement(
    userId: string,
    requirement: any
  ): Promise<boolean> {
    switch (requirement.type) {
      case 'agent_executions':
        const { count: executions } = await supabase
          .from('agent_executions')
          .select('*', { count: 'exact', head: true })
          .eq('agent.user_id', userId);

        return executions >= requirement.value;

      case 'days_active':
        // Implementar lógica de días activo
        return false;

      default:
        return false;
    }
  }
}

export const referralSystem = new ReferralSystem();
export const gamificationSystem = new GamificationSystem();
```

---

## ✅ Checklist FASE 6

### Optimización de Costos
- [ ] TokenOptimizer implementado
- [ ] Compresión de prompts
- [ ] Selección óptima de modelos
- [ ] Batching de requests
- [ ] Estimación de costos

### Caching
- [ ] SmartCache implementado
- [ ] Cache de respuestas LLM
- [ ] Cache predictivo
- [ ] Invalidación inteligente
- [ ] Warm-up de cache

### Colas
- [ ] TaskQueue implementado
- [ ] Workers para agents
- [ ] Workers para reports
- [ ] Workers para notifications
- [ ] Sistema de prioridades

### Auto-Scaling
- [ ] AutoScaler implementado
- [ ] Escalado por CPU
- [ ] Escalado por memoria
- [ ] Escalado predictivo
- [ ] Reglas de scale-down

### Growth
- [ ] Sistema de referrals
- [ ] Gamification
- [ ] Logros y puntos
- [ ] Notificaciones de logros

---

## 📊 Métricas de Éxito del Fase 6

```yaml
costos:
  objetivo: "Reducir costo por ejecución en 50%"
  metricas:
    - "Tokens por request < 2000"
    - "Cache hit rate > 60%"
    - "Costo por 1000 ejecuciones < $1"

performance:
  objetivo: "Mejorar tiempo de respuesta en 30%"
  metricas:
    - "Latencia P50 < 2s"
    - "Latencia P95 < 5s"
    - "Queue time < 1s"

escalabilidad:
  objetivo: "Soportar 10x más usuarios"
  metricas:
    - "Requests/segundo > 100"
    - "Uptime > 99.9%"
    - "Auto-scaling activo"

growth:
  objetivo: "Aumentar usuarios en 5x"
  metricas:
    - "Tasa de referrals > 20%"
    - "Viral coefficient > 1.2"
    - "Engagement score > 0.7"
```

---

**Fin del Plan de Implementación**

Todas las fases están completas. Puedes comenzar la implementación ejecutando:
```bash
cd ~/agent-wrapping-plan
./scripts/setup.sh
```
