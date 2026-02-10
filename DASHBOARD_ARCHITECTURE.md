# 📊 Dashboard System Architecture

**Status**: ✅ CORE IMPLEMENTED - Database schema pending

## Components Implemented

### 1. Main Dashboard (`/dashboard`)
- ✅ Stats overview (empleaidos, level, confianza, tareas)
- ✅ Quick actions (adoptar, virtual office, actividad)
- ✅ My empleaidos preview cards
- ✅ Responsive layout

### 2. My Empleaidos (`/dashboard/empleaidos`)
- ✅ Detailed empleaido cards
- ✅ Life stats visualization (Level, XP, Confidence)
- ✅ Action buttons (ver perfil, virtual office, configurar, pausar)
- ✅ Grid layout

### 3. Billing (`/dashboard/billing`)
- ✅ Payment methods section
- ✅ Payment history display
- ✅ Invoices placeholder
- ⚠️ TODO: Connect to actual payment records

### 4. Settings (`/dashboard/settings`)
- ✅ Notifications preferences
- ✅ Communication preferences
- ✅ Account management
- ⚠️ TODO: Connect to user preferences DB

### 5. Activity (`/dashboard/activity`)
- ✅ Filters UI (empleaido, action type, date range)
- ✅ Mock activity list
- ⚠️ TODO: Implement ef_empleaido_events table

## Database Schema Required

```sql
-- User Preferences
CREATE TABLE ef_user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  language VARCHAR(10) DEFAULT 'es',
  communication_style VARCHAR(20) DEFAULT 'balanced',
  notification_email BOOLEAN DEFAULT true,
  notification_weekly_summary BOOLEAN DEFAULT true,
  notification_achievements BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Empleaido Events (Activity Log)
CREATE TABLE ef_empleaido_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  adoption_id UUID REFERENCES ef_adoptions(id),
  empleaido_id VARCHAR(50),
  event_type VARCHAR(50), -- 'skill_execution', 'conversation', 'level_up', etc.
  skill_name VARCHAR(100),
  input_data JSONB,
  output_data JSONB,
  success BOOLEAN,
  xp_gained INTEGER DEFAULT 0,
  trust_gained DECIMAL(3,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Onboarding States
CREATE TABLE ef_onboarding_states (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  adoption_id UUID REFERENCES ef_adoptions(id) UNIQUE,
  user_id UUID REFERENCES auth.users(id),
  empleaido_id VARCHAR(50),
  current_phase VARCHAR(50) DEFAULT 'phase_1_awakening',
  messages_in_phase INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  user_preferences JSONB,
  bootstrap_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_empleaido_events_user_id ON ef_empleaido_events(user_id);
CREATE INDEX idx_empleaido_events_created_at ON ef_empleaido_events(created_at DESC);
CREATE INDEX idx_onboarding_adoption_id ON ef_onboarding_states(adoption_id);
```

## Next Steps

1. **Database Migration**: Run schema updates
2. **Activity Tracking**: Implement event logging in skill executions
3. **Settings Persistence**: Connect to user_preferences table
4. **Real-time Updates**: Add WebSocket/SSE for live activity
5. **Invoices**: Generate PDF invoices after payments

## Features Working

✅ View all empleaidos
✅ Check life stats
✅ Navigate to virtual office
✅ Access billing history
✅ Configure notifications
✅ Filter activity

## TODO for Full Self-Service

- [ ] Pause/Resume adoption
- [ ] Cancel subscription
- [ ] Upgrade/unlock skills
- [ ] Export activity data
- [ ] Download invoices as PDF
- [ ] In-app notification center
