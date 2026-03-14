import { supabase } from './lib/supabase.js';

async function debugDescription() {
  try {
    console.log('🔍 Checking product descriptions in database...');
    
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, description')
      .limit(5);
    
    if (error) {
      console.error('❌ Error fetching products:', error);
      return;
    }
    
    console.log('📦 Found products:', products.length);
    
    products.forEach((product, index) => {
      console.log(`
Product ${index + 1}:
- ID: ${product.id}
- Name: ${product.name}
- Description: "${product.description || 'NULL'}"
- Description Type: ${typeof product.description}
- Description Length: ${product.description ? product.description.length : 0}
      `);
    });
    
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

debugDescription();
