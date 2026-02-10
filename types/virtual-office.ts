// Virtual Office Types for Empleaido Factory

export interface ChatMessage {
  id: string;
  sender: 'user' | 'empleaido' | 'system';
  content: string;
  timestamp: Date;
  type?: 'text' | 'image' | 'action';
}

export interface EmpleaidoNPC {
  id: string;
  name: string;
  role: string;
  personality: string;
  currentActivity?: string;
  mood: 'happy' | 'neutral' | 'busy' | 'focused' | 'excited';
  location?: string;
  lastActive: Date;
  chat: {
    welcomeMessage: string;
    idleMessages: string[];
    moodResponses: Record<string, string>;
  };
}

export interface VirtualOfficeState {
  empleaidos: EmpleaidoNPC[];
  messages: ChatMessage[];
  currentTime: Date;
  officeTheme: 'modern' | 'retro' | 'minimal' | 'cyberpunk';
  ambientSound: string;
}

export interface InteractionRequest {
  empleaidoId: string;
  message: string;
  context?: Record<string, any>;
}

export interface InteractionResponse {
  response: string;
  actions?: string[];
  moodChange?: string;
  energyCost?: number;
}