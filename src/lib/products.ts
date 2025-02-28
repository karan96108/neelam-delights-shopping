
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  weight: string;
  origin: string;
  grade: string;
  featured: boolean;
}

export const products: Product[] = [
  {
    id: "kesar-premium-1g",
    name: "Premium Kashmiri Kesar",
    description: "Our finest grade of Kashmiri saffron, hand-picked and carefully selected for its exceptional aroma, flavor, and color. Perfect for special occasions and gourmet dishes.",
    price: 599,
    image: "https://images.unsplash.com/photo-1623227413711-25ee4388dae3?q=80&w=1480&auto=format&fit=crop",
    weight: "1g",
    origin: "Kashmir, India",
    grade: "Premium",
    featured: true
  },
  {
    id: "kesar-standard-1g",
    name: "Standard Kashmiri Kesar",
    description: "High-quality Kashmiri saffron with excellent aroma and flavor. Ideal for everyday cooking and traditional recipes that call for authentic saffron.",
    price: 499,
    image: "https://images.unsplash.com/photo-1596040033229-a9821eec2be4?q=80&w=1480&auto=format&fit=crop",
    weight: "1g",
    origin: "Kashmir, India",
    grade: "Standard",
    featured: false
  },
  {
    id: "kesar-premium-2g",
    name: "Premium Kashmiri Kesar",
    description: "Our finest grade of Kashmiri saffron in a larger quantity. Hand-picked and carefully selected for exceptional quality.",
    price: 1099,
    image: "https://images.unsplash.com/photo-1615484477778-ca3b77940c25?q=80&w=1480&auto=format&fit=crop",
    weight: "2g",
    origin: "Kashmir, India",
    grade: "Premium",
    featured: true
  },
  {
    id: "kesar-standard-2g",
    name: "Standard Kashmiri Kesar",
    description: "High-quality Kashmiri saffron in a larger quantity. Excellent for regular use in your gourmet dishes.",
    price: 899,
    image: "https://images.unsplash.com/photo-1615485290398-c80c8c59a277?q=80&w=1480&auto=format&fit=crop",
    weight: "2g",
    origin: "Kashmir, India",
    grade: "Standard",
    featured: false
  },
  {
    id: "kesar-premium-5g",
    name: "Premium Kashmiri Kesar",
    description: "Our finest grade of Kashmiri saffron in a value pack. Perfect for restaurants and frequent users who demand the best quality.",
    price: 2499,
    image: "https://images.unsplash.com/photo-1600183952386-832b4e8aad72?q=80&w=1480&auto=format&fit=crop",
    weight: "5g",
    origin: "Kashmir, India",
    grade: "Premium",
    featured: false
  },
  {
    id: "kesar-standard-5g",
    name: "Standard Kashmiri Kesar",
    description: "High-quality Kashmiri saffron in a value pack. An economical choice for regular saffron users.",
    price: 1999,
    image: "https://images.unsplash.com/photo-1596040033282-5b7ed7033938?q=80&w=1480&auto=format&fit=crop",
    weight: "5g",
    origin: "Kashmir, India",
    grade: "Standard",
    featured: false
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured);
};
