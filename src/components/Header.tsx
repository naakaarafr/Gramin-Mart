import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ShoppingCart, User, MapPin, Bell } from "lucide-react";

interface HeaderProps {
  cartItems?: number;
  userType?: 'farmer' | 'customer' | null;
}

const Header = ({ cartItems = 0, userType = null }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="bg-card border-b border-border shadow-farm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">🌾</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">Kisan Marketplace</h1>
              <p className="text-xs text-muted-foreground">खेत से घर तक</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>Mumbai, MH</span>
            </div>
            
            {userType && (
              <Badge variant={userType === 'farmer' ? 'secondary' : 'outline'} className="text-xs">
                {userType === 'farmer' ? '🧑‍🌾 Farmer' : '🛒 Customer'}
              </Badge>
            )}

            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
            </Button>

            <Button variant="ghost" size="sm" className="relative">
              <ShoppingCart className="w-5 h-5" />
              {cartItems > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {cartItems}
                </Badge>
              )}
            </Button>

            <Button variant="ghost" size="sm">
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Search bar */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search for fresh vegetables, fruits, grains..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-6 text-base"
            />
          </div>
          <Button className="px-8 py-6 gradient-hero">
            Search
          </Button>
        </div>

        {/* Quick categories */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {['🍅 Vegetables', '🥭 Fruits', '🌾 Grains', '🥛 Dairy', '🌶️ Spices', '🫘 Pulses'].map((category) => (
            <Button
              key={category}
              variant="outline"
              size="sm"
              className="whitespace-nowrap transition-smooth hover:bg-primary hover:text-primary-foreground"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;