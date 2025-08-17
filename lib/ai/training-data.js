// Training data for LSTM text suggestions
// This contains sample product names and descriptions for training

export const productNames = [
  // Fashion & Clothing
  "Elegant Summer Dress with Floral Pattern",
  "Classic Denim Jacket for Women",
  "Comfortable Cotton T-Shirt",
  "Stylish High-Waisted Jeans",
  "Luxurious Silk Blouse",
  "Casual Sneakers for Daily Wear",
  "Professional Business Suit",
  "Cozy Knit Sweater",
  "Trendy Crop Top",
  "Vintage Leather Boots",
  "Soft Cashmere Scarf",
  "Designer Handbag Collection",
  "Comfortable Yoga Pants",
  "Elegant Evening Gown",
  "Warm Winter Coat",
  "Stylish Sunglasses",
  "Beautiful Pearl Necklace",
  "Comfortable Running Shoes",
  "Chic Mini Skirt",
  "Cozy Pajama Set",
  
  // Beauty & Cosmetics
  "Moisturizing Face Cream with SPF",
  "Long-Lasting Lipstick Collection",
  "Natural Organic Shampoo",
  "Anti-Aging Serum with Vitamin C",
  "Waterproof Mascara",
  "Gentle Facial Cleanser",
  "Nourishing Hair Mask",
  "Matte Foundation for All Skin Types",
  "Hydrating Body Lotion",
  "Exfoliating Sugar Scrub",
  
  // Electronics & Accessories
  "Wireless Bluetooth Headphones",
  "Smartphone Case with Card Holder",
  "Portable Power Bank",
  "Wireless Charging Pad",
  "Bluetooth Speaker with Bass",
  "Smart Fitness Tracker",
  "USB-C Cable Set",
  "Phone Screen Protector",
  "Laptop Sleeve Bag",
  "Wireless Mouse and Keyboard",
  
  // Home & Lifestyle
  "Scented Candle Collection",
  "Soft Throw Pillow",
  "Decorative Wall Art",
  "Essential Oil Diffuser",
  "Cozy Blanket for Winter",
  "Modern Table Lamp",
  "Ceramic Coffee Mug Set",
  "Indoor Plant Pot",
  "Wooden Picture Frame",
  "Aromatherapy Bath Bombs"
];

export const productDescriptions = [
  // Fashion descriptions
  "This elegant dress features a beautiful floral pattern perfect for summer occasions. Made from breathable cotton fabric with a comfortable fit.",
  "A timeless denim jacket crafted from premium quality denim. Perfect for layering and adds a casual touch to any outfit.",
  "Soft and comfortable cotton t-shirt available in multiple colors. Perfect for everyday wear with a relaxed fit.",
  "High-waisted jeans with a flattering silhouette. Made from stretch denim for comfort and style.",
  "Luxurious silk blouse with elegant draping. Perfect for professional settings or special occasions.",
  "Comfortable sneakers designed for all-day wear. Features cushioned sole and breathable material.",
  "Professional business suit tailored for the modern woman. Includes blazer and matching trousers.",
  "Cozy knit sweater perfect for cooler weather. Made from soft wool blend with ribbed details.",
  "Trendy crop top with modern styling. Perfect for casual outings and summer events.",
  "Vintage-inspired leather boots with durable construction. Features comfortable heel and classic design.",
  
  // Beauty descriptions
  "Moisturizing face cream with SPF protection. Provides all-day hydration while protecting from UV rays.",
  "Long-lasting lipstick collection in various shades. Provides rich color and comfortable wear.",
  "Natural organic shampoo free from harsh chemicals. Gently cleanses while nourishing hair.",
  "Anti-aging serum enriched with Vitamin C. Helps reduce fine lines and brightens skin tone.",
  "Waterproof mascara that stays put all day. Creates voluminous lashes without smudging.",
  "Gentle facial cleanser suitable for all skin types. Removes impurities while maintaining skin balance.",
  "Nourishing hair mask for damaged hair. Provides deep conditioning and restores shine.",
  "Matte foundation with full coverage. Available in multiple shades for all skin tones.",
  "Hydrating body lotion with natural ingredients. Provides long-lasting moisture and soft skin.",
  "Exfoliating sugar scrub for smooth skin. Removes dead skin cells and reveals radiant complexion.",
  
  // Electronics descriptions
  "Wireless Bluetooth headphones with superior sound quality. Features noise cancellation and long battery life.",
  "Protective smartphone case with built-in card holder. Provides protection while keeping essentials handy.",
  "Portable power bank with fast charging capability. Compact design perfect for travel and daily use.",
  "Wireless charging pad compatible with all Qi-enabled devices. Provides convenient cable-free charging.",
  "Bluetooth speaker with enhanced bass response. Waterproof design perfect for outdoor activities.",
  "Smart fitness tracker with heart rate monitoring. Tracks steps, calories, and sleep patterns.",
  "Durable USB-C cable set for fast data transfer. Compatible with various devices and built to last.",
  "Tempered glass screen protector for maximum protection. Easy installation with bubble-free application.",
  "Padded laptop sleeve bag with secure closure. Provides protection during transport and storage.",
  "Wireless mouse and keyboard combo for productivity. Ergonomic design with long battery life.",
  
  // Home & Lifestyle descriptions
  "Scented candle collection with natural soy wax. Creates relaxing ambiance with long-lasting fragrance.",
  "Soft throw pillow with premium filling. Adds comfort and style to any living space.",
  "Decorative wall art featuring modern abstract design. Perfect for contemporary home decor.",
  "Essential oil diffuser with ultrasonic technology. Creates calming atmosphere with aromatherapy benefits.",
  "Cozy blanket made from soft fleece material. Perfect for snuggling during cold winter nights.",
  "Modern table lamp with adjustable brightness. Features sleek design and energy-efficient LED bulbs.",
  "Ceramic coffee mug set with elegant patterns. Dishwasher safe and perfect for daily use.",
  "Indoor plant pot with drainage system. Made from sustainable materials with modern styling.",
  "Wooden picture frame with natural finish. Perfect for displaying cherished memories and artwork.",
  "Aromatherapy bath bombs with essential oils. Transform your bath into a spa-like experience."
];

// Sentence completion patterns for better AI training
export const sentencePatterns = [
  "This elegant dress features",
  "Made from premium quality",
  "Perfect for everyday wear",
  "Designed with comfort in mind",
  "Features a modern and stylish",
  "Crafted from sustainable materials",
  "Ideal for professional settings",
  "Provides exceptional comfort and",
  "Available in multiple colors and",
  "Suitable for all skin types",
  "Long-lasting formula that",
  "Waterproof design perfect for",
  "Wireless technology with enhanced",
  "Natural ingredients that nourish",
  "Lightweight construction for maximum",
  "Durable materials built to last",
  "Easy to use with intuitive",
  "Versatile design that complements",
  "Beautiful finish that adds",
  "Premium quality at an affordable",
  "Comfortable fit with adjustable",
  "Stylish appearance that enhances",
  "High-performance features including",
  "Eco-friendly materials that are",
  "Handcrafted with attention to detail",
  "Breathable fabric that keeps you",
  "Soft texture that feels luxurious",
  "Modern design with classic elements",
  "Professional quality for home use",
  "Trendy style that never goes"
];

// Combined training corpus with sentence patterns
export const trainingCorpus = [...productNames, ...productDescriptions, ...sentencePatterns];

// Common product keywords and phrases for better suggestions
export const commonPhrases = [
  "comfortable", "stylish", "elegant", "modern", "classic", "premium", "luxury",
  "soft", "durable", "lightweight", "breathable", "waterproof", "wireless",
  "natural", "organic", "eco-friendly", "sustainable", "handmade", "artisan",
  "perfect for", "ideal for", "great for", "suitable for", "designed for",
  "made from", "crafted from", "features", "includes", "provides", "offers",
  "high-quality", "long-lasting", "easy to use", "user-friendly", "versatile",
  "beautiful", "gorgeous", "stunning", "attractive", "fashionable", "trendy"
];
