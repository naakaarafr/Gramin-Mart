import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Heart, ShoppingCart } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  unit: string;
  image: string;
  farmer: {
    name: string;
    location: string;
    rating: number;
  };
  category: string;
  freshness: string;
  organic?: boolean;
  inStock: boolean;
  onAddToCart?: (id: string) => void;
  onToggleWishlist?: (id: string) => void;
}

const ProductCard = ({
  id,
  name,
  price,
  unit,
  image,
  farmer,
  category,
  freshness,
  organic = false,
  inStock,
  onAddToCart,
  onToggleWishlist,
}: ProductCardProps) => {
  const { t } = useTranslation();
  return (
    <Card className="group hover:shadow-product transition-smooth bg-card border-border overflow-hidden">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {organic && (
            <Badge className="bg-accent text-accent-foreground text-xs">
              🌱 {t('products.organic')}
            </Badge>
          )}
          <Badge variant="secondary" className="text-xs">
            {freshness}
          </Badge>
        </div>

        {/* Wishlist button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-3 right-3 bg-card/80 backdrop-blur-sm hover:bg-card"
          onClick={() => onToggleWishlist?.(id)}
        >
          <Heart className="w-4 h-4" />
        </Button>

        {/* Out of stock overlay */}
        {!inStock && (
          <div className="absolute inset-0 bg-muted/80 flex items-center justify-center">
            <Badge variant="destructive">{t('products.outOfStock')}</Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        {/* Product info */}
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-foreground line-clamp-2">{name}</h3>
            <Badge variant="outline" className="text-xs ml-2">
              {category}
            </Badge>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-primary">₹{price}</span>
            <span className="text-sm text-muted-foreground">/{unit}</span>
          </div>

          {/* Farmer info */}
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">🧑‍🌾 {farmer.name}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span>{farmer.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-accent text-accent" />
                <span className="font-medium">{farmer.rating}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          variant="warm"
          disabled={!inStock}
          onClick={() => onAddToCart?.(id)}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {t('products.addToCart')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;