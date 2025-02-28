
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '@/lib/products';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Star, ArrowLeft, Award, CheckCircle } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  
  const product = id ? getProductById(id) : null;
  
  if (!product) {
    return (
      <div className="container-custom py-16 text-center">
        <h1 className="text-2xl font-serif mb-4">Product Not Found</h1>
        <p className="mb-6">Sorry, the product you're looking for doesn't exist or has been removed.</p>
        <Link to="/products" className="button-primary">
          Browse Products
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="container-custom py-12">
      <Link to="/products" className="flex items-center text-gray-600 hover:text-primary mb-8 transition-colors">
        <ArrowLeft size={20} className="mr-2" />
        Back to Products
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Product Image */}
        <div className="rounded-lg overflow-hidden border border-gray-100">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover" 
          />
        </div>
        
        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                {product.grade}
              </span>
              {product.featured && (
                <span className="inline-flex items-center px-3 py-1 bg-saffron-100 text-saffron-800 rounded-full text-sm font-medium">
                  <Award size={16} className="mr-1" /> Featured
                </span>
              )}
            </div>
            <h1 className="text-3xl font-serif font-bold mt-2">{product.name}</h1>
            <p className="text-gray-600 mt-1">{product.weight} • {product.origin}</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  size={20} 
                  className={star <= 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} 
                />
              ))}
            </div>
            <span className="text-gray-600 text-sm">4.0 (120 reviews)</span>
          </div>
          
          <div className="text-3xl font-bold">₹{product.price.toFixed(2)}</div>
          
          <div className="border-t border-b border-gray-100 py-6">
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center text-gray-700">
              <CheckCircle size={20} className="text-green-500 mr-2" />
              <span>100% Authentic Kashmiri Saffron</span>
            </div>
            <div className="flex items-center text-gray-700">
              <CheckCircle size={20} className="text-green-500 mr-2" />
              <span>Free shipping on orders above ₹1000</span>
            </div>
            <div className="flex items-center text-gray-700">
              <CheckCircle size={20} className="text-green-500 mr-2" />
              <span>Secure Payment Options</span>
            </div>
          </div>
          
          <div className="pt-4 flex space-x-4">
            <button 
              onClick={handleAddToCart}
              className="button-primary flex items-center justify-center flex-1"
            >
              <ShoppingBag size={20} className="mr-2" />
              Add to Cart
            </button>
            <Link 
              to="/checkout" 
              onClick={handleAddToCart}
              className="button-secondary flex items-center justify-center flex-1"
            >
              Buy Now
            </Link>
          </div>
        </div>
      </div>
      
      {/* Additional Sections */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-xl font-serif font-semibold mb-4">Product Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-600">Weight</span>
              <span className="font-medium">{product.weight}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-600">Origin</span>
              <span className="font-medium">{product.origin}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-600">Grade</span>
              <span className="font-medium">{product.grade}</span>
            </div>
            <div className="flex justify-between pb-2">
              <span className="text-gray-600">Category</span>
              <span className="font-medium">Spices</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-xl font-serif font-semibold mb-4">How to Use</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="inline-block bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
              <span>Steep a few strands in warm water or milk for 10-15 minutes.</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
              <span>Add to rice dishes during the last 5 minutes of cooking.</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
              <span>Mix into desserts like kheer, basundi, or kulfi.</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">4</span>
              <span>Use in traditional recipes like biryani, pulao, and curries.</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-xl font-serif font-semibold mb-4">Storage Instructions</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="inline-block bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">•</span>
              <span>Store in an airtight container.</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">•</span>
              <span>Keep in a cool, dry place away from direct sunlight.</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">•</span>
              <span>For long-term storage, refrigeration is recommended.</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">•</span>
              <span>Properly stored saffron can maintain its quality for up to two years.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
