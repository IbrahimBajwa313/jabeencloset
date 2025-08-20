"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  MessageCircle, 
  X, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Settings,
  Minimize2,
  Maximize2,
  Bot,
  User
} from "lucide-react"
import { toast } from "sonner"
import SpeechService from "@/lib/ai/speech-service"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  isVoice?: boolean
  language?: string
}

interface ChatbotWidgetProps {
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left"
  theme?: "light" | "dark" | "auto"
  primaryColor?: string
  showLanguageSelector?: boolean
  enableVoice?: boolean
  autoSpeak?: boolean
}

const SUPPORTED_LANGUAGES = [
  { code: 'en-US', name: 'English', flag: '🇺🇸' },
  { code: 'ur-PK', name: 'اردو', flag: '🇵🇰' },
  { code: 'ar-SA', name: 'العربية', flag: '🇸🇦' },
  { code: 'es-ES', name: 'Español', flag: '🇪🇸' },
  { code: 'fr-FR', name: 'Français', flag: '🇫🇷' },
  { code: 'de-DE', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh-CN', name: '中文', flag: '🇨🇳' },
  { code: 'ja-JP', name: '日本語', flag: '🇯🇵' },
  { code: 'ko-KR', name: '한국어', flag: '🇰🇷' },
]

export default function ChatbotWidget({
  position = "bottom-right",
  theme = "auto",
  primaryColor = "#F56565",
  showLanguageSelector = true,
  enableVoice = true,
  autoSpeak = false
}: ChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState("")
  const [currentLanguage, setCurrentLanguage] = useState("en-US")
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [speechEnabled, setSpeechEnabled] = useState(enableVoice)
  const [autoSpeakEnabled, setAutoSpeakEnabled] = useState(autoSpeak)
  const [showSettings, setShowSettings] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const speechServiceRef = useRef<SpeechService | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Initialize session ID
    setSessionId(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
    
    // Initialize speech service
    if (typeof window !== 'undefined' && enableVoice) {
      speechServiceRef.current = new SpeechService()
      speechServiceRef.current.setLanguage(currentLanguage)
    }

    // Add welcome message
    const welcomeMessage: Message = {
      id: `msg_${Date.now()}`,
      role: "assistant",
      content: "Hello! I'm your AI shopping assistant. How can I help you today? You can ask me about products, prices, or any questions about our store.",
      timestamp: new Date()
    }
    setMessages([welcomeMessage])
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (speechServiceRef.current) {
      speechServiceRef.current.setLanguage(currentLanguage)
    }
  }, [currentLanguage])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const sendMessage = async (content: string, isVoice: boolean = false) => {
    if (!content.trim()) return

    // Auto-detect language from message content
    let detectedLanguage = currentLanguage
    if (speechServiceRef.current) {
      detectedLanguage = speechServiceRef.current.detectLanguage(content.trim())
      if (detectedLanguage !== currentLanguage) {
        setCurrentLanguage(detectedLanguage)
      }
    }

    const userMessage: Message = {
      id: `msg_${Date.now()}_user`,
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
      isVoice,
      language: detectedLanguage
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chatbot/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: content,
          sessionId,
          language: detectedLanguage,
          conversationHistory: messages.slice(-10) // Send last 10 messages for context
        })
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: `msg_${Date.now()}_assistant`,
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
        language: detectedLanguage
      }

      setMessages(prev => [...prev, assistantMessage])

      // Auto-speak the response if enabled
      if (autoSpeakEnabled && speechServiceRef.current && !isSpeaking) {
        await speakMessage(data.response)
      }

    } catch (error) {
      console.error("Chat error:", error)
      toast.error("Failed to send message. Please try again.")
      
      const errorMessage: Message = {
        id: `msg_${Date.now()}_error`,
        role: "assistant",
        content: "I'm sorry, I'm having trouble responding right now. Please try again or contact our customer service team.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleVoiceInput = async () => {
    if (!speechServiceRef.current || !speechEnabled) {
      toast.error("Voice input is not available")
      return
    }

    if (isListening) {
      speechServiceRef.current.stopListening()
      setIsListening(false)
      return
    }

    try {
      setIsListening(true)
      const transcript = await speechServiceRef.current.startListening()
      
      if (transcript) {
        await sendMessage(transcript, true)
      }
    } catch (error) {
      console.error("Voice input error:", error)
      toast.error("Voice input failed. Please try again.")
    } finally {
      setIsListening(false)
    }
  }

  const speakMessage = async (text: string) => {
    if (!speechServiceRef.current || !speechEnabled) return

    try {
      setIsSpeaking(true)
      await speechServiceRef.current.speak(text, {
        language: currentLanguage,
        rate: 0.9,
        pitch: 1,
        volume: 0.8
      })
    } catch (error) {
      console.error("Speech synthesis error:", error)
    } finally {
      setIsSpeaking(false)
    }
  }

  const stopSpeaking = () => {
    if (speechServiceRef.current) {
      speechServiceRef.current.stopSpeaking()
      setIsSpeaking(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage(inputValue)
    }
  }

  const getPositionClasses = () => {
    switch (position) {
      case "bottom-left":
        return "bottom-4 left-4"
      case "top-right":
        return "top-4 right-4"
      case "top-left":
        return "top-4 left-4"
      default:
        return "bottom-4 right-4"
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (!isOpen) {
    return (
      <div className={`fixed ${getPositionClasses()} z-50`}>
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg hover:scale-110 transition-transform"
          style={{ backgroundColor: primaryColor }}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    )
  }

  return (
    <div className={`fixed ${getPositionClasses()} z-50`}>
      <Card className={`w-80 h-96 shadow-xl border-0 ${isMinimized ? 'h-14' : 'h-96'} transition-all duration-300`}>
        {/* Header */}
        <CardHeader className="p-3 border-b" style={{ backgroundColor: primaryColor }}>
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <CardTitle className="text-sm font-medium">AI Assistant</CardTitle>
              {isListening && (
                <Badge variant="secondary" className="text-xs animate-pulse">
                  Listening...
                </Badge>
              )}
              {isSpeaking && (
                <Badge variant="secondary" className="text-xs animate-pulse">
                  Speaking...
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
                className="h-6 w-6 p-0 text-white hover:bg-white/20"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-6 w-6 p-0 text-white hover:bg-white/20"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0 text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && !isMinimized && (
            <div className="mt-2 p-2 bg-white/10 rounded-lg space-y-2">
              {showLanguageSelector && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/80">Language:</span>
                  <Select value={currentLanguage} onValueChange={setCurrentLanguage}>
                    <SelectTrigger className="h-6 text-xs bg-white/20 border-white/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SUPPORTED_LANGUAGES.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.flag} {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {enableVoice && (
                <div className="flex items-center gap-2 text-xs">
                  <label className="flex items-center gap-1 text-white/80">
                    <input
                      type="checkbox"
                      checked={speechEnabled}
                      onChange={(e) => setSpeechEnabled(e.target.checked)}
                      className="rounded"
                    />
                    Voice Input
                  </label>
                  <label className="flex items-center gap-1 text-white/80">
                    <input
                      type="checkbox"
                      checked={autoSpeakEnabled}
                      onChange={(e) => setAutoSpeakEnabled(e.target.checked)}
                      className="rounded"
                    />
                    Auto Speak
                  </label>
                </div>
              )}
            </div>
          )}
        </CardHeader>

        {!isMinimized && (
          <>
            {/* Messages */}
            <CardContent className="p-0 h-64">
              <ScrollArea className="h-full p-3">
                <div className="space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] p-2 rounded-lg ${
                          message.role === "user"
                            ? "bg-coral-500 text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {message.role === "assistant" && <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                          {message.role === "user" && <User className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                          <div className="flex-1">
                            <p className="text-sm">{message.content}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs opacity-70">
                                {formatTime(message.timestamp)}
                              </span>
                              {message.isVoice && (
                                <Badge variant="outline" className="text-xs">
                                  Voice
                                </Badge>
                              )}
                              {message.role === "assistant" && speechEnabled && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => speakMessage(message.content)}
                                  className="h-4 w-4 p-0 opacity-70 hover:opacity-100"
                                >
                                  <Volume2 className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 p-2 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Bot className="h-4 w-4" />
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>
            </CardContent>

            {/* Input */}
            <div className="p-3 border-t">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1"
                />
                
                {speechEnabled && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={isSpeaking ? stopSpeaking : handleVoiceInput}
                    disabled={isLoading}
                    className={`${isListening ? 'bg-red-100 border-red-300' : ''} ${isSpeaking ? 'bg-blue-100 border-blue-300' : ''}`}
                  >
                    {isSpeaking ? (
                      <VolumeX className="h-4 w-4" />
                    ) : isListening ? (
                      <MicOff className="h-4 w-4" />
                    ) : (
                      <Mic className="h-4 w-4" />
                    )}
                  </Button>
                )}
                
                <Button
                  onClick={() => sendMessage(inputValue)}
                  disabled={isLoading || !inputValue.trim()}
                  size="sm"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}
