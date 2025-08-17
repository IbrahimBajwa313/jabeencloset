'use client';

import { useState, useEffect } from 'react';
import { useAISuggestions } from '@/hooks/use-ai-suggestions';
import { SmartInput } from '@/components/ui/smart-input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Brain, Sparkles, RefreshCw } from 'lucide-react';

export default function TestImprovedAIPage() {
  const { getSuggestions, aiStatus, retrain } = useAISuggestions();
  const [testInputs, setTestInputs] = useState({
    productName: '',
    description: '',
    features: '',
    tags: ''
  });
  const [isRetraining, setIsRetraining] = useState(false);

  const handleRetrain = async () => {
    setIsRetraining(true);
    try {
      // Clear localStorage to force retrain with new dataset
      localStorage.removeItem('lstm-model');
      localStorage.removeItem('lstm-vocabulary');
      
      await retrain();
      console.log('Model retrained with enhanced dataset');
    } catch (error) {
      console.error('Retrain failed:', error);
    } finally {
      setIsRetraining(false);
    }
  };

  const testPrompts = [
    "This elegant summer dress",
    "Our premium coffee blend",
    "Made from high-quality",
    "Features advanced technology",
    "Perfect for everyday",
    "Designed with comfort",
    "Natural ingredients that",
    "Waterproof design makes",
    "Lightweight construction provides"
  ];

  const fillTestPrompt = (prompt: string, field: keyof typeof testInputs) => {
    setTestInputs(prev => ({
      ...prev,
      [field]: prompt
    }));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Enhanced AI Text Suggestions Test</h1>
          <p className="text-muted-foreground mt-2">
            Testing improved LSTM model with comprehensive product dataset
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Badge variant={aiStatus === 'ready' ? 'default' : aiStatus === 'training' ? 'secondary' : 'destructive'}>
            {aiStatus === 'ready' && <Brain className="w-4 h-4 mr-1" />}
            {aiStatus === 'training' && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
            AI Status: {aiStatus}
          </Badge>
          
          <Button 
            onClick={handleRetrain}
            disabled={isRetraining || aiStatus === 'training'}
            variant="outline"
            size="sm"
          >
            {isRetraining ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Retrain Model
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Product Name Suggestions
            </CardTitle>
            <CardDescription>
              Type a few words and see Gmail-style completions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <SmartInput
              value={testInputs.productName}
              onChange={(value) => setTestInputs(prev => ({ ...prev, productName: value }))}
              placeholder="Start typing a product name..."
              getSuggestions={getSuggestions}
              aiStatus={aiStatus}
              className="w-full"
            />
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Quick Test Prompts:</p>
              <div className="flex flex-wrap gap-2">
                {testPrompts.slice(0, 4).map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => fillTestPrompt(prompt, 'productName')}
                    className="text-xs"
                  >
                    "{prompt}"
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Description Suggestions
            </CardTitle>
            <CardDescription>
              Test longer sentence completions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <SmartInput
              value={testInputs.description}
              onChange={(value) => setTestInputs(prev => ({ ...prev, description: value }))}
              placeholder="Start describing the product..."
              getSuggestions={getSuggestions}
              aiStatus={aiStatus}
              className="w-full"
              multiline
            />
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Test Sentence Starters:</p>
              <div className="flex flex-wrap gap-2">
                {testPrompts.slice(4, 8).map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => fillTestPrompt(prompt, 'description')}
                    className="text-xs"
                  >
                    "{prompt}"
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Features & Benefits</CardTitle>
            <CardDescription>Test feature descriptions</CardDescription>
          </CardHeader>
          <CardContent>
            <SmartInput
              value={testInputs.features}
              onChange={(value) => setTestInputs(prev => ({ ...prev, features: value }))}
              placeholder="List product features..."
              getSuggestions={getSuggestions}
              aiStatus={aiStatus}
              className="w-full"
              multiline
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Tags</CardTitle>
            <CardDescription>Test tag suggestions</CardDescription>
          </CardHeader>
          <CardContent>
            <SmartInput
              value={testInputs.tags}
              onChange={(value) => setTestInputs(prev => ({ ...prev, tags: value }))}
              placeholder="Add relevant tags..."
              getSuggestions={getSuggestions}
              aiStatus={aiStatus}
              className="w-full"
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Model Information</CardTitle>
          <CardDescription>Enhanced LSTM architecture details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">100+</div>
              <div className="text-sm text-muted-foreground">Training Sentences</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">2-Layer</div>
              <div className="text-sm text-muted-foreground">Stacked LSTM</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">256+128</div>
              <div className="text-sm text-muted-foreground">LSTM Units</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold">Dataset Categories:</h4>
            <div className="flex flex-wrap gap-2">
              {['Fashion & Apparel', 'Beauty & Personal Care', 'Electronics & Technology', 'Home & Garden', 'Food & Kitchen'].map((category) => (
                <Badge key={category} variant="secondary">{category}</Badge>
              ))}
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>
              <strong>Architecture:</strong> Embedding (100D) → LSTM (256) → LSTM (128) → Dense (256) → Dropout (40%) → Output
            </p>
            <p>
              <strong>Training:</strong> 50 epochs, batch size 32, Adam optimizer (lr=0.0005)
            </p>
            <p>
              <strong>Features:</strong> Temperature sampling, sentence boundary detection, context-aware completions
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
