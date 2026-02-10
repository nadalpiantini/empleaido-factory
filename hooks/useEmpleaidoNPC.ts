/**
 * useEmpleaidoNPC - Hook for managing NPC interactions
 *
 * Handles chat state, message sending, and AI responses
 * from the Empleaido cognitive engine.
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import type { EmpleaidoNPC, ChatMessage } from '../types/virtual-office';

interface UseEmpleaidoNPCResult {
  messages: ChatMessage[];
  isTyping: boolean;
  startChat: () => void;
  sendMessage: (content: string) => Promise<void>;
}

export function useEmpleaidoNPC(npc: EmpleaidoNPC | null): UseEmpleaidoNPCResult {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // Initialize chat with welcome message when NPC changes
  useEffect(() => {
    if (!npc) {
      setMessages([]);
      return;
    }

    // Add welcome message
    const welcomeMessage: ChatMessage = {
      id: `welcome-${Date.now()}`,
      sender: 'npc',
      content: npc.chat.welcomeMessage,
      timestamp: Date.now()
    };

    setMessages([welcomeMessage]);
  }, [npc]);

  const startChat = useCallback(() => {
    // Trigger any initial NPC behavior
    console.log('Chat started with', npc?.name);
  }, [npc]);

  const sendMessage = useCallback(async (content: string) => {
    if (!npc || !content.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: content.trim(),
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Call Empleaido Factory API to process message
      const response = await fetch('/api/empleaido-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empleaidoId: npc.id,
          message: content.trim(),
          context: {
            location: 'virtual-office',
            interactionMode: 'spatial'
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      // Add NPC response
      const npcMessage: ChatMessage = {
        id: `npc-${Date.now()}`,
        sender: 'npc',
        content: data.response,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, npcMessage]);
    } catch (error) {
      console.error('Error sending message:', error);

      // Add error message
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        sender: 'npc',
        content: 'Lo siento, estoy teniendo problemas para responder. ¿Puedes intentarlo de nuevo?',
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, [npc]);

  return {
    messages,
    isTyping,
    startChat,
    sendMessage
  };
}
