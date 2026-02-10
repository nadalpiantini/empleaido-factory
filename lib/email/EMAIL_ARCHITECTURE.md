# 📧 Email System Architecture

**Status**: ROADMAP READY - Email service pending

## Email Types

### 1. Welcome Email
**Trigger**: After successful spawn
**Template**: `emails/welcome.html`
**Service**: `lib/email/welcome.ts`

### 2. Onboarding Reminders
**Trigger**: Day 3, 7 if onboarding incomplete
**Template**: `emails/onboarding-reminder.html`

### 3. Weekly Summary
**Trigger**: Every Sunday 6pm
**Content**: XP gained, level up, tasks completed

### 4. Payment Confirmation
**Trigger**: After successful payment
**Content**: Receipt, invoice PDF

## Implementation

### File: `lib/email/welcome.ts`

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(userId: string, empleaidoId: string) {
  const empleaidoName = getEmpleaidoName(empleaidoId);

  await resend.emails.send({
    from: 'Empleaido Factory <welcome@empleaido.factory>',
    to: getUserEmail(userId), // Fetch from DB
    subject: `🎉 ${empleaidoName} está listo para trabajar`,
    html: welcomeTemplate({ empleaidoName, userId }),
  });
}
```

## Email Service Options

### Option 1: Resend (Recommended)
```bash
npm install resend
```
- **Pros**: Modern API, great DX, React support
- **Cons**: Newer service
- **Pricing**: Free tier available

### Option 2: SendGrid
```bash
npm install @sendgrid/mail
```
- **Pros**: Established, reliable
- **Cons**: More complex setup
- **Pricing**: Free tier available

### Option 3: AWS SES
- **Pros**: Cheap at scale
- **Cons**: Complex setup, strict sandbox

## Templates

### Welcome Email Structure

```html
<h1>¡Bienvenido al equipo!</h1>
<p>Tu empleaido <strong>{{empleaidoName}}</strong> ha sido activado.</p>

<h2>¿Qué sigue?</h2>
<ol>
  <li>Conoce a tu empleaido - Visita Virtual Office</li>
  <li>Primera conversación - Inicia onboarding</li>
  <li>Configura preferencias - Personaliza estilo</li>
</ol>

<a href="{{dashboardUrl}}">Ir a mi Dashboard</a>
<a href="{{virtualOfficeUrl}}">Visitar Virtual Office</a>
```

## Environment Variables

```bash
# Resend
RESEND_API_KEY=re_xxxxx

# SendGrid (alternative)
SENDGRID_API_KEY=SG.xxxxx

# Email configuration
EMAIL_FROM=noreply@empleaido.factory
EMAIL_FROM_NAME=Empleaido Factory
```

## Database Schema

```sql
CREATE TABLE ef_email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  email_type VARCHAR(50) NOT NULL,
  subject TEXT,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'sent',
  error_message TEXT
);
```

## Testing

```typescript
// Test email sending
await sendWelcomeEmail('test-user-123', 'SERA');

// Verify email received
// Check inbox for welcome email
```

## TODO

- [ ] Choose email provider (Resend recommended)
- [ ] Install dependencies
- [ ] Create HTML templates
- [ ] Implement sendWelcomeEmail()
- [ ] Create email logging system
- [ ] Test email delivery
- [ ] Add unsubscribe link (required by CAN-SPAM)
- [ ] Set up email domain (DNS records)
