'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  addSupplier,
  updateSupplier,
  deleteSupplier,
  getSuppliers,
  mapProductToSupplier,
} from '@/app/actions/suppliers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Plus, Trash2, Edit2, Check } from 'lucide-react';

const SUPPLIER_TYPES = [
  { id: 'printful', name: 'Printful', description: 'Popular print-on-demand' },
  { id: 'printfusion', name: 'Printfusion', description: 'Custom engraving specialist' },
  { id: 'printnode', name: 'Printnode', description: 'Volume supplier' },
  { id: 'custom', name: 'Custom Supplier', description: 'Custom setup' },
];

const PRODUCTS = [
  { id: 'wooden-keychain-necklace', name: 'Memorial QR Code Wooden Keychain or Necklace' },
  { id: 'slate-memorial-coaster', name: 'Memorial Slate Coaster with QR Code' },
  { id: 'memorial-photo-frame', name: 'Memorial Photo Frame with QR Code' },
];

export default function SuppliersPage() {
  const router = useRouter();
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    apiType: '',
    apiKey: '',
    apiEndpoint: '',
    description: '',
    isPrimary: false,
  });

  useEffect(() => {
    loadSuppliers();
  }, []);

  async function loadSuppliers() {
    setLoading(true);
    try {
      const result = await getSuppliers();
      if (result.success) {
        setSuppliers(result.data);
      }
    } catch (error) {
      console.error('[v0] Error loading suppliers:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingId) {
        const result = await updateSupplier(editingId, {
          name: formData.name,
          description: formData.description,
          apiKey: formData.apiKey,
          apiEndpoint: formData.apiEndpoint,
          isPrimary: formData.isPrimary,
        });

        if (result.success) {
          setDialogOpen(false);
          resetForm();
          await loadSuppliers();
        } else {
          alert(`Error: ${result.error}`);
        }
      } else {
        const result = await addSupplier(
          formData.name,
          formData.slug,
          formData.apiType,
          formData.apiKey,
          formData.apiEndpoint,
          formData.description,
          formData.isPrimary
        );

        if (result.success) {
          setDialogOpen(false);
          resetForm();
          await loadSuppliers();
        } else {
          alert(`Error: ${result.error}`);
        }
      }
    } catch (error) {
      console.error('[v0] Error submitting form:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this supplier?')) return;

    try {
      const result = await deleteSupplier(id);
      if (result.success) {
        await loadSuppliers();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('[v0] Error deleting supplier:', error);
    }
  }

  function resetForm() {
    setFormData({
      name: '',
      slug: '',
      apiType: '',
      apiKey: '',
      apiEndpoint: '',
      description: '',
      isPrimary: false,
    });
    setEditingId(null);
  }

  function openAddDialog() {
    resetForm();
    setDialogOpen(true);
  }

  function openEditDialog(supplier: any) {
    setFormData({
      name: supplier.name,
      slug: supplier.slug,
      apiType: supplier.api_type,
      apiKey: '', // Don't show encrypted key
      apiEndpoint: supplier.api_endpoint,
      description: supplier.description || '',
      isPrimary: supplier.is_primary,
    });
    setEditingId(supplier.id);
    setDialogOpen(true);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dropshipping Suppliers</h1>
          <p className="text-gray-600 mt-2">
            Manage dropshipping suppliers and route orders to them automatically.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Supplier
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Supplier' : 'Add New Supplier'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Supplier Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Printful US"
                  required
                />
              </div>

              {!editingId && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Slug</label>
                    <Input
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="e.g., printful-us"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Supplier Type</label>
                    <Select value={formData.apiType} onValueChange={(value) => setFormData({ ...formData, apiType: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select supplier type" />
                      </SelectTrigger>
                      <SelectContent>
                        {SUPPLIER_TYPES.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name} - {type.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">API Endpoint</label>
                <Input
                  value={formData.apiEndpoint}
                  onChange={(e) => setFormData({ ...formData, apiEndpoint: e.target.value })}
                  placeholder="https://api.supplier.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">API Key</label>
                <Input
                  type="password"
                  value={formData.apiKey}
                  onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                  placeholder="Your API key"
                  required={!editingId}
                />
                {editingId && <p className="text-xs text-gray-500 mt-1">Leave blank to keep current key</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional notes about this supplier"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPrimary"
                  checked={formData.isPrimary}
                  onChange={(e) => setFormData({ ...formData, isPrimary: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="isPrimary" className="text-sm font-medium">
                  Set as primary supplier
                </label>
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingId ? 'Update' : 'Add'} Supplier
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {suppliers.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-gray-600">No suppliers configured yet. Add your first supplier to get started.</p>
          </Card>
        ) : (
          suppliers.map((supplier) => (
            <Card key={supplier.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{supplier.name}</h3>
                    <Badge variant="outline">{supplier.api_type}</Badge>
                    {supplier.is_primary && <Badge variant="default">Primary</Badge>}
                    {!supplier.is_active && <Badge variant="destructive">Inactive</Badge>}
                  </div>
                  {supplier.description && <p className="text-gray-600 text-sm mb-2">{supplier.description}</p>}
                  <p className="text-xs text-gray-500">
                    Endpoint: <span className="font-mono">{supplier.api_endpoint}</span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditDialog(supplier)}
                    className="gap-1"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(supplier.id)}
                    className="gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {suppliers.length > 0 && (
        <div className="mt-12 pt-8 border-t">
          <h2 className="text-2xl font-bold mb-6">Product Routing</h2>
          <ProductMappings suppliers={suppliers} />
        </div>
      )}
    </div>
  );
}

function ProductMappings({ suppliers }: { suppliers: any[] }) {
  return (
    <div className="space-y-4">
      <p className="text-gray-600">
        Configure which supplier handles each product. You can route different products to different suppliers.
      </p>
      <div className="grid gap-4">
        {PRODUCTS.map((product) => (
          <ProductRoutingCard key={product.id} product={product} suppliers={suppliers} />
        ))}
      </div>
    </div>
  );
}

function ProductRoutingCard({
  product,
  suppliers,
}: {
  product: { id: string; name: string };
  suppliers: any[];
}) {
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');
  const [isMapping, setIsMapping] = useState(false);

  async function handleRoute() {
    if (!selectedSupplier) return;

    setIsMapping(true);
    try {
      const result = await mapProductToSupplier(selectedSupplier, product.id, product.name);
      if (result.success) {
        alert('Product routed successfully!');
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('[v0] Error routing product:', error);
    } finally {
      setIsMapping(false);
    }
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <p className="font-medium">{product.name}</p>
          <p className="text-sm text-gray-500">{product.id}</p>
        </div>
        <div className="flex gap-2 items-center">
          <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select supplier" />
            </SelectTrigger>
            <SelectContent>
              {suppliers.map((supplier) => (
                <SelectItem key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            size="sm"
            onClick={handleRoute}
            disabled={!selectedSupplier || isMapping}
            className="gap-1"
          >
            {isMapping && <Loader2 className="w-4 h-4 animate-spin" />}
            {isMapping ? 'Routing...' : <Check className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </Card>
  );
}
