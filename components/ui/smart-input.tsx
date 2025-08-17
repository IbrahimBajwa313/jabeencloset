"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface Suggestion {
  text: string
  confidence: number
  type?: 'word' | 'sentence'
}

interface SmartInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  type?: 'input' | 'textarea'
  disabled?: boolean
  id?: string
  required?: boolean
  getSuggestions?: (text: string) => Promise<Suggestion[]>
}

export function SmartInput({
  value,
  onChange,
  placeholder,
  className,
  type = 'input',
  disabled = false,
  id,
  required = false,
  getSuggestions
}: SmartInputProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isLoading, setIsLoading] = useState(false)
  
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Debounced suggestion fetching
  const fetchSuggestions = useCallback(
    async (text: string) => {
      if (!getSuggestions || text.length < 2) {
        setSuggestions([])
        setShowSuggestions(false)
        return
      }

      setIsLoading(true)
      try {
        const results = await getSuggestions(text)
        setSuggestions(results)
        setShowSuggestions(results.length > 0)
        setSelectedIndex(-1)
      } catch (error) {
        console.error('Error fetching suggestions:', error)
        setSuggestions([])
        setShowSuggestions(false)
      } finally {
        setIsLoading(false)
      }
    },
    [getSuggestions]
  )

  // Debounce suggestions
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSuggestions(value)
    }, 300)

    return () => clearTimeout(timer)
  }, [value, fetchSuggestions])

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  // Handle suggestion selection
  const selectSuggestion = (suggestion: Suggestion) => {
    if (suggestion.type === 'sentence') {
      // For sentence completions, append to current text
      const newValue = value + (value.endsWith(' ') ? '' : ' ') + suggestion.text
      onChange(newValue)
    } else {
      // For word suggestions, replace last word
      const words = value.split(' ')
      const lastWord = words[words.length - 1]
      
      if (lastWord && suggestion.text.startsWith(lastWord.toLowerCase())) {
        words[words.length - 1] = suggestion.text
      } else {
        words.push(suggestion.text)
      }
      
      const newValue = words.join(' ') + ' '
      onChange(newValue)
    }
    
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        )
        break
      case 'Enter':
        if (selectedIndex >= 0) {
          e.preventDefault()
          selectSuggestion(suggestions[selectedIndex])
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        setSelectedIndex(-1)
        break
    }
  }

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const InputComponent = type === 'textarea' ? Textarea : Input

  return (
    <div className="relative">
      <InputComponent
        ref={inputRef as any}
        id={id}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn(
          "transition-all duration-200",
          showSuggestions && "border-coral-400 ring-2 ring-coral-100",
          className
        )}
        disabled={disabled}
        required={required}
      />
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-coral-500"></div>
        </div>
      )}

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={`${suggestion.text}-${index}`}
              className={cn(
                "px-3 py-2 cursor-pointer transition-colors duration-150",
                "hover:bg-coral-50 hover:text-coral-700",
                selectedIndex === index && "bg-coral-100 text-coral-800",
                suggestion.type === 'sentence' && "bg-gradient-to-r from-coral-25 to-lavender-25 border-l-2 border-coral-300"
              )}
              onClick={() => selectSuggestion(suggestion)}
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className={cn(
                    "font-medium",
                    suggestion.type === 'sentence' ? "text-sm" : "text-base"
                  )}>
                    {suggestion.text}
                  </span>
                  {suggestion.type === 'sentence' && (
                    <span className="text-xs text-coral-600 mt-1">Complete sentence</span>
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  {Math.round(suggestion.confidence * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
