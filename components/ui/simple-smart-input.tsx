'use client';

import { useState, useRef, useEffect } from 'react';
import { SimpleAutocomplete } from '@/lib/ai/simple-autocomplete';

interface SimpleSuggestion {
  text: string;
  confidence: number;
  type: string;
  trigger: string;
}

interface SimpleSmartInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  multiline?: boolean;
}

const autocomplete = new SimpleAutocomplete();

export function SimpleSmartInput({ 
  value, 
  onChange, 
  placeholder = "Start typing...", 
  className = "",
  multiline = false 
}: SimpleSmartInputProps) {
  const [suggestions, setSuggestions] = useState<SimpleSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.trim().length > 0) {
      const newSuggestions = autocomplete.getSuggestions(value, 3);
      setSuggestions(newSuggestions);
      setShowSuggestions(newSuggestions.length > 0);
      setSelectedIndex(0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [value]);

  const applySuggestion = (suggestion: SimpleSuggestion) => {
    const completionText = autocomplete.getCompletionText(value, suggestion);
    let newValue;
    
    if (suggestion.type === 'word') {
      // For word suggestions, append to current text
      newValue = value.trim() + ' ' + completionText;
    } else {
      // For phrase completions
      newValue = value.trim() + ' ' + completionText;
    }
    
    onChange(newValue);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % suggestions.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev === 0 ? suggestions.length - 1 : prev - 1);
        break;
      case 'Tab':
      case 'Enter':
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          e.preventDefault();
          applySuggestion(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
    }
  };

  const InputComponent = multiline ? 'textarea' : 'input';

  return (
    <div className="relative">
      <InputComponent
        ref={inputRef as any}
        type={multiline ? undefined : "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
        rows={multiline ? 4 : undefined}
      />

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className={`px-4 py-2 cursor-pointer transition-colors ${
                index === selectedIndex
                  ? 'bg-blue-50 border-l-4 border-blue-500'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => applySuggestion(suggestion)}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">
                  {suggestion.type === 'word' ? (
                    <span className="text-gray-600">{suggestion.text}</span>
                  ) : (
                    <>
                      <span className="font-medium text-gray-900">{suggestion.trigger}</span>
                      {' '}
                      <span className="text-gray-600">{suggestion.text}</span>
                    </>
                  )}
                </span>
                <span className="text-xs text-gray-400 ml-2">
                  {Math.round(suggestion.confidence * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
