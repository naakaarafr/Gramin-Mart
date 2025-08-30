
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface LocationSelectorProps {
  currentLocation: string;
  onLocationChange: (location: string) => void;
}

const LocationSelector = ({ currentLocation, onLocationChange }: LocationSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [pincode, setPincode] = useState("");

  // Major Indian states and their cities
  const locationData = {
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur", "Kolhapur"],
    "Delhi": ["New Delhi", "Central Delhi", "South Delhi", "North Delhi", "East Delhi", "West Delhi"],
    "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum", "Gulbarga"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur"],
    "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Bardhaman"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Meerut", "Varanasi"],
    "Haryana": ["Gurgaon", "Faridabad", "Panipat", "Ambala", "Karnal", "Rohtak"],
    "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali"],
    "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam"],
    "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Tirupati"],
    "Kerala": ["Kochi", "Thiruvananthapuram", "Kozhikode", "Thrissur", "Kollam", "Alappuzha"],
    "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur"]
  };

  const handleLocationUpdate = () => {
    if (!selectedState || !selectedCity) {
      toast({
        title: "Please select location",
        description: "Both state and city are required.",
        variant: "destructive"
      });
      return;
    }

    const newLocation = pincode 
      ? `${selectedCity}, ${selectedState} - ${pincode}`
      : `${selectedCity}, ${selectedState}`;
    
    onLocationChange(newLocation);
    setIsOpen(false);
    
    // Reset form after successful update
    setSelectedState("");
    setSelectedCity("");
    setPincode("");
    
    toast({
      title: "Location updated!",
      description: `Delivery location set to ${newLocation}`,
    });
  };

  const detectCurrentLocation = () => {
    if (navigator.geolocation) {
      toast({
        title: "Detecting location...",
        description: "Please wait while we detect your location.",
      });
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // For demo purposes, we'll use a major city based on coordinates
          // In production, you'd use reverse geocoding API
          const { latitude, longitude } = position.coords;
          
          // Simple logic to determine city based on coordinates (demo only)
          let detectedCity = "Mumbai";
          let detectedState = "Maharashtra";
          
          // Basic coordinate-based city detection (simplified)
          if (latitude > 28.4 && latitude < 28.8 && longitude > 77.0 && longitude < 77.4) {
            detectedCity = "New Delhi";
            detectedState = "Delhi";
          } else if (latitude > 12.8 && latitude < 13.2 && longitude > 77.4 && longitude < 77.8) {
            detectedCity = "Bangalore";
            detectedState = "Karnataka";
          } else if (latitude > 13.0 && latitude < 13.2 && longitude > 80.1 && longitude < 80.3) {
            detectedCity = "Chennai";
            detectedState = "Tamil Nadu";
          }
          
          const detectedLocation = `${detectedCity}, ${detectedState}`;
          onLocationChange(detectedLocation);
          setSelectedState(detectedState);
          setSelectedCity(detectedCity);
          setIsOpen(false);
          
          toast({
            title: "Location detected!",
            description: `Set to ${detectedLocation}. You can change it anytime.`,
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast({
            title: "Location access denied",
            description: "Please select your location manually.",
            variant: "destructive"
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    } else {
      toast({
        title: "Geolocation not supported",
        description: "Please select your location manually.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <MapPin className="w-4 h-4" />
          <span>{currentLocation}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Delivery Location</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={detectCurrentLocation}
          >
            <MapPin className="w-4 h-4 mr-2" />
            Use Current Location
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or select manually</span>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">State</label>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(locationData).map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">City</label>
              <Select 
                value={selectedCity} 
                onValueChange={setSelectedCity}
                disabled={!selectedState}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {selectedState && locationData[selectedState as keyof typeof locationData]?.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Pincode (Optional)</label>
              <Input
                type="text"
                placeholder="Enter pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                maxLength={6}
              />
            </div>
          </div>

          <Button onClick={handleLocationUpdate} className="w-full">
            Update Location
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocationSelector;
