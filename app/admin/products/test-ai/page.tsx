"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SmartInput } from '@/components/ui/smart-input'
import { useAISuggestions } from '@/hooks/use-ai-suggestions'
import { Brain, Loader2 } from 'lucide-react'

export default function TestAIPage() {
  const [productName, setProductName] = useState('')
  const [productDescription, setProductDescription] = useState('')
  const { getSuggestions, status, isLoading, isReady } = useAISuggestions()

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-coral-500" />
            AI Text Suggestions Test
          </CardTitle>
          <div className="flex items-center gap-2 text-sm">
            {isLoading ? (
              <div className="flex items-center gap-2 text-amber-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading AI Model...</span>
              </div>
            ) : isReady ? (
              <div className="flex items-center gap-2 text-green-600">
                <Brain className="h-4 w-4" />
                <span>AI Ready - Model Loaded Successfully</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-500">
                <Brain className="h-4 w-4" />
                <span>AI Model Failed to Load</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Product Name (with AI suggestions)
            </label>
            <SmartInput
              value={productName}
              onChange={setProductName}
              placeholder="Start typing a product name..."
              getSuggestions={getSuggestions}
            />
            <p className="text-xs text-gray-500 mt-1">
              Try typing: "Elegant", "Comfortable", "Stylish", "Modern"
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Product Description (with AI suggestions)
            </label>
            <SmartInput
              type="textarea"
              value={productDescription}
              onChange={setProductDescription}
              placeholder="Start typing a product description..."
              getSuggestions={getSuggestions}
            />
            <p className="text-xs text-gray-500 mt-1">
              Try typing: "This elegant", "Made from", "Perfect for"
            </p>
          </div>

          <div className="bg-coral-50 p-4 rounded-lg">
            <h3 className="font-semibold text-coral-800 mb-2">Gmail-Style Smart Compose Features:</h3>
            <ul className="text-sm text-coral-700 space-y-1">
              <li>• <strong>Sentence Completions:</strong> Type 3+ words to get full sentence suggestions</li>
              <li>• <strong>Word Suggestions:</strong> Type 1-2 words for individual word completions</li>
              <li>• <strong>Visual Distinction:</strong> Sentence completions have special styling</li>
              <li>• <strong>Smart Context:</strong> AI learns from product description patterns</li>
              <li>• <strong>Temperature Sampling:</strong> Multiple creativity levels for varied suggestions</li>
              <li>• Use arrow keys to navigate, Enter to select, or click suggestions</li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-lavender-50 to-coral-50 p-4 rounded-lg border border-coral-200">
            <h3 className="font-semibold text-coral-800 mb-2">Try These Examples:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="font-medium text-coral-700">For Sentence Completions:</p>
                <ul className="text-coral-600 mt-1 space-y-1">
                  <li>• "This elegant dress"</li>
                  <li>• "Made from premium"</li>
                  <li>• "Perfect for everyday"</li>
                  <li>• "Features a modern"</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-coral-700">For Word Suggestions:</p>
                <ul className="text-coral-600 mt-1 space-y-1">
                  <li>• "Comfortable"</li>
                  <li>• "Stylish"</li>
                  <li>• "Premium"</li>
                  <li>• "Elegant"</li>
                </ul>
              </div>
            </div>
          </div>

          {status && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">AI Model Status:</h3>
              <div className="text-sm space-y-1">
                <p>Vocabulary Size: {status.vocabSize}</p>
                <p>Model Initialized: {status.isInitialized ? 'Yes' : 'No'}</p>
                <p>Training Status: {status.isTraining ? 'Training...' : 'Ready'}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
