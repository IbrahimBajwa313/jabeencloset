// Model Manager - Handles training, loading, and inference
// This orchestrates the entire LSTM text suggestion pipeline

import { TextProcessor } from './text-processor.js';
import { LSTMTextModel } from './lstm-model.js';
import { enhancedTrainingCorpus } from './enhanced-training-data.js';

export class ModelManager {
  constructor() {
    this.processor = new TextProcessor();
    this.model = null;
    this.isInitialized = false;
    this.isTraining = false;
  }

  // Initialize and train the model
  async initializeModel(forceRetrain = false) {
    console.log('🚀 Initializing LSTM Text Suggestion Model...');
    
    try {
      // Try to load existing model first
      if (!forceRetrain) {
        console.log('🔍 Attempting to load existing model...');
        const loaded = await this.loadExistingModel();
        if (loaded) {
          console.log('✅ Model loaded from storage');
          this.isInitialized = true;
          return true;
        }
      }

      // Train new model if loading failed or forced retrain
      console.log('🔄 No existing model found, training new model...');
      await this.trainNewModel();
      console.log('✅ Model training completed');
      this.isInitialized = true;
      return true;

    } catch (error) {
      console.error('❌ Model initialization failed:', error);
      this.isInitialized = false;
      return false;
    }
  }

  // Train a new model from scratch
  async trainNewModel() {
    this.isTraining = true;
    
    try {
      // Step 1: Build vocabulary
      console.log('📚 Building vocabulary...');
      const vocabSize = this.processor.buildVocabulary(enhancedTrainingCorpus);
      
      // Step 2: Create training sequences
      console.log('🔢 Creating training sequences...');
      const sequences = this.processor.createTrainingSequences(enhancedTrainingCorpus);
      
      // Step 3: Initialize LSTM model
      console.log('🧠 Building LSTM architecture...');
      this.model = new LSTMTextModel(vocabSize);
      this.model.buildModel();
      
      // Step 4: Prepare training data
      console.log('📊 Preparing training data...');
      const trainingData = this.model.prepareTrainingData(sequences);
      
      // Step 5: Train the model
      console.log('🏋️ Training model...');
      await this.model.trainModel(trainingData, 50, 32); // 50 epochs, batch size 32
      
      // Step 6: Save model and vocabulary
      console.log('💾 Saving model...');
      await this.saveModel();
      
      this.isInitialized = true;
      this.isTraining = false;
      
    } catch (error) {
      this.isTraining = false;
      throw error;
    }
  }

  // Load existing model from storage
  async loadExistingModel() {
    try {
      // Load vocabulary
      const vocabData = localStorage.getItem('lstm-vocabulary');
      if (!vocabData) {
        return false;
      }
      
      this.processor.importVocabulary(JSON.parse(vocabData));
      
      // Load model
      this.model = new LSTMTextModel(this.processor.vocabSize);
      await this.model.loadModel();
      
      this.isInitialized = true;
      return true;
      
    } catch (error) {
      console.log('No existing model found, will train new one');
      return false;
    }
  }

  // Save model and vocabulary
  async saveModel() {
    if (!this.model || !this.processor) {
      throw new Error('No model or processor to save');
    }
    
    // Save model
    await this.model.saveModel();
    
    // Save vocabulary
    const vocabData = this.processor.exportVocabulary();
    localStorage.setItem('lstm-vocabulary', JSON.stringify(vocabData));
    
    console.log('Model and vocabulary saved successfully');
  }

  // Get sentence completions for input (Gmail-style)
  async getSentenceCompletions(inputText, numSuggestions = 3) {
    if (!this.isInitialized || !this.model) {
      console.log('❌ Model not initialized for sentence completions');
      return [];
    }

    try {
      const tokens = this.processor.tokenize(inputText);
      if (tokens.length < 2) {
        return []; // Need at least 2 words for sentence completion
      }

      // Convert last few words to sequence
      const sequence = tokens.slice(-8).map(word => 
        this.processor.wordToIndex.get(word) || this.processor.wordToIndex.get('<UNK>')
      );

      const completions = [];
      for (let i = 0; i < numSuggestions; i++) {
        const temperature = 0.6 + (i * 0.15); // Better temperature range
        const completion = this.model.generateSentenceCompletion(
          sequence, 
          this.processor, 
          12, // Max 12 words for longer completions
          temperature
        );
        
        if (completion.length > 0) {
          const completionText = completion.join(' ');
          // Filter out repetitive or poor completions
          if (completionText.length > 5 && !completionText.includes('undefined')) {
            completions.push({
              text: completionText,
              confidence: Math.max(0.5, 0.9 - (i * 0.1)),
              type: 'sentence'
            });
          }
        }
      }

      console.log('🔮 Generated sentence completions:', completions);
      return completions.slice(0, numSuggestions);

    } catch (error) {
      console.error('❌ Error generating sentence completions:', error);
      console.error('Error getting sentence completions:', error);
      return [];
    }
  }

  // Get text suggestions for input (backward compatibility)
  async getSuggestions(inputText, numSuggestions = 5) {
    if (!this.isInitialized || !this.model) {
      throw new Error('Model not initialized. Call initializeModel() first.');
    }

    if (this.isTraining) {
      return [];
    }

    try {
      // For longer text, provide sentence completions
      if (inputText.trim().split(' ').length >= 3) {
        return await this.getSentenceCompletions(inputText, Math.min(3, numSuggestions));
      }

      // For short text, provide word suggestions
      const inputSequence = this.processor.prepareInput(inputText);
      const aiSuggestions = await this.model.generateSuggestions(
        inputSequence, 
        this.processor, 
        numSuggestions
      );

      const vocabSuggestions = this.processor.getSuggestions(inputText, numSuggestions);
      
      const combined = [...aiSuggestions];
      vocabSuggestions.forEach(word => {
        if (!combined.find(s => s.word === word)) {
          combined.push({ word, confidence: 0.1, type: 'word' });
        }
      });

      return combined.slice(0, numSuggestions).map(s => ({
        text: s.word || s.text,
        confidence: s.confidence,
        type: s.type || 'word'
      }));
      
    } catch (error) {
      console.error('Error getting suggestions:', error);
      const fallback = this.processor.getSuggestions(inputText, numSuggestions);
      return fallback.map(word => ({ text: word, confidence: 0.1, type: 'word' }));
    }
  }

  // Get model status
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      isTraining: this.isTraining,
      vocabSize: this.processor.vocabSize,
      modelInfo: this.model ? this.model.getModelInfo() : null
    };
  }

  // Retrain model with new data
  async retrainWithNewData(newTexts) {
    console.log('🔄 Retraining model with new data...');
    
    // Add new texts to training corpus
    const updatedCorpus = [...trainingCorpus, ...newTexts];
    
    // Retrain model
    this.isInitialized = false;
    await this.trainNewModel(updatedCorpus);
  }

  // Clean up resources
  dispose() {
    if (this.model) {
      this.model.dispose();
    }
    this.isInitialized = false;
    this.isTraining = false;
  }
}

// Global model manager instance
let globalModelManager = null;

// Get or create global model manager
export function getModelManager() {
  if (!globalModelManager) {
    globalModelManager = new ModelManager();
  }
  return globalModelManager;
}

// Initialize model on first import (for browser)
export async function initializeGlobalModel() {
  const manager = getModelManager();
  if (!manager.isInitialized && !manager.isTraining) {
    await manager.initializeModel();
  }
  return manager;
}
