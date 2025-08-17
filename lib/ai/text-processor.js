// Text preprocessing and tokenization for LSTM model
// This handles converting text to sequences that the neural network can understand

export class TextProcessor {
  constructor() {
    this.wordToIndex = new Map();
    this.indexToWord = new Map();
    this.vocabulary = new Set();
    this.maxSequenceLength = 30; // Increased for longer sequences
    this.vocabSize = 0;
  }

  // Step 1: Clean and normalize text
  cleanText(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s.,!?]/g, ' ') // Keep some punctuation for context
      .replace(/\s+/g, ' ')         // Normalize whitespace
      .trim();
  }

  // Step 2: Tokenize text into words
  tokenize(text) {
    const cleaned = this.cleanText(text);
    return cleaned.split(' ').filter(word => word.length > 0);
  }

  // Step 3: Build vocabulary from training corpus
  buildVocabulary(corpus) {
    console.log('Building vocabulary from corpus...');
    
    // Add special tokens
    this.vocabulary.add('<PAD>');  // Padding token
    this.vocabulary.add('<UNK>');  // Unknown token
    this.vocabulary.add('<START>'); // Start token
    this.vocabulary.add('<END>');   // End token
    
    // Process all texts in corpus
    corpus.forEach(text => {
      const tokens = this.tokenize(text);
      tokens.forEach(token => this.vocabulary.add(token));
    });

    // Create word-to-index and index-to-word mappings
    let index = 0;
    this.vocabulary.forEach(word => {
      this.wordToIndex.set(word, index);
      this.indexToWord.set(index, word);
      index++;
    });

    this.vocabSize = this.vocabulary.size;
    console.log(`Vocabulary built with ${this.vocabSize} unique words`);
    
    return this.vocabSize;
  }

  // Step 4: Convert text to sequence of indices
  textToSequence(text) {
    const tokens = this.tokenize(text);
    const sequence = tokens.map(token => 
      this.wordToIndex.get(token) || this.wordToIndex.get('<UNK>')
    );
    return sequence;
  }

  // Step 5: Convert sequence back to text
  sequenceToText(sequence) {
    return sequence
      .map(index => this.indexToWord.get(index) || '<UNK>')
      .filter(word => word !== '<PAD>')
      .join(' ');
  }

  // Step 6: Pad sequences to fixed length
  padSequence(sequence, maxLength = this.maxSequenceLength) {
    const padToken = this.wordToIndex.get('<PAD>');
    
    if (sequence.length >= maxLength) {
      return sequence.slice(0, maxLength);
    }
    
    const padded = [...sequence];
    while (padded.length < maxLength) {
      padded.push(padToken);
    }
    
    return padded;
  }

  // Step 7: Create training sequences (input-output pairs)
  createTrainingSequences(corpus) {
    console.log('Creating training sequences...');
    const sequences = [];
    
    corpus.forEach(text => {
      const tokens = ['<START>', ...this.tokenize(text), '<END>'];
      const indices = tokens.map(token => 
        this.wordToIndex.get(token) || this.wordToIndex.get('<UNK>')
      );
      
      // Create sliding window sequences
      for (let i = 0; i < indices.length - 1; i++) {
        const inputSeq = indices.slice(0, i + 1);
        const targetWord = indices[i + 1];
        
        if (inputSeq.length <= this.maxSequenceLength) {
          sequences.push({
            input: this.padSequence(inputSeq),
            target: targetWord
          });
        }
      }
    });
    
    console.log(`Created ${sequences.length} training sequences`);
    return sequences;
  }

  // Step 8: Convert sequences to tensors for TensorFlow
  sequencesToTensors(sequences) {
    const inputs = sequences.map(seq => seq.input);
    const targets = sequences.map(seq => seq.target);
    
    return {
      inputs: inputs,
      targets: targets
    };
  }

  // Step 9: Get word suggestions based on partial input
  getSuggestions(partialText, numSuggestions = 5) {
    const tokens = this.tokenize(partialText);
    const lastWord = tokens[tokens.length - 1] || '';
    
    // Find words that start with the last partial word
    const suggestions = [];
    this.vocabulary.forEach(word => {
      if (word.startsWith(lastWord) && 
          word !== lastWord && 
          !['<PAD>', '<UNK>', '<START>', '<END>'].includes(word)) {
        suggestions.push(word);
      }
    });
    
    return suggestions.slice(0, numSuggestions);
  }

  // Step 10: Prepare input for model prediction
  prepareInput(text) {
    const sequence = this.textToSequence(text);
    const padded = this.padSequence(sequence);
    return padded;
  }

  // Export vocabulary for model saving/loading
  exportVocabulary() {
    return {
      wordToIndex: Object.fromEntries(this.wordToIndex),
      indexToWord: Object.fromEntries(this.indexToWord),
      vocabSize: this.vocabSize,
      maxSequenceLength: this.maxSequenceLength
    };
  }

  // Import vocabulary for model loading
  importVocabulary(vocabData) {
    this.wordToIndex = new Map(Object.entries(vocabData.wordToIndex));
    this.indexToWord = new Map(Object.entries(vocabData.indexToWord).map(([k, v]) => [parseInt(k), v]));
    this.vocabSize = vocabData.vocabSize;
    this.maxSequenceLength = vocabData.maxSequenceLength;
    
    // Rebuild vocabulary set
    this.vocabulary = new Set(this.wordToIndex.keys());
  }
}

// Utility function to create one-hot encoded vectors
export function createOneHot(index, vocabSize) {
  const oneHot = new Array(vocabSize).fill(0);
  oneHot[index] = 1;
  return oneHot;
}

// Utility function to convert targets to one-hot encoding
export function targetsToOneHot(targets, vocabSize) {
  return targets.map(target => createOneHot(target, vocabSize));
}
