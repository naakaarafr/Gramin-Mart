import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import heroImage from "@/assets/hero-marketplace.jpg";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleShopNow = () => {
    // Scroll to products section
    const productsSection = document.querySelector('[data-section="products"]');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleJoinAsFarmer = () => {
    navigate('/auth');
  };
  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Fresh produce from Indian farmers"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-primary-foreground">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Badge */}
          <Badge className="bg-accent text-accent-foreground mb-4">
            🌾 Farm Fresh • Direct from Farmers • No Middlemen
          </Badge>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Fresh Produce
            <br />
            <span className="text-secondary font-bold">
              Direct from Farm
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Connect directly with local farmers across India. Get the freshest vegetables, 
            fruits, and grains delivered to your doorstep. Supporting farmers, serving families.
          </p>

          {/* Multilingual tagline */}
          <p className="text-sm text-primary-foreground/80 font-medium">
            किसान से सीधे आपके घर तक • வேத்तात் कुक্কিमाল • किषक होळि घरा पোहोंचावा
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button size="lg" variant="hero" onClick={handleShopNow}>
              🛒 Shop Fresh Produce
            </Button>
            <Button size="lg" variant="outline" className="bg-card/20 text-primary-foreground border-primary-foreground/30 hover:bg-card/30" onClick={handleJoinAsFarmer}>
              🧑‍🌾 Join as Farmer
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-12 text-primary-foreground/90">
            <div className="text-center">
              <div className="text-2xl font-bold">10,000+</div>
              <div className="text-sm">Farmers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">50,000+</div>
              <div className="text-sm">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">500+</div>
              <div className="text-sm">Cities Served</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">100%</div>
              <div className="text-sm">Fresh Guarantee</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-8 h-8 border-2 border-primary-foreground/50 rounded-full flex items-center justify-center">
          <div className="w-1 h-3 bg-primary-foreground/50 rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;