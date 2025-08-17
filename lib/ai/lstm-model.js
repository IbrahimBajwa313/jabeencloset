// LSTM Neural Network Model for Text Suggestions
// Built with TensorFlow.js for browser-based training and inference

import * as tf from '@tensorflow/tfjs';

export class LSTMTextModel {
  constructor(vocabSize, embeddingDim = 100, lstmUnits = 256, maxSequenceLength = 30) {
    this.vocabSize = vocabSize;
    this.embeddingDim = embeddingDim;
    this.lstmUnits = lstmUnits;
    this.maxSequenceLength = maxSequenceLength;
    this.model = null;
    this.isTraining = false;
  }

  // Step 1: Build the LSTM architecture
  buildModel() {
    console.log('Building LSTM model architecture...');
    
    // Sequential model - layers stacked one after another
    this.model = tf.sequential();

    // Layer 1: Embedding Layer
    // Converts word indices to dense vectors
    this.model.add(tf.layers.embedding({
      inputDim: this.vocabSize,        // Size of vocabulary
      outputDim: this.embeddingDim,    // Dimension of embedding vectors
      inputLength: this.maxSequenceLength, // Length of input sequences
      name: 'embedding'
    }));

    // Layer 2: First LSTM Layer
    this.model.add(tf.layers.lstm({
      units: this.lstmUnits,
      returnSequences: true,           // Return sequences for stacking
      dropout: 0.3,
      recurrentDropout: 0.3,
      name: 'lstm_1'
    }));

    // Layer 3: Second LSTM Layer
    this.model.add(tf.layers.lstm({
      units: this.lstmUnits / 2,       // Smaller second layer
      returnSequences: false,
      dropout: 0.3,
      recurrentDropout: 0.3,
      name: 'lstm_2'
    }));

    // Layer 4: Dense Layer (Hidden)
    this.model.add(tf.layers.dense({
      units: this.lstmUnits,
      activation: 'relu',
      name: 'dense_hidden'
    }));

    // Layer 5: Dropout Layer
    this.model.add(tf.layers.dropout({
      rate: 0.4,
      name: 'dropout'
    }));

    // Layer 5: Output Layer
    // Predicts probability distribution over vocabulary
    this.model.add(tf.layers.dense({
      units: this.vocabSize,
      activation: 'softmax',           // Softmax for probability distribution
      name: 'output'
    }));

    // Compile the model with improved settings
    this.model.compile({
      optimizer: tf.train.adam(0.0005), // Lower learning rate for better convergence
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });

    console.log('Model architecture:');
    this.model.summary();
    
    return this.model;
  }

  // Step 2: Prepare training data
  prepareTrainingData(sequences) {
    console.log('Preparing training data...');
    
    const inputs = sequences.map(seq => seq.input);
    const targets = sequences.map(seq => seq.target);

    // Convert to tensors
    const inputTensor = tf.tensor2d(inputs, [inputs.length, this.maxSequenceLength]);
    
    // Convert targets to one-hot encoding
    const targetTensor = tf.oneHot(tf.tensor1d(targets, 'int32'), this.vocabSize);

    console.log(`Input shape: [${inputTensor.shape}]`);
    console.log(`Target shape: [${targetTensor.shape}]`);

    return { inputs: inputTensor, targets: targetTensor };
  }

  // Step 3: Train the model
  async trainModel(trainingData, epochs = 50, batchSize = 32, validationSplit = 0.2) {
    if (!this.model) {
      throw new Error('Model not built. Call buildModel() first.');
    }

    console.log('Starting model training...');
    this.isTraining = true;

    const { inputs, targets } = trainingData;

    // Training configuration
    const config = {
      epochs: epochs,
      batchSize: batchSize,
      validationSplit: validationSplit,
      shuffle: true,
      verbose: 1,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch ${epoch + 1}/${epochs}`);
          console.log(`Loss: ${logs.loss.toFixed(4)}, Accuracy: ${logs.acc.toFixed(4)}`);
          if (logs.val_loss) {
            console.log(`Val Loss: ${logs.val_loss.toFixed(4)}, Val Accuracy: ${logs.val_acc.toFixed(4)}`);
          }
        }
      }
    };

    try {
      const history = await this.model.fit(inputs, targets, config);
      console.log('Training completed!');
      this.isTraining = false;
      return history;
    } catch (error) {
      console.error('Training failed:', error);
      this.isTraining = false;
      throw error;
    }
  }

  // Step 4: Predict next word
  async predictNextWord(inputSequence, topK = 5) {
    if (!this.model) {
      throw new Error('Model not trained. Train the model first.');
    }

    // Convert input to tensor
    const inputTensor = tf.tensor2d([inputSequence], [1, this.maxSequenceLength]);
    
    // Get prediction
    const prediction = this.model.predict(inputTensor);
    const probabilities = await prediction.data();

    // Get top K predictions
    const topIndices = this.getTopKIndices(probabilities, topK);
    
    // Clean up tensors
    inputTensor.dispose();
    prediction.dispose();

    return topIndices.map(index => ({
      index: index,
      probability: probabilities[index]
    }));
  }

  // Step 4b: Generate sentence completion with improved sampling
  generateSentenceCompletion(inputSequence, processor, maxLength = 15, temperature = 0.8) {
    if (!this.model) {
      throw new Error('Model not initialized');
    }

    const completion = [];
    let currentSequence = [...inputSequence];

    for (let i = 0; i < maxLength; i++) {
      // Pad sequence to match training length
      const paddedSequence = processor.padSequence(currentSequence, this.maxSequenceLength);
      
      // Convert to tensor and predict
      const inputTensor = tf.tensor2d([paddedSequence], [1, this.maxSequenceLength]);
      const predictions = this.model.predict(inputTensor);
      
      // Get probabilities and apply temperature sampling
      const probabilities = predictions.dataSync();
      const nextWordIndex = this.sampleWithTemperature(probabilities, temperature);
      
      // Clean up tensors
      inputTensor.dispose();
      predictions.dispose();
      
      // Convert index back to word
      const nextWord = processor.indexToWord.get(nextWordIndex);
      if (!nextWord || nextWord === '<UNK>' || nextWord === '<END>') {
        break;
      }
      
      completion.push(nextWord);
      
      // Stop at natural sentence boundaries
      if (nextWord.includes('.') || nextWord.includes('!') || nextWord.includes('?')) {
        break;
      }
      
      // Update sequence for next prediction (sliding window)
      currentSequence = [...currentSequence.slice(1), nextWordIndex];
    }

    return completion;
  }

  // Step 5: Generate text suggestions
  async generateSuggestions(inputSequence, processor, numSuggestions = 5) {
    const predictions = await this.predictNextWord(inputSequence, numSuggestions);
    
    return predictions.map(pred => ({
      word: processor.indexToWord.get(pred.index),
      confidence: pred.probability
    })).filter(suggestion => 
      suggestion.word && 
      !['<PAD>', '<UNK>', '<START>', '<END>'].includes(suggestion.word)
    );
  }

  // Helper function to get top K indices
  getTopKIndices(array, k) {
    const indices = Array.from(array.keys());
    indices.sort((a, b) => array[b] - array[a]);
    return indices.slice(0, k);
  }

  // Temperature sampling for more natural text generation
  sampleWithTemperature(probabilities, temperature = 1.0) {
    if (temperature === 0) {
      // Greedy sampling - pick highest probability
      return probabilities.indexOf(Math.max(...probabilities));
    }
    
    // Apply temperature scaling
    const scaledProbs = probabilities.map(p => Math.exp(Math.log(p + 1e-8) / temperature));
    const sum = scaledProbs.reduce((a, b) => a + b, 0);
    const normalizedProbs = scaledProbs.map(p => p / sum);
    
    // Sample from the distribution
    const random = Math.random();
    let cumulative = 0;
    
    for (let i = 0; i < normalizedProbs.length; i++) {
      cumulative += normalizedProbs[i];
      if (random < cumulative) {
        return i;
      }
    }
    
    return normalizedProbs.length - 1;
  }

  // Step 6: Save model
  async saveModel(path = 'localstorage://lstm-text-model') {
    if (!this.model) {
      throw new Error('No model to save');
    }
    
    console.log('Saving model...');
    await this.model.save(path);
    console.log('Model saved successfully');
  }

  // Step 7: Load model
  async loadModel(path = 'localstorage://lstm-text-model') {
    console.log('Loading model...');
    try {
      this.model = await tf.loadLayersModel(path);
      console.log('Model loaded successfully');
      return this.model;
    } catch (error) {
      console.error('Failed to load model:', error);
      throw error;
    }
  }

  // Step 8: Get model info
  getModelInfo() {
    if (!this.model) {
      return null;
    }

    return {
      vocabSize: this.vocabSize,
      embeddingDim: this.embeddingDim,
      lstmUnits: this.lstmUnits,
      maxSequenceLength: this.maxSequenceLength,
      totalParams: this.model.countParams(),
      layers: this.model.layers.length
    };
  }

  // Step 9: Dispose model (free memory)
  dispose() {
    if (this.model) {
      this.model.dispose();
      this.model = null;
      console.log('Model disposed');
    }
  }
}

// Utility function to create and train a complete model
export async function createAndTrainModel(corpus, processor) {
  console.log('=== LSTM Text Suggestion Model Training ===');
  
  // Step 1: Build vocabulary
  const vocabSize = processor.buildVocabulary(corpus);
  
  // Step 2: Create training sequences
  const sequences = processor.createTrainingSequences(corpus);
  
  // Step 3: Initialize model
  const model = new LSTMTextModel(vocabSize);
  
  // Step 4: Build architecture
  model.buildModel();
  
  // Step 5: Prepare training data
  const trainingData = model.prepareTrainingData(sequences);
  
  // Step 6: Train model
  await model.trainModel(trainingData, 30, 16); // 30 epochs, batch size 16
  
  // Step 7: Save model
  await model.saveModel();
  
  console.log('=== Training Complete ===');
  return model;
}
