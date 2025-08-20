"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface ChatbotContextType {
  isEnabled: boolean
  setIsEnabled: (enabled: boolean) => void
  language: string
  setLanguage: (language: string) => void
  voiceEnabled: boolean
  setVoiceEnabled: (enabled: boolean) => void
  autoSpeak: boolean
  setAutoSpeak: (enabled: boolean) => void
  theme: 'light' | 'dark' | 'auto'
  setTheme: (theme: 'light' | 'dark' | 'auto') => void
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  setPosition: (position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left') => void
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined)

interface ChatbotProviderProps {
  children: ReactNode
}

export function ChatbotProvider({ children }: ChatbotProviderProps) {
  const [isEnabled, setIsEnabled] = useState(true)
  const [language, setLanguage] = useState('en-US')
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [autoSpeak, setAutoSpeak] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto')
  const [position, setPosition] = useState<'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'>('bottom-right')

  const value: ChatbotContextType = {
    isEnabled,
    setIsEnabled,
    language,
    setLanguage,
    voiceEnabled,
    setVoiceEnabled,
    autoSpeak,
    setAutoSpeak,
    theme,
    setTheme,
    position,
    setPosition
  }

  return (
    <ChatbotContext.Provider value={value}>
      {children}
    </ChatbotContext.Provider>
  )
}

export function useChatbot() {
  const context = useContext(ChatbotContext)
  if (context === undefined) {
    throw new Error('useChatbot must be used within a ChatbotProvider')
  }
  return context
}
