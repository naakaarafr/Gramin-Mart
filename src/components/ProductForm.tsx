import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  unit: string;
  quantity_available: number;
  image_url?: string;
  organic: boolean;
  harvest_date?: string;
  expiry_date?: string;
}

interface ProductFormProps {
  product?: Product | null;
  onSave: () => void;
  onCancel: () => void;
}

const ProductForm = ({ product, onSave, onCancel }: ProductFormProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    unit: 'kg',
    quantity_available: '',
    image_url: '',
    organic: false,
    harvest_date: '',
    expiry_date: '',
    farmer_name: '',
    farmer_location: ''
  });

  const categories = [
    'vegetables',
    'fruits',
    'grains',
    'dairy',
    'spices',
    'pulses',
    'herbs',
    'nuts'
  ];

  const units = ['kg', 'grams', 'liters', 'pieces', 'bunches', 'bags'];

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        category: product.category,
        price: product.price.toString(),
        unit: product.unit,
        quantity_available: product.quantity_available.toString(),
        image_url: product.image_url || '',
        organic: product.organic,
        harvest_date: product.harvest_date || '',
        expiry_date: product.expiry_date || '',
        farmer_name: '',
        farmer_location: ''
      });
    }
  }, [product]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const productData = {
        farmer_id: user.id,
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        unit: formData.unit,
        quantity_available: parseInt(formData.quantity_available),
        image_url: formData.image_url || null,
        organic: formData.organic,
        harvest_date: formData.harvest_date || null,
        expiry_date: formData.expiry_date || null,
        farmer_name: formData.farmer_name || user.email?.split('@')[0] || 'Unknown Farmer',
        farmer_location: formData.farmer_location || 'India'
      };

      let error;

      if (product) {
        // Update existing product
        const { error: updateError } = await supabase
          .from('products')
          .update(productData)
          .eq('id', product.id);
        error = updateError;
      } else {
        // Create new product
        const { error: insertError } = await supabase
          .from('products')
          .insert([productData]);
        error = insertError;
      }

      if (error) throw error;

      toast({
        title: "Success",
        description: `Product ${product ? 'updated' : 'created'} successfully`
      });

      onSave();
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: `Failed to ${product ? 'update' : 'create'} product`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="e.g., Fresh Tomatoes"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => handleInputChange('price', e.target.value)}
            placeholder="0.00"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit">Unit *</Label>
          <Select value={formData.unit} onValueChange={(value) => handleInputChange('unit', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              {units.map((unit) => (
                <SelectItem key={unit} value={unit}>
                  {unit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity Available *</Label>
          <Input
            id="quantity"
            type="number"
            value={formData.quantity_available}
            onChange={(e) => handleInputChange('quantity_available', e.target.value)}
            placeholder="0"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image_url">Image URL</Label>
          <Input
            id="image_url"
            type="url"
            value={formData.image_url}
            onChange={(e) => handleInputChange('image_url', e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="harvest_date">Harvest Date</Label>
          <Input
            id="harvest_date"
            type="date"
            value={formData.harvest_date}
            onChange={(e) => handleInputChange('harvest_date', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expiry_date">Expiry Date</Label>
          <Input
            id="expiry_date"
            type="date"
            value={formData.expiry_date}
            onChange={(e) => handleInputChange('expiry_date', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="farmer_name">Your Name</Label>
          <Input
            id="farmer_name"
            value={formData.farmer_name}
            onChange={(e) => handleInputChange('farmer_name', e.target.value)}
            placeholder="Your farmer name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="farmer_location">Farm Location</Label>
          <Input
            id="farmer_location"
            value={formData.farmer_location}
            onChange={(e) => handleInputChange('farmer_location', e.target.value)}
            placeholder="e.g., Mumbai, Maharashtra"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Describe your product, quality, farming methods, etc."
          rows={3}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="organic"
          checked={formData.organic}
          onCheckedChange={(checked) => handleInputChange('organic', checked)}
        />
        <Label htmlFor="organic">Organic Product</Label>
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? 'Saving...' : (product ? 'Update Product' : 'Add Product')}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;