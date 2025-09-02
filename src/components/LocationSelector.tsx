
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
          const { latitude, longitude } = position.coords;
          
          // More accurate coordinate-based city detection for major Indian cities
          let detectedCity = "";
          let detectedState = "";
          
          // Delhi: 28.7041° N, 77.1025° E
          if (latitude >= 28.4 && latitude <= 28.9 && longitude >= 76.8 && longitude <= 77.5) {
            detectedCity = "New Delhi";
            detectedState = "Delhi";
          }
          // Mumbai: 19.0760° N, 72.8777° E  
          else if (latitude >= 18.9 && latitude <= 19.3 && longitude >= 72.7 && longitude <= 73.0) {
            detectedCity = "Mumbai";
            detectedState = "Maharashtra";
          }
          // Chennai: 13.0827° N, 80.2707° E
          else if (latitude >= 12.8 && latitude <= 13.3 && longitude >= 80.0 && longitude <= 80.5) {
            detectedCity = "Chennai";
            detectedState = "Tamil Nadu";
          }
          // Bangalore: 12.9716° N, 77.5946° E
          else if (latitude >= 12.8 && latitude <= 13.1 && longitude >= 77.4 && longitude <= 77.8) {
            detectedCity = "Bangalore";
            detectedState = "Karnataka";
          }
          // Hyderabad: 17.3850° N, 78.4867° E
          else if (latitude >= 17.2 && latitude <= 17.6 && longitude >= 78.2 && longitude <= 78.7) {
            detectedCity = "Hyderabad";
            detectedState = "Telangana";
          }
          // Pune: 18.5204° N, 73.8567° E
          else if (latitude >= 18.4 && latitude <= 18.7 && longitude >= 73.7 && longitude <= 74.0) {
            detectedCity = "Pune";
            detectedState = "Maharashtra";
          }
          // Ahmedabad: 23.0225° N, 72.5714° E
          else if (latitude >= 22.9 && latitude <= 23.2 && longitude >= 72.4 && longitude <= 72.7) {
            detectedCity = "Ahmedabad";
            detectedState = "Gujarat";
          }
          // Kolkata: 22.5726° N, 88.3639° E
          else if (latitude >= 22.4 && latitude <= 22.7 && longitude >= 88.2 && longitude <= 88.5) {
            detectedCity = "Kolkata";
            detectedState = "West Bengal";
          }
          // Jaipur: 26.9124° N, 75.7873° E
          else if (latitude >= 26.8 && latitude <= 27.0 && longitude >= 75.6 && longitude <= 76.0) {
            detectedCity = "Jaipur";
            detectedState = "Rajasthan";
          }
          // Surat: 21.1702° N, 72.8311° E
          else if (latitude >= 21.0 && latitude <= 21.3 && longitude >= 72.7 && longitude <= 73.0) {
            detectedCity = "Surat";
            detectedState = "Gujarat";
          }
          
          console.log(`Detected coordinates: ${latitude}, ${longitude}`);
          
          if (detectedCity && detectedState) {
            console.log(`Detected location: ${detectedCity}, ${detectedState}`);
            const detectedLocation = `${detectedCity}, ${detectedState}`;
            onLocationChange(detectedLocation);
            setSelectedState(detectedState);
            setSelectedCity(detectedCity);
            setIsOpen(false);
            
            toast({
              title: "Location detected!",
              description: `Set to ${detectedLocation}. You can change it anytime.`,
            });
          } else {
            toast({
              title: "Location not recognized",
              description: "Please select your location manually from the list.",
              variant: "destructive"
            });
          }
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
