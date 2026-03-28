'use server';

import { createClient } from '@supabase/supabase-js';
import { encryptApiKey, SupplierFactory } from '@/lib/suppliers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function addSupplier(
  name: string,
  slug: string,
  apiType: string,
  apiKey: string,
  apiEndpoint: string,
  description?: string,
  isPrimary?: boolean
) {
  try {
    // Validate connection
    const client = SupplierFactory.createClient(apiType, apiKey, apiEndpoint);
    const isValid = await client.validateConnection();

    if (!isValid) {
      return {
        success: false,
        error: 'Failed to validate supplier connection. Check your API credentials.',
      };
    }

    // Encrypt API key
    const encryptedKey = encryptApiKey(apiKey);

    // Insert supplier
    const { data, error } = await supabase
      .from('suppliers')
      .insert({
        name,
        slug,
        api_type: apiType,
        api_key_encrypted: encryptedKey,
        api_endpoint: apiEndpoint,
        description,
        is_primary: isPrimary || false,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error('[v0] Error adding supplier:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('[v0] Error in addSupplier:', error);
    return {
      success: false,
      error: (error as Error).message,
    };
  }
}

export async function updateSupplier(
  supplierId: string,
  updates: {
    name?: string;
    description?: string;
    apiKey?: string;
    apiEndpoint?: string;
    isPrimary?: boolean;
    isActive?: boolean;
  }
) {
  try {
    const updateData: any = {};

    if (updates.name) updateData.name = updates.name;
    if (updates.description) updateData.description = updates.description;
    if (updates.apiKey) updateData.api_key_encrypted = encryptApiKey(updates.apiKey);
    if (updates.apiEndpoint) updateData.api_endpoint = updates.apiEndpoint;
    if (updates.isPrimary !== undefined) updateData.is_primary = updates.isPrimary;
    if (updates.isActive !== undefined) updateData.is_active = updates.isActive;

    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('suppliers')
      .update(updateData)
      .eq('id', supplierId)
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('[v0] Error updating supplier:', error);
    return {
      success: false,
      error: (error as Error).message,
    };
  }
}

export async function deleteSupplier(supplierId: string) {
  try {
    const { error } = await supabase
      .from('suppliers')
      .delete()
      .eq('id', supplierId);

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error('[v0] Error deleting supplier:', error);
    return {
      success: false,
      error: (error as Error).message,
    };
  }
}

export async function mapProductToSupplier(
  supplierId: string,
  productType: string,
  productName?: string,
  supplierProductId?: string,
  priority: number = 0
) {
  try {
    const { data, error } = await supabase
      .from('product_supplier_mappings')
      .upsert({
        supplier_id: supplierId,
        product_type: productType,
        product_name: productName,
        supplier_product_id: supplierProductId,
        priority,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('[v0] Error mapping product:', error);
    return {
      success: false,
      error: (error as Error).message,
    };
  }
}

export async function getSuppliers() {
  try {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .order('priority', { ascending: false });

    if (error) {
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }

    return {
      success: true,
      data: data || [],
    };
  } catch (error) {
    console.error('[v0] Error fetching suppliers:', error);
    return {
      success: false,
      error: (error as Error).message,
      data: [],
    };
  }
}

export async function getProductMappings(supplierId?: string) {
  try {
    let query = supabase.from('product_supplier_mappings').select('*');

    if (supplierId) {
      query = query.eq('supplier_id', supplierId);
    }

    const { data, error } = await query.order('priority', { ascending: false });

    if (error) {
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }

    return {
      success: true,
      data: data || [],
    };
  } catch (error) {
    console.error('[v0] Error fetching product mappings:', error);
    return {
      success: false,
      error: (error as Error).message,
      data: [],
    };
  }
}
