// Simple Gmail-style autocomplete that actually works
export class SimpleAutocomplete {
  constructor() {
    this.dataset = [];
    this.completions = new Map();
    this.ngrams = new Map(); // For continuous prediction
    this.loadDataset();
  }
  
  async loadDataset() {
    try {
      const response = await fetch('/lib/ai/dataset.json');
      this.dataset = await response.json();
      this.buildCompletions();
      this.buildNgrams();
    } catch (error) {
      console.error('Failed to load dataset:', error);
      this.fallbackData();
    }
  }
  
  fallbackData() {
    this.dataset = [
      "Our product is designed to help businesses grow",
      "This product is perfect for everyday use",
      "Made from high-quality materials that last",
      "Features advanced technology and modern design"
    ];
    this.buildCompletions();
    this.buildNgrams();
  }
  
  buildCompletions() {
    // Build completions from dataset
    this.dataset.forEach(sentence => {
      const words = sentence.split(' ');
      
      // Create completions for different phrase lengths
      for (let i = 1; i <= Math.min(5, words.length - 1); i++) {
        const trigger = words.slice(0, i).join(' ');
        const completion = words.slice(i).join(' ');
        
        if (completion.length > 0) {
          this.completions.set(trigger, completion);
        }
      }
    });
  }
  
  buildNgrams() {
    // Build n-grams for continuous prediction
    this.dataset.forEach(sentence => {
      const words = sentence.toLowerCase().split(' ');
      
      // Build 2-grams, 3-grams, 4-grams
      for (let n = 2; n <= 4; n++) {
        for (let i = 0; i <= words.length - n; i++) {
          const ngram = words.slice(i, i + n - 1).join(' ');
          const nextWord = words[i + n - 1];
          
          if (!this.ngrams.has(ngram)) {
            this.ngrams.set(ngram, []);
          }
          this.ngrams.get(ngram).push(nextWord);
        }
      }
    });
  }
  
  buildVariations() {
    const variations = new Map();
    
    // Add single word triggers
    variations.set('Our', 'product is designed to help businesses grow');
    variations.set('This', 'product is perfect for everyday use');
    variations.set('Made', 'from high-quality materials that last');
    variations.set('Features', 'advanced technology and modern design');
    variations.set('Perfect', 'for professionals and everyday users');
    variations.set('Designed', 'to provide maximum comfort and efficiency');
    variations.set('Built', 'with premium materials and attention to detail');
    variations.set('Ideal', 'for both personal and professional use');
    variations.set('Crafted', 'from sustainable and eco-friendly materials');
    variations.set('Engineered', 'for superior performance and reliability');
    variations.set('We', 'offer exceptional quality and customer service');
    variations.set('Available', 'in multiple colors and sizes to suit your needs');
    variations.set('Lightweight', 'and durable construction for long-lasting use');
    variations.set('Easy', 'to use with intuitive controls and setup');
    variations.set('Compatible', 'with all major platforms and devices');
    variations.set('Includes', 'everything you need to get started');
    variations.set('Premium', 'quality materials ensure durability and performance');
    variations.set('Professional', 'grade components for reliable operation');
    variations.set('Industry', 'leading technology and innovative features');
    variations.set('Great', 'for travel with compact and portable design');
    
    // Merge with main completions
    for (const [key, value] of variations) {
      this.completions.set(key, value);
    }
  }
  
  getSuggestions(input, maxSuggestions = 3) {
    if (!input || input.trim().length === 0) {
      return [];
    }
    
    const normalizedInput = input.trim().toLowerCase();
    const suggestions = [];
    
    // Method 1: N-gram based continuous prediction
    const words = normalizedInput.split(' ');
    
    // Try different n-gram sizes (prioritize longer context)
    for (let n = Math.min(3, words.length); n >= 1; n--) {
      const ngram = words.slice(-n).join(' ');
      
      if (this.ngrams.has(ngram)) {
        const nextWords = this.ngrams.get(ngram);
        const wordCounts = {};
        
        // Count frequency of next words
        nextWords.forEach(word => {
          wordCounts[word] = (wordCounts[word] || 0) + 1;
        });
        
        // Sort by frequency and add to suggestions
        const sortedWords = Object.entries(wordCounts)
          .sort(([,a], [,b]) => b - a)
          .slice(0, maxSuggestions);
        
        sortedWords.forEach(([word, count], index) => {
          const confidence = 0.9 - (index * 0.1) - (3 - n) * 0.1;
          suggestions.push({
            text: word,
            confidence: Math.max(0.3, confidence),
            type: 'word',
            trigger: ngram,
            frequency: count
          });
        });
        
        if (suggestions.length >= maxSuggestions) break;
      }
    }
    
    // Method 2: Phrase completion (for longer completions)
    if (suggestions.length < maxSuggestions) {
      for (const [trigger, completion] of this.completions) {
        const normalizedTrigger = trigger.toLowerCase();
        
        if (normalizedTrigger.startsWith(normalizedInput)) {
          const alreadyExists = suggestions.some(s => s.trigger === trigger);
          if (!alreadyExists) {
            suggestions.push({
              text: completion,
              confidence: 0.8,
              type: 'completion',
              trigger: trigger
            });
          }
        }
      }
    }
    
    // Sort by confidence and return top suggestions
    return suggestions
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, maxSuggestions);
  }
  
  // Get the completion text that should be appended
  getCompletionText(input, suggestion) {
    if (suggestion.type === 'word') {
      // For word suggestions, just append the word
      return suggestion.text;
    } else {
      // For phrase completions
      const normalizedInput = input.trim().toLowerCase();
      const normalizedTrigger = suggestion.trigger.toLowerCase();
      
      if (normalizedTrigger.startsWith(normalizedInput)) {
        const remainingTrigger = suggestion.trigger.substring(input.trim().length);
        return (remainingTrigger + ' ' + suggestion.text).trim();
      }
      
      return suggestion.text;
    }
  }
}
