"use client"

import { useState, useEffect, useCallback } from 'react'

interface Suggestion {
  text: string
  confidence: number
  type?: 'word' | 'sentence'
}

interface ModelStatus {
  isInitialized: boolean
  isTraining: boolean
  vocabSize: number
  modelInfo: any
}

export function useAISuggestions() {
  const [modelManager, setModelManager] = useState<any>(null)
  const [status, setStatus] = useState<ModelStatus>({
    isInitialized: false,
    isTraining: false,
    vocabSize: 0,
    modelInfo: null
  })
  const [isLoading, setIsLoading] = useState(true)

  // Initialize the AI model
  useEffect(() => {
    let mounted = true

    const initializeModel = async () => {
      console.log('🚀 Starting AI model initialization...')
      try {
        // Dynamic import to avoid SSR issues with TensorFlow.js
        const { getModelManager } = await import('@/lib/ai/model-manager.js')
        
        if (!mounted) return

        console.log('📦 Model manager imported successfully')
        const manager = getModelManager()
        setModelManager(manager)

        console.log('🔄 Initializing model...')
        // Initialize the model
        const success = await manager.initializeModel()
        
        if (mounted) {
          console.log('✅ Model initialization result:', success)
          if (success) {
            const newStatus = manager.getStatus()
            console.log('📊 Model status:', newStatus)
            setStatus(newStatus)
          }
          setIsLoading(false)
        }
      } catch (error) {
        console.error('❌ Failed to initialize AI model:', error)
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    initializeModel()

    return () => {
      mounted = false
    }
  }, [])

  // Get suggestions for text input
  const getSuggestions = useCallback(
    async (text: string, numSuggestions = 5): Promise<Suggestion[]> => {
      console.log('getSuggestions called with:', text, 'Manager:', !!modelManager, 'Status:', status)
      
      if (!modelManager || !status.isInitialized || status.isTraining) {
        console.log('Model not ready:', { modelManager: !!modelManager, initialized: status.isInitialized, training: status.isTraining })
        return []
      }

      try {
        const suggestions = await modelManager.getSuggestions(text, numSuggestions)
        console.log('Raw suggestions:', suggestions)
        const filtered = suggestions.filter((s: Suggestion) => s.text && s.text.trim().length > 0)
        console.log('Filtered suggestions:', filtered)
        return filtered
      } catch (error) {
        console.error('Error getting AI suggestions:', error)
        return []
      }
    },
    [modelManager, status.isInitialized, status.isTraining]
  )

  // Retrain model with new data
  const retrainModel = useCallback(
    async (newTexts: string[]) => {
      if (!modelManager) return false

      try {
        await modelManager.retrainWithNewData(newTexts)
        setStatus(modelManager.getStatus())
        return true
      } catch (error) {
        console.error('Error retraining model:', error)
        return false
      }
    },
    [modelManager]
  )

  return {
    getSuggestions,
    retrainModel,
    status,
    isLoading,
    isReady: status.isInitialized && !status.isTraining && !isLoading
  }
}
