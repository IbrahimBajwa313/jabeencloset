// Speech-to-Text and Text-to-Speech service using Web Speech API
class SpeechService {
  private recognition: SpeechRecognition | null = null
  private synthesis: SpeechSynthesis
  private isListening: boolean = false
  private currentLanguage: string = 'en-US'

  constructor() {
    this.synthesis = window.speechSynthesis
    this.initializeSpeechRecognition()
  }

  private initializeSpeechRecognition(): void {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      this.recognition = new SpeechRecognition()
      
      this.recognition.continuous = false
      this.recognition.interimResults = true
      this.recognition.lang = this.currentLanguage
      this.recognition.maxAlternatives = 1
    }
  }

  // Speech-to-Text functionality
  async startListening(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech recognition not supported'))
        return
      }

      if (this.isListening) {
        reject(new Error('Already listening'))
        return
      }

      let finalTranscript = ''
      let timeoutId: NodeJS.Timeout

      this.recognition.onstart = () => {
        this.isListening = true
        // Set timeout to stop listening after 10 seconds of silence
        timeoutId = setTimeout(() => {
          this.stopListening()
        }, 10000)
      }

      this.recognition.onresult = (event) => {
        clearTimeout(timeoutId)
        let interimTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }

        // Reset timeout on new speech
        timeoutId = setTimeout(() => {
          this.stopListening()
        }, 3000)
      }

      this.recognition.onend = () => {
        this.isListening = false
        clearTimeout(timeoutId)
        resolve(finalTranscript.trim())
      }

      this.recognition.onerror = (event) => {
        this.isListening = false
        clearTimeout(timeoutId)
        reject(new Error(`Speech recognition error: ${event.error}`))
      }

      try {
        this.recognition.start()
      } catch (error) {
        this.isListening = false
        reject(error)
      }
    })
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
    }
  }

  // Text-to-Speech functionality
  async speak(text: string, options: SpeechOptions = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error('Speech synthesis not supported'))
        return
      }

      // Cancel any ongoing speech
      this.synthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      
      // Set voice options
      utterance.lang = options.language || this.currentLanguage
      utterance.rate = options.rate || 1
      utterance.pitch = options.pitch || 1
      utterance.volume = options.volume || 1

      // Try to find a voice for the specified language
      const voices = this.synthesis.getVoices()
      const voice = voices.find(v => 
        v.lang.startsWith(options.language?.split('-')[0] || this.currentLanguage.split('-')[0])
      )
      if (voice) {
        utterance.voice = voice
      }

      utterance.onend = () => resolve()
      utterance.onerror = (event) => reject(new Error(`Speech synthesis error: ${event.error}`))

      this.synthesis.speak(utterance)
    })
  }

  // Stop current speech
  stopSpeaking(): void {
    if (this.synthesis) {
      this.synthesis.cancel()
    }
  }

  // Check if currently speaking
  isSpeaking(): boolean {
    return this.synthesis ? this.synthesis.speaking : false
  }

  // Check if currently listening
  isCurrentlyListening(): boolean {
    return this.isListening
  }

  // Set language for both STT and TTS
  setLanguage(language: string): void {
    this.currentLanguage = language
    if (this.recognition) {
      this.recognition.lang = language
    }
  }

  // Get available voices
  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.synthesis ? this.synthesis.getVoices() : []
  }

  // Get supported languages
  getSupportedLanguages(): string[] {
    const voices = this.getAvailableVoices()
    const languages = [...new Set(voices.map(voice => voice.lang))]
    return languages.sort()
  }

  // Check if speech recognition is supported
  isSpeechRecognitionSupported(): boolean {
    return this.recognition !== null
  }

  // Check if speech synthesis is supported
  isSpeechSynthesisSupported(): boolean {
    return this.synthesis !== null
  }

  // Language detection (enhanced implementation with Urdu support)
  detectLanguage(text: string): string {
    // Enhanced language detection based on character patterns and common words
    const arabicPattern = /[\u0600-\u06FF]/
    const urduPattern = /[\u0600-\u06FF\u0750-\u077F]/
    const chinesePattern = /[\u4e00-\u9fff]/
    const japanesePattern = /[\u3040-\u309f\u30a0-\u30ff]/
    const koreanPattern = /[\uac00-\ud7af]/
    const russianPattern = /[\u0400-\u04FF]/
    const frenchPattern = /[àâäéèêëïîôùûüÿç]/i
    const germanPattern = /[äöüß]/i
    const spanishPattern = /[ñáéíóúü]/i

    // Common Urdu words for better detection
    const urduWords = [
      'آپ', 'میں', 'ہے', 'کا', 'کی', 'کو', 'سے', 'میں', 'پر', 'اور', 'یہ', 'وہ',
      'کیا', 'کون', 'کب', 'کہاں', 'کیسے', 'کتنا', 'جو', 'جب', 'جہاں', 'جیسے',
      'سلام', 'شکریہ', 'معاف', 'خوش', 'اچھا', 'برا', 'بہت', 'تھوڑا', 'زیادہ'
    ]

    // Common Arabic words (different from Urdu)
    const arabicWords = [
      'السلام', 'عليكم', 'شكرا', 'مرحبا', 'أهلا', 'وسهلا', 'إن', 'شاء', 'الله',
      'الحمد', 'لله', 'ما', 'شاء', 'الله', 'بارك', 'الله', 'فيك'
    ]

    // Check for Urdu-specific patterns and words
    if (urduPattern.test(text)) {
      const hasUrduWords = urduWords.some(word => text.includes(word))
      const hasArabicWords = arabicWords.some(word => text.includes(word))
      
      // If has Urdu words or no Arabic words, likely Urdu
      if (hasUrduWords || !hasArabicWords) {
        return 'ur-PK'
      }
      // Otherwise, likely Arabic
      return 'ar-SA'
    }

    if (arabicPattern.test(text)) return 'ar-SA'
    if (chinesePattern.test(text)) return 'zh-CN'
    if (japanesePattern.test(text)) return 'ja-JP'
    if (koreanPattern.test(text)) return 'ko-KR'
    if (russianPattern.test(text)) return 'ru-RU'
    if (frenchPattern.test(text)) return 'fr-FR'
    if (germanPattern.test(text)) return 'de-DE'
    if (spanishPattern.test(text)) return 'es-ES'

    return 'en-US' // Default to English
  }
}

interface SpeechOptions {
  language?: string
  rate?: number
  pitch?: number
  volume?: number
}

// Global declarations for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

export default SpeechService
