export const products = [
  {
    id: 'goli-bull-night',
    slug: 'goli-bull-night',
    name: 'Goli Bull Night',
    tagline: 'Recharge Your Confidence.',
    shortDesc: 'A premium Ayurvedic men\'s wellness supplement crafted to support vitality, strength, endurance and an active lifestyle.',
    price: 1299,
    mrp: 1999,
    discount: 35,
    category: 'mens-wellness',
    badge: 'Best Seller',
    badgeColor: 'gold',
    images: [null, null, null, null],
    variants: [
      { id: 'v1', label: '1 Month Supply', price: 1299, mrp: 1999 },
      { id: 'v2', label: '3 Month Supply (Buy 2 Get 1 Free)', price: 2598, mrp: 5997, savings: 3399 },
      { id: 'v3', label: '6 Month Supply', price: 4499, mrp: 11994, savings: 7495 },
    ],
    benefits: [
      'Supports Men\'s Vitality',
      'Supports Active Lifestyle',
      'Helps Reduce Fatigue',
      'Supports Strength & Endurance',
      'Ayurvedic Formulation',
    ],
    ingredients: [
      { name: 'Ashwagandha', desc: 'Traditionally used to support energy and vitality.', icon: '🌿' },
      { name: 'Shilajit', desc: 'Ancient mineral resin known for supporting male wellness.', icon: '⚫' },
      { name: 'Safed Musli', desc: 'Popular Ayurvedic herb for strength and stamina.', icon: '🌾' },
      { name: 'Gokhru', desc: 'Traditionally valued for men\'s wellbeing.', icon: '🌱' },
      { name: 'Shatavari', desc: 'Supports overall wellness and balance.', icon: '🍃' },
      { name: 'Kaunch Beej', desc: 'Classical Ayurvedic herb for vitality support.', icon: '🫘' },
    ],
    howToUse: 'Take 1-2 capsules with warm milk before bedtime, or as directed by your Ayurvedic practitioner.',
    rating: 4.8,
    reviewCount: 2847,
    stock: 23,
    isLowStock: true,
    reviews: [
      { id: 1, name: 'Rajesh K.', rating: 5, date: '2024-11-15', text: 'Excellent product quality. I have been using it for 2 months and feel a noticeable difference in my energy levels throughout the day.', verified: true, helpful: 234 },
      { id: 2, name: 'Amit S.', rating: 5, date: '2024-11-02', text: 'Great addition to my daily wellness routine. Premium packaging and fast delivery.', verified: true, helpful: 178 },
      { id: 3, name: 'Vikas M.', rating: 5, date: '2024-10-28', text: 'I was skeptical at first but this product has genuinely helped with my fatigue. Highly recommend.', verified: true, helpful: 156 },
      { id: 4, name: 'Suresh P.', rating: 4, date: '2024-10-20', text: 'Good quality product. Takes time to show results but worth the wait. Customer support was very helpful.', verified: true, helpful: 98 },
    ],
    seo: {
      title: 'Goli Bull Night — Premium Ayurvedic Men\'s Vitality Supplement | Nama Pharma',
      description: 'Goli Bull Night is a premium Ayurvedic supplement for men\'s vitality, strength and endurance. Made with Ashwagandha, Shilajit, Safed Musli. Shop now.',
      keywords: 'gold bull night, ayurvedic supplement, men vitality, ashwagandha, shilajit, nama pharma',
    }
  },
  {
    id: 'majoon-moosli',
    slug: 'majoon-moosli',
    name: 'Majoon Moosli',
    tagline: 'Natural Strength. Daily Energy.',
    shortDesc: 'A traditional Ayurvedic formulation enriched with Ashwagandha, Safed Musli and Shatavari for daily strength and vitality.',
    price: 999,
    mrp: 1499,
    discount: 33,
    category: 'mens-wellness',
    badge: 'Traditional Recipe',
    badgeColor: 'emerald',
    images: [null, null, null, null],
    variants: [
      { id: 'v1', label: '1 Month Supply', price: 999, mrp: 1499 },
      { id: 'v2', label: '3 Month Supply (Buy 2 Get 1 Free)', price: 1998, mrp: 4497, savings: 2499 },
      { id: 'v3', label: '6 Month Supply', price: 3499, mrp: 8994, savings: 5495 },
    ],
    benefits: [
      'Supports Daily Energy',
      'Supports Strength',
      'Supports Overall Wellbeing',
      'Herbal Formula',
      'Traditional Ayurvedic Ingredients',
    ],
    ingredients: [
      { name: 'Safed Musli', desc: 'Key herb known for supporting strength and stamina.', icon: '🌾' },
      { name: 'Ashwagandha', desc: 'Adaptogen for stress and energy support.', icon: '🌿' },
      { name: 'Shatavari', desc: 'Supports overall wellness and balance.', icon: '🍃' },
      { name: 'Vidarikand', desc: 'Traditional Ayurvedic tonic herb.', icon: '🌱' },
      { name: 'Gokshura', desc: 'Valued for men\'s health support.', icon: '⭐' },
      { name: 'Pure Honey Base', desc: 'Natural preservative and binding agent.', icon: '🍯' },
    ],
    howToUse: 'Take 1 teaspoon (5-10g) with warm milk in the morning, or as directed. Can be taken twice daily for best results.',
    rating: 4.7,
    reviewCount: 1923,
    stock: 47,
    isLowStock: false,
    reviews: [
      { id: 1, name: 'Pradeep R.', rating: 5, date: '2024-11-10', text: 'Traditional recipe with modern quality standards. I love that it uses natural honey as a base. Tastes good too!', verified: true, helpful: 189 },
      { id: 2, name: 'Mahesh T.', rating: 5, date: '2024-10-25', text: 'My grandfather used to take Majoon and now I understand why. Great product by Nama Pharma.', verified: true, helpful: 145 },
      { id: 3, name: 'Kiran B.', rating: 4, date: '2024-10-18', text: 'Authentic formulation. Noticed improvement in my daily energy within 3 weeks. Will order again.', verified: true, helpful: 112 },
    ],
    seo: {
      title: 'Majoon Moosli — Traditional Ayurvedic Strength Formula | Nama Pharma',
      description: 'Majoon Moosli is a traditional Ayurvedic formulation with Safed Musli, Ashwagandha & Shatavari for natural strength and daily energy. Shop now.',
      keywords: 'majoon moosli, safed musli, ashwagandha, ayurvedic tonic, men energy, nama pharma',
    }
  }
]

export const getProduct = (slug) => products.find(p => p.slug === slug)

export const formatPrice = (p) => `₹${p.toLocaleString('en-IN')}`
