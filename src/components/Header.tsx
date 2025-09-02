
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ShoppingCart, User, Bell, Menu } from "lucide-react";
import LocationSelector from "./LocationSelector";
import LanguageSelector from "./LanguageSelector";
import { useTranslation } from "@/hooks/useTranslation";

interface HeaderProps {
  cartItems?: number;
  userType?: 'farmer' | 'customer' | null;
  onSearch?: (query: string) => void;
  onCategorySelect?: (category: string) => void;
}

const Header = ({ cartItems = 0, userType = null, onSearch, onCategorySelect }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentLocation, setCurrentLocation] = useState("Select Location");
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSearch = () => {
    onSearch?.(searchQuery);
  };

  const handleCategoryClick = (category: string) => {
    onCategorySelect?.(category.toLowerCase());
  };

  const handleAuthClick = () => {
    if (user) {
      signOut();
    } else {
      navigate('/auth');
    }
  };

  const handleLocationChange = (newLocation: string) => {
    setCurrentLocation(newLocation);
  };

  return (
    <header className="bg-card border-b border-border shadow-farm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">🌾</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">{t('header.title')}</h1>
              <p className="text-xs text-muted-foreground">{t('header.subtitle')}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <LanguageSelector />
            
            <LocationSelector 
              currentLocation={currentLocation}
              onLocationChange={handleLocationChange}
            />
            
            {userType && (
              <Badge 
                variant={userType === 'farmer' ? 'secondary' : 'outline'} 
                className="text-xs cursor-pointer hover:opacity-80"
                onClick={() => userType === 'farmer' && navigate('/farmer-dashboard')}
              >
                {userType === 'farmer' ? `🧑‍🌾 ${t('header.farmer')}` : `🛒 ${t('header.customer')}`}
              </Badge>
            )}

            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
            </Button>

            <Button variant="ghost" size="sm" className="relative" onClick={() => navigate('/cart')}>
              <ShoppingCart className="w-5 h-5" />
              {cartItems > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {cartItems}
                </Badge>
              )}
            </Button>

            <Button variant="ghost" size="sm" onClick={handleAuthClick}>
              <User className="w-5 h-5" />
              <span className="ml-2 hidden sm:inline">
                {user ? t('common.logout') : t('common.login')}
              </span>
            </Button>
          </div>
        </div>

        {/* Search bar */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder={t('header.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10 py-6 text-base"
            />
          </div>
          <Button className="px-8 py-6 gradient-hero" onClick={handleSearch}>
            {t('common.search')}
          </Button>
        </div>

        {/* Quick categories */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {[
            { key: 'vegetables', emoji: '🍅', label: t('products.categories.vegetables') },
            { key: 'fruits', emoji: '🥭', label: t('products.categories.fruits') },
            { key: 'grains', emoji: '🌾', label: t('products.categories.grains') },
            { key: 'dairy', emoji: '🥛', label: t('products.categories.dairy') },
            { key: 'spices', emoji: '🌶️', label: t('products.categories.spices') },
            { key: 'pulses', emoji: '🫘', label: t('products.categories.pulses') },
          ].map((category) => (
            <Button
              key={category.key}
              variant="outline"
              size="sm"
              className="whitespace-nowrap transition-smooth hover:bg-primary hover:text-primary-foreground"
              onClick={() => handleCategoryClick(category.key)}
            >
              {category.emoji} {category.label}
            </Button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
