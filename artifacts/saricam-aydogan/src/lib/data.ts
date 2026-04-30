import { getSupabase } from './supabase';
import { mockCategories, mockProducts, Category, Product } from './mockData';

export async function getCategories(): Promise<Category[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('categories').select('*').order('name');
      if (!error && data && data.length > 0) return data as Category[];
    } catch (e) {
      console.warn('Supabase fetch failed, using mock data');
    }
  }
  return mockCategories;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('categories').select('*').eq('slug', slug).single();
      if (!error && data) return data as Category;
    } catch (e) {
      console.warn('Supabase fetch failed, using mock data');
    }
  }
  return mockCategories.find(c => c.slug === slug) || null;
}

export async function getProducts(options?: { categorySlug?: string; search?: string; limit?: number; offset?: number }): Promise<Product[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      let query = supabase.from('products').select('*, categories!inner(slug)').order('created_at', { ascending: false });
      
      if (options?.categorySlug) {
        query = query.eq('categories.slug', options.categorySlug);
      }
      
      if (options?.search) {
        const term = options.search.replace(/[,()]/g, ' ');
        query = query.or(`name.ilike.%${term}%,description.ilike.%${term}%`);
      }
      
      if (options?.limit) {
        query = query.limit(options.limit);
        if (options.offset) {
          query = query.range(options.offset, options.offset + options.limit - 1);
        }
      }

      const { data, error } = await query;
      if (!error && data) return data as Product[];
    } catch (e) {
      console.warn('Supabase fetch failed, using mock data');
    }
  }

  // Fallback to mock data
  let filtered = [...mockProducts];
  
  if (options?.categorySlug) {
    const category = mockCategories.find(c => c.slug === options.categorySlug);
    if (category) {
      filtered = filtered.filter(p => p.category_id === category.id);
    } else {
      return [];
    }
  }
  
  if (options?.search) {
    const searchLower = options.search.toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(searchLower) || 
      p.description.toLowerCase().includes(searchLower)
    );
  }
  
  if (options?.offset !== undefined && options?.limit !== undefined) {
    filtered = filtered.slice(options.offset, options.offset + options.limit);
  } else if (options?.limit) {
    filtered = filtered.slice(0, options.limit);
  }
  
  return filtered;
}

export async function getFeaturedProducts(limit: number = 6): Promise<Product[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('products').select('*').eq('featured', true).limit(limit);
      if (!error && data && data.length > 0) return data as Product[];
    } catch (e) {
      console.warn('Supabase fetch failed, using mock data');
    }
  }
  return mockProducts.filter(p => p.featured).slice(0, limit);
}

export async function getProductBySlug(slug: string): Promise<{ product: Product; category: Category } | null> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('slug', slug)
        .single();
        
      if (!error && data) {
        return {
          product: data as Product,
          category: data.category as Category
        };
      }
    } catch (e) {
      console.warn('Supabase fetch failed, using mock data');
    }
  }
  
  const product = mockProducts.find(p => p.slug === slug);
  if (!product) return null;
  
  const category = mockCategories.find(c => c.id === product.category_id);
  if (!category) return null;
  
  return { product, category };
}
