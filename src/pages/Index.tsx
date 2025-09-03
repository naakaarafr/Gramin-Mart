import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Truck, Shield, Headphones, Award, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";

interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  image_url?: string;
  farmer_name: string;
  farmer_location: string;
  category: string;
  organic: boolean;
  quantity_available: number;
  harvest_date?: string;
  expiry_date?: string;
  description?: string;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleProducts, setVisibleProducts] = useState(8);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, totalItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Fetch products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .gt('quantity_available', 0)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching products:', error);
          toast({
            title: "Error loading products",
            description: "Could not load products. Please try again later.",
            variant: "destructive"
          });
          return;
        }

        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "Error loading products",
          description: "Could not load products. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      // Transform database product to cart format
      const cartProduct = {
        id: product.id,
        name: product.name,
        price: Number(product.price),
        unit: product.unit,
        image: product.image_url || "https://images.unsplash.com/photo-1546470427-e71b4be8b034?w=400&h=400&fit=crop",
        farmer: {
          name: product.farmer_name,
          location: product.farmer_location,
          rating: 4.5 // Default rating for now
        },
        category: product.category,
        freshness: product.harvest_date ? 
          new Date(product.harvest_date).toLocaleDateString() === new Date().toLocaleDateString() ? 
          "Harvested Today" : `${Math.ceil((new Date().getTime() - new Date(product.harvest_date).getTime()) / (1000 * 3600 * 24))} days old`
          : "Fresh",
        organic: product.organic,
        inStock: product.quantity_available > 0
      };
      
      addToCart(cartProduct);
      toast({
        title: "Added to cart!",
        description: `${product.name} has been added to your cart.`,
      });
    }
  };

  const handleToggleWishlist = (productId: string) => {
    const product = products.find(p => p.id === productId);
    toast({
      title: "Wishlist updated!",
      description: `${product?.name} has been added to your wishlist.`,
    });
  };

  const handleLoadMore = () => {
    setVisibleProducts(prev => prev + 8);
    toast({
      title: "Loading more products...",
      description: "Fetching fresh produce from more farmers!",
    });
  };

  const handleSupportFarmers = () => {
    // Scroll to products or navigate to a support page
    const productsSection = document.querySelector('[data-section="products"]');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
    toast({
      title: "Support Our Farmers!",
      description: "Every purchase helps farming families across India.",
    });
  };

  const handleReadStories = () => {
    toast({
      title: "Coming Soon!",
      description: "Farmer stories section will be available soon.",
    });
  };

  // Filter products based on active tab and search query
  const filteredProducts = products.filter(product => {
    const matchesCategory = activeTab === "all" || 
      product.category.toLowerCase() === activeTab.toLowerCase();
    const matchesSearch = searchQuery === "" || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.farmer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.farmer_location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const userType = user?.user_metadata?.user_type || null;

  return (
    <div className="min-h-screen bg-background">
      <Header 
        cartItems={totalItems} 
        userType={userType} 
        onSearch={setSearchQuery}
        onCategorySelect={setActiveTab}
      />
      
      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* Features Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Truck className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold">{t('features.freeDelivery')}</h3>
                <p className="text-sm text-muted-foreground">{t('features.freeDeliveryDesc')}</p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="font-semibold">{t('features.freshGuarantee')}</h3>
                <p className="text-sm text-muted-foreground">{t('features.freshGuaranteeDesc')}</p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                  <Headphones className="w-8 h-8 text-accent-foreground" />
                </div>
                <h3 className="font-semibold">{t('features.support')}</h3>
                <p className="text-sm text-muted-foreground">{t('features.supportDesc')}</p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold">{t('features.verifiedFarmers')}</h3>
                <p className="text-sm text-muted-foreground">{t('features.verifiedFarmersDesc')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-16" data-section="products">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{t('products.title')}</h2>
              <p className="text-muted-foreground">{t('products.description')}</p>
            </div>

            {/* Category Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList className="grid w-full grid-cols-3 md:grid-cols-7 bg-muted/50">
                <TabsTrigger value="all">{t('products.categories.all')}</TabsTrigger>
                <TabsTrigger value="vegetables">{t('products.categories.vegetables')}</TabsTrigger>
                <TabsTrigger value="fruits">{t('products.categories.fruits')}</TabsTrigger>
                <TabsTrigger value="grains">{t('products.categories.grains')}</TabsTrigger>
                <TabsTrigger value="dairy">{t('products.categories.dairy')}</TabsTrigger>
                <TabsTrigger value="spices">{t('products.categories.spices')}</TabsTrigger>
                <TabsTrigger value="pulses">{t('products.categories.pulses')}</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-8">
                {loading ? (
                  <div className="text-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground text-lg">{t('common.loading')}</p>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">
                      {products.length === 0 ? t('products.noProducts') : t('products.noSearchResults')}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.slice(0, visibleProducts).map((product) => (
                      <ProductCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        price={Number(product.price)}
                        unit={product.unit}
                        image={product.image_url || "https://images.unsplash.com/photo-1546470427-e71b4be8b034?w=400&h=400&fit=crop"}
                        farmer={{
                          name: product.farmer_name,
                          location: product.farmer_location,
                          rating: 4.5 // Default rating for now
                        }}
                        category={product.category}
                        freshness={product.harvest_date ? 
                          new Date(product.harvest_date).toLocaleDateString() === new Date().toLocaleDateString() ? 
                          "Harvested Today" : `${Math.ceil((new Date().getTime() - new Date(product.harvest_date).getTime()) / (1000 * 3600 * 24))} days old`
                          : "Fresh"}
                        organic={product.organic}
                        inStock={product.quantity_available > 0}
                        onAddToCart={handleAddToCart}
                        onToggleWishlist={handleToggleWishlist}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {/* Load More */}
            {filteredProducts.length > visibleProducts && (
              <div className="text-center mt-12">
                <Button variant="outline" size="lg" onClick={handleLoadMore}>
                  Load More Products ({filteredProducts.length - visibleProducts} {t('products.remaining')})
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Farmer Quick Actions Section - Only for Farmers */}
        {userType === 'farmer' && (
          <section className="py-16 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/30 dark:to-emerald-950/30">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <Badge className="mb-4 bg-green-600 text-white">
                  🌱 Farmer Dashboard
                </Badge>
                <h2 className="text-3xl font-bold mb-6">{t('farmer.quickActions')}</h2>
                <p className="text-muted-foreground mb-8">
                  {t('farmer.manageBusiness')}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button 
                    variant="default" 
                    size="lg" 
                    className="h-24 flex-col gap-2"
                    onClick={() => navigate('/farmer-dashboard')}
                  >
                    <span className="text-2xl">📊</span>
                    {t('farmer.viewDashboard')}
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="lg" 
                    className="h-24 flex-col gap-2"
                    onClick={() => {
                      // Navigate to farmer dashboard with add product mode
                      navigate('/farmer-dashboard?action=add-product');
                    }}
                  >
                    <span className="text-2xl">➕</span>
                    {t('farmer.addProduct')}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="h-24 flex-col gap-2"
                    onClick={() => {
                      // Navigate to farmer dashboard with analytics enabled
                      navigate('/farmer-dashboard?analytics=true');
                    }}
                  >
                    <span className="text-2xl">📈</span>
                    {t('farmer.viewAnalytics')}
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Customer Farmer Highlight Section */}
        {userType !== 'farmer' && (
          <section className="py-16 gradient-earth">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <Badge className="mb-4 bg-accent text-accent-foreground">
                  🧑‍🌾 Farmer Spotlight
                </Badge>
                <h2 className="text-3xl font-bold mb-6">Meet Our Farmers</h2>
                <p className="text-muted-foreground mb-8">
                  Every purchase supports hardworking farmers across India. Join thousands of customers 
                  who are making a difference in rural communities.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="hero" onClick={handleSupportFarmers}>
                    🤝 Support Farmers
                  </Button>
                  <Button variant="outline" onClick={handleReadStories}>
                    📖 Read Their Stories
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🌾</span>
                <span className="font-bold text-lg">Kisan Marketplace</span>
              </div>
              <p className="text-primary-foreground/80 text-sm">
                {t('footer.description')}
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">{t('footer.forCustomers')}</h3>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li className="cursor-pointer hover:text-primary-foreground" onClick={() => {
                  const productsSection = document.querySelector('[data-section="products"]');
                  if (productsSection) {
                    productsSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}>{t('footer.browseProducts')}</li>
                <li className="cursor-pointer hover:text-primary-foreground" onClick={() => navigate('/cart')}>Track Orders</li>
                <li className="cursor-pointer hover:text-primary-foreground" onClick={() => toast({
                  title: "Customer Support",
                  description: "Call us at 1800-KISAN-1 or email support@kisanmarketplace.in"
                })}>Customer Support</li>
                <li className="cursor-pointer hover:text-primary-foreground" onClick={() => toast({
                  title: "Return Policy",
                  description: "100% satisfaction guarantee with easy returns within 24 hours."
                })}>Return Policy</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">{t('footer.forFarmers')}</h3>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li className="cursor-pointer hover:text-primary-foreground" onClick={() => navigate('/auth')}>Join as Farmer</li>
                <li className="cursor-pointer hover:text-primary-foreground" onClick={() => navigate('/auth')}>Sell Products</li>
                <li className="cursor-pointer hover:text-primary-foreground" onClick={() => toast({
                  title: "Farmer Resources",
                  description: "Agricultural guides, weather updates, and market insights coming soon!"
                })}>Farmer Resources</li>
                <li className="cursor-pointer hover:text-primary-foreground" onClick={handleReadStories}>Success Stories</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">{t('footer.support')}</h3>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li className="cursor-pointer hover:text-primary-foreground" onClick={() => toast({
                  title: "Help Center",
                  description: "FAQs and guides available at help.kisanmarketplace.in"
                })}>Help Center</li>
                <li className="cursor-pointer hover:text-primary-foreground" onClick={() => toast({
                  title: "Contact Us",
                  description: "📞 1800-KISAN-1 | 📧 support@kisanmarketplace.in"
                })}>Contact Us</li>
                <li className="cursor-pointer hover:text-primary-foreground" onClick={() => toast({
                  title: "Terms & Conditions",
                  description: "Legal terms and platform policies will be displayed here."
                })}>Terms & Conditions</li>
                <li className="cursor-pointer hover:text-primary-foreground" onClick={() => toast({
                  title: "Privacy Policy",
                  description: "Your data privacy and security information."
                })}>Privacy Policy</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/80">
            © 2024 Kisan Marketplace. Made with ❤️ for Indian farmers.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;