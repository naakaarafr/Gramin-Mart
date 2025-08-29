import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Truck, Shield, Headphones, Award } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Sample product data
const sampleProducts = [
  {
    id: "1",
    name: "Fresh Organic Tomatoes",
    price: 45,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1546470427-e71b4be8b034?w=400&h=400&fit=crop",
    farmer: {
      name: "Rajesh Kumar",
      location: "Pune, Maharashtra",
      rating: 4.8
    },
    category: "Vegetables",
    freshness: "Harvested Today",
    organic: true,
    inStock: true
  },
  {
    id: "2",
    name: "Fresh Alphonso Mangoes",
    price: 180,
    unit: "dozen",
    image: "https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=400&h=400&fit=crop",
    farmer: {
      name: "Priya Sharma",
      location: "Ratnagiri, Maharashtra",
      rating: 4.9
    },
    category: "Fruits",
    freshness: "2 days old",
    organic: false,
    inStock: true
  },
  {
    id: "3",
    name: "Farm Fresh Spinach",
    price: 25,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=400&fit=crop",
    farmer: {
      name: "Amit Patel",
      location: "Surat, Gujarat",
      rating: 4.7
    },
    category: "Vegetables",
    freshness: "Harvested Today",
    organic: true,
    inStock: true
  },
  {
    id: "4",
    name: "Premium Basmati Rice",
    price: 95,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400&h=400&fit=crop",
    farmer: {
      name: "Suresh Singh",
      location: "Haryana",
      rating: 4.6
    },
    category: "Grains",
    freshness: "Fresh Stock",
    organic: false,
    inStock: false
  },
  {
    id: "5",
    name: "Organic Turmeric Powder",
    price: 120,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1615485925600-97bed80ce387?w=400&h=400&fit=crop",
    farmer: {
      name: "Lakshmi Devi",
      location: "Kerala",
      rating: 4.9
    },
    category: "Spices",
    freshness: "Ground Fresh",
    organic: true,
    inStock: true
  },
  {
    id: "6",
    name: "Fresh Farm Milk",
    price: 65,
    unit: "liter",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop",
    farmer: {
      name: "Mohan Reddy",
      location: "Hyderabad, Telangana",
      rating: 4.8
    },
    category: "Dairy",
    freshness: "Morning Fresh",
    organic: false,
    inStock: true
  }
];

const Index = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleProducts, setVisibleProducts] = useState(8);
  const { addToCart, totalItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = (productId: string) => {
    const product = sampleProducts.find(p => p.id === productId);
    if (product) {
      addToCart(product);
      toast({
        title: "Added to cart!",
        description: `${product.name} has been added to your cart.`,
      });
    }
  };

  const handleToggleWishlist = (productId: string) => {
    const product = sampleProducts.find(p => p.id === productId);
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
  const filteredProducts = sampleProducts.filter(product => {
    const matchesCategory = activeTab === "all" || 
      product.category.toLowerCase() === activeTab.toLowerCase();
    const matchesSearch = searchQuery === "" || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.farmer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.farmer.location.toLowerCase().includes(searchQuery.toLowerCase());
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
                <h3 className="font-semibold">Free Delivery</h3>
                <p className="text-sm text-muted-foreground">On orders above ₹500</p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="font-semibold">Fresh Guarantee</h3>
                <p className="text-sm text-muted-foreground">100% fresh or money back</p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                  <Headphones className="w-8 h-8 text-accent-foreground" />
                </div>
                <h3 className="font-semibold">24/7 Support</h3>
                <p className="text-sm text-muted-foreground">In Hindi, English & regional languages</p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold">Verified Farmers</h3>
                <p className="text-sm text-muted-foreground">All farmers verified with Aadhaar</p>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-16" data-section="products">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Fresh from Farms</h2>
              <p className="text-muted-foreground">Discover fresh produce directly from verified farmers across India</p>
            </div>

            {/* Category Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList className="grid w-full grid-cols-3 md:grid-cols-7 bg-muted/50">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="vegetables">Vegetables</TabsTrigger>
                <TabsTrigger value="fruits">Fruits</TabsTrigger>
                <TabsTrigger value="grains">Grains</TabsTrigger>
                <TabsTrigger value="dairy">Dairy</TabsTrigger>
                <TabsTrigger value="spices">Spices</TabsTrigger>
                <TabsTrigger value="pulses">Pulses</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-8">
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">No products found matching your search.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.slice(0, visibleProducts).map((product) => (
                      <ProductCard
                        key={product.id}
                        {...product}
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
                  Load More Products ({filteredProducts.length - visibleProducts} remaining)
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Farmer Highlight Section */}
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
                Connecting farmers directly with customers across India. 
                Fresh produce, fair prices, no middlemen.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">For Customers</h3>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li className="cursor-pointer hover:text-primary-foreground" onClick={() => {
                  const productsSection = document.querySelector('[data-section="products"]');
                  if (productsSection) {
                    productsSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}>Browse Products</li>
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
              <h3 className="font-semibold">For Farmers</h3>
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
              <h3 className="font-semibold">Support</h3>
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