'use client';

import { useState } from 'react';
import { SimpleSmartInput } from '@/components/ui/simple-smart-input';

export default function SimpleTestPage() {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Gmail-Style Autocomplete Test</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Product Name</label>
          <SimpleSmartInput
            value={productName}
            onChange={setProductName}
            placeholder="Try typing: Our product is..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <SimpleSmartInput
            value={description}
            onChange={setDescription}
            placeholder="Try typing: This product is..."
            multiline
          />
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 rounded">
        <h3 className="font-medium mb-2">Try these phrases:</h3>
        <ul className="text-sm space-y-1">
          <li>• "Our product is" → "designed to help businesses grow"</li>
          <li>• "Made from" → "high-quality materials that last"</li>
          <li>• "Perfect for" → "professionals and everyday users"</li>
          <li>• "Features" → "advanced technology and modern design"</li>
        </ul>
      </div>
    </div>
  );
}
