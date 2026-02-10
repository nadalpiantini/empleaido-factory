# 📦 FASE 4: EMPAQUETADO Y ENTREGA
**Sistema de packaging, deployment y delivery a usuarios**

---

## 🎯 Objetivos

- [x] Sistema de empaquetado de agentes
- [x] Generación de UI personalizada
- [x] Sistema de deployment automático
- [x] Gestión de dominios y branding
- [x] Sistema de actualizaciones
- [x] Métricas de uso integradas

---

## 📦 Sistema de Empaquetado

### Proceso de Packaging

```typescript
// src/services/packager.ts

import { AgenteCompuesto } from '@/types/agente';
import { generateUI } from './ui-generator';
import { deployToVercel } from './deployment';

export interface PaqueteAgente {
  id: string;
  agente: AgenteCompuesto;
  ui: UIGenerated;
  deployment: DeploymentConfig;
  docs: Documentacion;
  metadata: PackageMetadata;
}

export interface UIGenerated {
  type: 'chat' | 'dashboard' | 'hybrid';
  theme: ThemeConfig;
  components: ComponentConfig[];
  code: string; // Código Next.js generado
}

export interface DeploymentConfig {
  platform: 'vercel' | 'netlify' | 'custom';
  domain?: string;
  envVars: Record<string, string>;
  buildCommand: string;
}

export interface Documentacion {
  userGuide: string;
  apiReference: string;
  examples: string[];
}

export interface PackageMetadata {
  version: string;
  createdAt: string;
  size: number; // KB
  estimatedCosts: {
    monthly: number;
    perExecution: number;
  };
}

export class AgentePackager {
  async empaquetar(
    agenteConfig: AgenteCompuesto,
    opciones: PackageOptions
  ): Promise<PaqueteAgente> {
    // 1. Generar UI
    const ui = await this.generateUI(agenteConfig, opciones.ui);

    // 2. Configurar deployment
    const deployment = await this.configureDeployment(
      agenteConfig,
      opciones.deployment
    );

    // 3. Generar documentación
    const docs = await this.generateDocs(agenteConfig, ui);

    // 4. Calcular metadata
    const metadata = this.calculateMetadata(agenteConfig, ui, deployment);

    // 5. Crear paquete
    const paquete: PaqueteAgente = {
      id: opciones.id || `pkg-${Date.now()}`,
      agente: agenteConfig,
      ui,
      deployment,
      docs,
      metadata,
    };

    return paquete;
  }

  private async generateUI(
    agente: AgenteCompuesto,
    opciones: UIOptions
  ): Promise<UIGenerated> {
    // Generar código de UI basado en configuración
    const generator = new UIGenerator();
    return await generator.generate(agente, opciones);
  }

  private async configureDeployment(
    agente: AgenteCompuesto,
    opciones: DeploymentOptions
  ): Promise<DeploymentConfig> {
    const platform = opciones.platform || 'vercel';
    const domain = opciones.domain;

    // Variables de entorno necesarias
    const envVars = {
      NEXT_PUBLIC_AGENTE_ID: agente.id,
      NEXT_PUBLIC_AGENTE_NAME: agente.name,
      DATABASE_URL: process.env.DATABASE_URL!,
      OPENAI_API_KEY: process.env.OPENAI_API_KEY!,
      // ... otras vars
    };

    return {
      platform,
      domain,
      envVars,
      buildCommand: 'pnpm build',
    };
  }

  private async generateDocs(
    agente: AgenteCompuesto,
    ui: UIGenerated
  ): Promise<Documentacion> {
    const userGuide = this.generateUserGuide(agente, ui);
    const apiReference = this.generateAPIReference(agente);
    const examples = this.generateExamples(agente);

    return {
      userGuide,
      apiReference,
      examples,
    };
  }

  private calculateMetadata(
    agente: AgenteCompuesto,
    ui: UIGenerated,
    deployment: DeploymentConfig
  ): PackageMetadata {
    // Calcular tamaño aproximado
    const size = this.calculateSize(ui.code);

    // Estimar costos
    const estimatedCosts = this.estimateCosts(agente, deployment);

    return {
      version: '1.0.0',
      createdAt: new Date().toISOString(),
      size,
      estimatedCosts,
    };
  }

  private calculateSize(code: string): number {
    return Buffer.byteLength(code, 'utf8') / 1024; // KB
  }

  private estimateCosts(
    agente: AgenteCompuesto,
    deployment: DeploymentConfig
  ): PackageMetadata['estimatedCosts'] {
    // Costo base por ejecución (LLM tokens)
    const tokensPerExecution = agente.motores.length * 2000; // estimado
    const costPerToken = 0.00001; // ~$0.01 por 1M tokens
    const perExecution = tokensPerExecution * costPerToken;

    // Costo mensual (hosting + 1000 ejecuciones)
    const hostingCost = 20; // Vercel Pro
    const executionCost = perExecution * 1000;
    const monthly = hostingCost + executionCost;

    return {
      monthly,
      perExecution,
    };
  }

  private generateUserGuide(agente: AgenteCompuesto, ui: UIGenerated): string {
    return `
# Guía de Usuario: ${agente.name}

## ¿Qué es este agente?

${agente.description}

## Cómo usarlo

### 1. Primeros pasos
1. Abre la aplicación en tu navegador
2. Completa el onboarding inicial
3. Empieza a interactuar con el asistente

### 2. Funcionalidades principales
${agente.motores.map(m => `- ${m.motorId}`).join('\n')}

### 3. Ejemplos de uso
${agente.otros?.examples?.map((ex: any) => `- "${ex.input}"`).join('\n') || ''}

## Preguntas frecuentes

**¿Puedo usar este agente en mi teléfono?**
Sí, la aplicación es responsive y funciona en cualquier dispositivo.

**¿Mis datos están seguros?**
Sí, usamos encriptación de extremo a extremo y nunca compartimos tu información.

**¿Cómo puedo obtener soporte?**
Contacta a soporte@tudominio.com para cualquier consulta.
    `.trim();
  }

  private generateAPIReference(agente: AgenteCompuesto): string {
    return `
# API Reference

## Endpoint Principal

\`\`\`typescript
POST /api/chat
{
  "message": "tu mensaje aquí"
}
\`\`\`

## Respuesta

\`\`\`typescript
{
  "success": true,
  "output": "respuesta del agente",
  "tokensUsed": 1234,
  "cost": 0.0123
}
\`\`\`

## Webhooks

Configura webhooks para recibir notificaciones de eventos:

- \`agent.execution.completed\`
- \`agent.execution.failed\`
- \`agent.limit.reached\`
    `.trim();
  }

  private generateExamples(agente: AgenteCompuesto): string[] {
    return agente.motores.map(m => `
## Ejemplo con ${m.motorId}

Input: "Procesa esta factura"
Output: "Factura procesada correctamente"
    `);
  }
}
```

---

## 🎨 Generador de UI

```typescript
// src/services/ui-generator.ts

import { AgenteCompuesto } from '@/types/agente';

export interface UIOptions {
  type?: 'chat' | 'dashboard' | 'hybrid';
  theme?: 'light' | 'dark' | 'custom';
  colors?: Record<string, string>;
  logo?: string;
  branding?: boolean;
}

export class UIGenerator {
  async generate(
    agente: AgenteCompuesto,
    opciones: UIOptions = {}
  ): Promise<UIGenerated> {
    const type = opciones.type || 'chat';
    const theme = this.generateTheme(opciones);

    const components = this.generateComponents(agente, type);
    const code = this.generateCode(agente, type, theme, components);

    return {
      type,
      theme,
      components,
      code,
    };
  }

  private generateTheme(opciones: UIOptions): ThemeConfig {
    const colors = opciones.colors || this.getDefaultColors();
    const mode = opciones.theme || 'light';

    return {
      mode,
      colors,
      typography: {
        fontFamily: 'Inter, sans-serif',
        fontSize: '16px',
      },
      spacing: {
        unit: '8px',
      },
    };
  }

  private getDefaultColors(): Record<string, string> {
    return {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      background: '#ffffff',
      foreground: '#0f172a',
      accent: '#06b6d4',
      muted: '#f1f5f9',
      border: '#e2e8f0',
    };
  }

  private generateComponents(
    agente: AgenteCompuesto,
    type: string
  ): ComponentConfig[] {
    const components: ComponentConfig[] = [];

    // Componentes base
    components.push(
      {
        name: 'Header',
        type: 'layout',
        props: {
          title: agente.name,
          subtitle: agente.description,
          logo: true,
        },
      },
      {
        name: 'ChatInterface',
        type: 'feature',
        props: {
          placeholder: 'Escribe tu mensaje...',
          showTimestamp: true,
          showTypingIndicator: true,
        },
      }
    );

    // Componentes específicos por tipo
    if (type === 'dashboard') {
      components.push({
        name: 'Dashboard',
        type: 'feature',
        props: {
          showMetrics: true,
          showCharts: true,
          showHistory: true,
        },
      });
    }

    if (type === 'hybrid') {
      components.push({
        name: 'TabNavigation',
        type: 'layout',
        props: {
          tabs: ['Chat', 'Dashboard', 'Settings'],
        },
      });
    }

    return components;
  }

  private generateCode(
    agente: AgenteCompuesto,
    type: string,
    theme: ThemeConfig,
    components: ComponentConfig[]
  ): string {
    return `
// Generated by Agent Wrapping Platform
// Agent: ${agente.name}
// Type: ${type}
// Date: ${new Date().toISOString()}

import { ChatInterface } from '@/components/chat';
import { Dashboard } from '@/components/dashboard';
import { TabNavigation } from '@/components/tabs';

const theme = ${JSON.stringify(theme, null, 2)};

export default function App() {
  return (
    <div className="app" style={theme}>
      <Header
        title="${agente.name}"
        subtitle="${agente.description}"
      />
      ${this.renderComponents(components)}
    </div>
  );
}

${this.renderComponentImports(components)}
    `.trim();
  }

  private renderComponents(components: ComponentConfig[]): string {
    return components.map(comp => {
      const props = JSON.stringify(comp.props);
      return `<${comp.name} {...${props}} />`;
    }).join('\n      ');
  }

  private renderComponentImports(components: ComponentConfig[]): string {
    const uniqueComponents = [...new Set(components.map(c => c.name))];
    return uniqueComponents.map(name =>
      `import { ${name} } from '@/components/${name.toLowerCase()}';`
    ).join('\n');
  }
}
```

---

## 🚀 Sistema de Deployment

```typescript
// src/services/deployment.ts

import { exec } from 'child_process';
import { promisify } from 'util';
import { PaqueteAgente } from './packager';

const execAsync = promisify(exec);

export interface DeploymentResult {
  url: string;
  deployId: string;
  status: 'success' | 'failed';
  error?: string;
}

export class DeploymentService {
  async deploy(paquete: PaqueteAgente): Promise<DeploymentResult> {
    const platform = paquete.deployment.platform;

    switch (platform) {
      case 'vercel':
        return await this.deployToVercel(paquete);
      case 'netlify':
        return await this.deployToNetlify(paquete);
      default:
        throw new Error(`Plataforma no soportada: ${platform}`);
    }
  }

  private async deployToVercel(
    paquete: PaqueteAgente
  ): Promise<DeploymentResult> {
    try {
      // 1. Crear directorio temporal
      const tempDir = `/tmp/agent-${paquete.id}`;
      await execAsync(`mkdir -p ${tempDir}`);

      // 2. Escribir código generado
      await this.writeGeneratedCode(tempDir, paquete);

      // 3. Crear package.json
      await this.createPackageJson(tempDir, paquete);

      // 4. Deploy con Vercel CLI
      const { stdout } = await execAsync(
        `cd ${tempDir} && vercel --prod --yes --token=${process.env.VERCEL_TOKEN}`
      );

      // Extraer URL del output
      const urlMatch = stdout.match(/https?:\/\/[^\s]+/);
      const url = urlMatch ? urlMatch[0] : '';

      return {
        url,
        deployId: paquete.id,
        status: 'success',
      };
    } catch (error) {
      return {
        url: '',
        deployId: paquete.id,
        status: 'failed',
        error: error.message,
      };
    }
  }

  private async writeGeneratedCode(
    dir: string,
    paquete: PaqueteAgente
  ): Promise<void> {
    const fs = await import('fs/promises');

    // Estructura de directorios
    await fs.mkdir(`${dir}/src/app`, { recursive: true });
    await fs.mkdir(`${dir}/src/components`, { recursive: true });

    // Escribir archivos principales
    await fs.writeFile(`${dir}/src/app/page.tsx`, paquete.ui.code);
    await fs.writeFile(`${dir}/src/app/layout.tsx`, this.generateLayout(paquete));
    await fs.writeFile(`${dir}/src/app/globals.css`, this.generateStyles(paquete.ui.theme));

    // Escribir componentes
    for (const comp of paquete.ui.components) {
      const componentCode = this.generateComponentCode(comp);
      await fs.writeFile(`${dir}/src/components/${comp.name}.tsx`, componentCode);
    }
  }

  private async createPackageJson(
    dir: string,
    paquete: PaqueteAgente
  ): Promise<void> {
    const fs = await import('fs/promises');

    const packageJson = {
      name: paquete.agente.name.toLowerCase().replace(/\s+/g, '-'),
      version: paquete.metadata.version,
      private: true,
      scripts: {
        dev: 'next dev',
        build: paquete.deployment.buildCommand,
        start: 'next start',
      },
      dependencies: {
        next: '^14.0.0',
        react: '^18.0.0',
        'react-dom': '^18.0.0',
      },
      devDependencies: {
        '@types/node': '^20.0.0',
        '@types/react': '^18.0.0',
        typescript: '^5.0.0',
      },
    };

    await fs.writeFile(
      `${dir}/package.json`,
      JSON.stringify(packageJson, null, 2)
    );
  }

  private generateLayout(paquete: PaqueteAgente): string {
    return `
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '${paquete.agente.name}',
  description: '${paquete.agente.description}',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
    `.trim();
  }

  private generateStyles(theme: ThemeConfig): string {
    return `
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-primary: ${theme.colors.primary};
  --color-secondary: ${theme.colors.secondary};
  --color-background: ${theme.colors.background};
  --color-foreground: ${theme.colors.foreground};
}

body {
  font-family: ${theme.typography.fontFamily};
  font-size: ${theme.typography.fontSize};
  background: var(--color-background);
  color: var(--color-foreground);
}
    `.trim();
  }

  private generateComponentCode(comp: ComponentConfig): string {
    // Generar código del componente
    return `
export function ${comp.name}(props: any) {
  return (
    <div className="${comp.name.toLowerCase()}">
      {/* ${comp.name} component */}
    </div>
  );
}
    `.trim();
  }

  private async deployToNetlify(
    paquete: PaqueteAgente
  ): Promise<DeploymentResult> {
    // Implementación similar para Netlify
    throw new Error('No implementado aún');
  }
}
```

---

## ✅ Checklist FASE 4

### Empaquetado
- [ ] AgentePackager implementado
- [ ] Generación de UI automática
- [ ] Generación de documentación
- [ ] Cálculo de costos

### Deployment
- [ ] Deploy a Vercel funcional
- [ ] Deploy a Netlify (opcional)
- [ ] Configuración de dominios
- [ ] Variables de entorno

### UI Generation
- [ ] Chat UI generada
- [ ] Dashboard UI generada
- [ ] Theme personalizable
- [ ] Componentes modulares

---

**Siguiente fase**: `FASE_5_SERVICIO_CLIENTE.md` - Soporte y mantenimiento
