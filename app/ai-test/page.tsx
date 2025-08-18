'use client';

import { useState } from 'react';
import { SimpleSmartInput } from '@/components/ui/simple-smart-input';

export default function AITestPage() {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">AI Text Suggestions Demo</h1>
        <p className="text-muted-foreground">
          Experience sentence autocomplete powered by AI
        </p>
      </div>
      
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <label className="block text-sm font-medium mb-3">Product Name</label>
          <SimpleSmartInput
            value={productName}
            onChange={setProductName}
            placeholder="Try typing: Our product is..."
            className="text-lg"
          />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <label className="block text-sm font-medium mb-3">Product Description</label>
          <SimpleSmartInput
            value={description}
            onChange={setDescription}
            placeholder="Try typing: This innovative solution..."
            multiline
            className="text-base"
          />
        </div>
      </div>
      
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
        <h3 className="font-semibold mb-3 text-gray-800">💡 Try these phrases:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="space-y-2">
            <div className="p-2 bg-white rounded border-l-4 border-blue-400">
              <strong>"Our"</strong> → product, innovative, commitment
            </div>
            <div className="p-2 bg-white rounded border-l-4 border-green-400">
              <strong>"Made from"</strong> → the finest materials
            </div>
            <div className="p-2 bg-white rounded border-l-4 border-purple-400">
              <strong>"Perfect for"</strong> → organizations looking
            </div>
          </div>
          <div className="space-y-2">
            <div className="p-2 bg-white rounded border-l-4 border-orange-400">
              <strong>"Features"</strong> → cutting-edge technology
            </div>
            <div className="p-2 bg-white rounded border-l-4 border-pink-400">
              <strong>"Designed"</strong> → with user experience
            </div>
            <div className="p-2 bg-white rounded border-l-4 border-indigo-400">
              <strong>"Built to"</strong> → withstand the demands
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-white rounded border text-xs text-gray-600">
          <strong>How it works:</strong> The AI analyzes patterns from 50+ professional sentences and predicts the next word as you type. 
          Use arrow keys to navigate suggestions and Tab/Enter to accept.
        </div>
      </div>
    </div>
  );
}
