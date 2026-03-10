'use client';

import { useState, useEffect } from 'react';
import { fetchProductsByTypeAndCategory } from '@/lib/supabase';

export default function TestPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('=== TEST PAGE USE EFFECT START ===');
    
    async function loadProducts() {
      try {
        console.log('1. Setting loading to true...');
        setLoading(true);
        setError(null);
        
        console.log('2. Calling fetchProductsByTypeAndCategory...');
        const data = await fetchProductsByTypeAndCategory('warung_sayur');
        
        console.log('3. Data received:', data);
        console.log('4. Data length:', data?.length);
        
        setProducts(data || []);
        console.log('5. Products set in state');
        
      } catch (err) {
        console.error('6. Error in fetch:', err);
        setError(err.message);
      } finally {
        console.log('7. Setting loading to false...');
        setLoading(false);
      }
    }
    
    loadProducts();
  }, []);

  console.log('8. Current state:', { loading, error, productsLength: products.length });

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-2xl font-bold mb-4">TEST PAGE - PRODUCT LOADING</h1>
      
      <div className="mb-4">
        <p>Loading: {loading ? 'YES' : 'NO'}</p>
        <p>Error: {error || 'NONE'}</p>
        <p>Products Count: {products.length}</p>
      </div>

      {loading && <p>Loading products...</p>}
      
      {error && (
        <div className="bg-red-100 p-4 rounded mb-4">
          <p className="text-red-700">Error: {error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded">
            <h3 className="font-bold">{product.name}</h3>
            <p className="text-sm">Price: Rp {product.price}</p>
            <p className="text-sm">Category: {product.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
